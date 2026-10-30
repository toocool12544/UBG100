import mqtt, { MqttClient } from 'mqtt';
import { safeStorage } from './storage';

export interface UserSessionData {
  sessionId: string;
  guestName: string;
  ip: string;
  userAgent: string;
  deviceType: 'laptop' | 'phone' | 'tablet' | 'desktop';
  connectedAt: number;
  lastPing: number;
  isKicked: boolean;
  isAdmin?: boolean;
  currentRoute?: string;
}

// Applet-specific isolated channel namespace on public live broker
const APPLET_ID = '0454c44b';
const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const TOPIC_PRESENCE_WILDCARD = `auroraos/${APPLET_ID}/presence/+`;
const TOPIC_PRESENCE_PREFIX = `auroraos/${APPLET_ID}/presence/`;
const TOPIC_KICK = `auroraos/${APPLET_ID}/kick`;
const TOPIC_PING_REQUEST = `auroraos/${APPLET_ID}/ping_request`;
const TOPIC_PROMOTE = `auroraos/${APPLET_ID}/promote`;

class SessionManager {
  private sessionId: string;
  private guestName: string;
  private deviceType: 'laptop' | 'phone' | 'tablet' | 'desktop';
  private clientIp = 'Active Network Client';
  private mqttClient: MqttClient | null = null;
  private channel: BroadcastChannel | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pruneInterval: NodeJS.Timeout | null = null;
  private isKicked = false;
  private isAdmin = false;

  // Global live active session store (populated by real-time heartbeat pings from all devices)
  private activeSessionsMap = new Map<string, UserSessionData>();
  private sessionCallbacks: Set<(sessions: UserSessionData[]) => void> = new Set();

  constructor() {
    // 1. Assign or restore unique sessionId
    let sid = safeStorage.getItem('aurora_session_id');
    if (!sid) {
      sid = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      safeStorage.setItem('aurora_session_id', sid);
    }
    this.sessionId = sid;

    // 2. Assign random guest profile name (e.g., "Guest_482")
    let gname = safeStorage.getItem('aurora_guest_name');
    if (!gname) {
      const randomNum = Math.floor(100 + Math.random() * 900);
      gname = `Guest_${randomNum}`;
      safeStorage.setItem('aurora_guest_name', gname);
    }
    this.guestName = gname;

    // 3. Detect device type
    this.deviceType = this.detectDeviceType();

    // 4. Restore Admin status if user authenticated previously
    if (safeStorage.getItem('aurora_is_admin') === 'true') {
      this.isAdmin = true;
      if (this.guestName.startsWith('Guest_')) {
        this.guestName = this.guestName.replace('Guest_', 'Admin_');
      }
    }

    // Clean up any stale kick markers so users can return freely
    safeStorage.removeItem('aurora_kicked_status');

    // 5. Initialize cross-tab BroadcastChannel
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('aurora_realtime_broadcast');
        this.channel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported', err);
      }
    }
  }

  public init() {
    this.addSelfToSessions();
    this.connectMqtt();
    this.startHeartbeatLoop();
    this.startPruneLoop();
    this.fetchBackendSessions();

    // Broadcast offline state on page exit
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.publishOfflineState();
      });
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getGuestName(): string {
    return this.guestName;
  }

  public isUserAdmin(): boolean {
    return this.isAdmin;
  }

  public isUserKicked(): boolean {
    return this.isKicked;
  }

  public getSessionsList(): UserSessionData[] {
    return Array.from(this.activeSessionsMap.values());
  }

  public onSessionsUpdate(callback: (sessions: UserSessionData[]) => void): () => void {
    this.sessionCallbacks.add(callback);
    // Send immediate snapshot
    callback(this.getSessionsList());
    return () => {
      this.sessionCallbacks.delete(callback);
    };
  }

  private detectDeviceType(): 'laptop' | 'phone' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'laptop';
    const ua = navigator.userAgent.toLowerCase();
    if (/tablet|ipad/.test(ua)) return 'tablet';
    if (/mobile|iphone|android/.test(ua)) return 'phone';
    if (/macintosh|windows|linux/.test(ua)) return 'laptop';
    return 'desktop';
  }

  private addSelfToSessions() {
    const selfSession: UserSessionData = {
      sessionId: this.sessionId,
      guestName: this.guestName,
      ip: this.clientIp,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
      deviceType: this.deviceType,
      connectedAt: Date.now(),
      lastPing: Date.now(),
      isKicked: false,
      isAdmin: this.isAdmin,
      currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
    };
    this.activeSessionsMap.set(this.sessionId, selfSession);
    this.emitSessionsChange();
  }

  // Connect to the Public Live WSS Database/Broker
  private connectMqtt() {
    try {
      if (this.mqttClient) {
        this.mqttClient.end(true);
      }

      const clientId = `aurora_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      this.mqttClient = mqtt.connect(MQTT_BROKER_URL, {
        clientId,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 3000,
      });

      this.mqttClient.on('connect', () => {
        console.log('[Live State] Connected to public realtime database');

        // Subscribe to global active presence list, kick events, and ping requests
        this.mqttClient?.subscribe(
          [
            TOPIC_PRESENCE_WILDCARD,
            TOPIC_KICK,
            TOPIC_PING_REQUEST,
            TOPIC_PROMOTE,
          ],
          (err) => {
            if (!err) {
              // Immediately broadcast initial heartbeat so other devices see us instantly!
              this.broadcastHeartbeat();
              // Request other active devices to ping back
              this.requestPingsFromAll();
            }
          }
        );
      });

      this.mqttClient.on('message', (topic, message) => {
        this.handleMqttMessage(topic, message.toString());
      });

      this.mqttClient.on('error', (err) => {
        console.warn('[Live State] Connection note:', err);
      });
    } catch (e) {
      console.warn('[Live State] Realtime initialization error:', e);
    }
  }

  private handleMqttMessage(topic: string, payloadStr: string) {
    try {
      const data = JSON.parse(payloadStr);

      // 1. Kick Event: remote FORCE_LOGOUT broadcast
      if (topic === TOPIC_KICK) {
        if (data.type === 'FORCE_LOGOUT') {
          if (data.targetSessionId === this.sessionId || data.targetSessionId === 'ALL') {
            this.executeForceLogout(data.reason || 'Kicked by Administrator');
          } else if (data.targetSessionId) {
            // Update local memory that this user was kicked
            const s = this.activeSessionsMap.get(data.targetSessionId);
            if (s) {
              s.isKicked = true;
              this.emitSessionsChange();
            }
          }
        }
        return;
      }

      // 2. Ping Request: Admin asks all devices to broadcast immediately
      if (topic === TOPIC_PING_REQUEST) {
        this.broadcastHeartbeat();
        return;
      }

      // 3. Admin Promotion Event
      if (topic === TOPIC_PROMOTE) {
        if (data.sessionId) {
          const s = this.activeSessionsMap.get(data.sessionId);
          if (s) {
            s.isAdmin = true;
            if (data.guestName) s.guestName = data.guestName;
            this.emitSessionsChange();
          }
        }
        return;
      }

      // 4. Heartbeat Presence message from ANY device on the public network
      if (topic.startsWith(TOPIC_PRESENCE_PREFIX)) {
        const sid = topic.replace(TOPIC_PRESENCE_PREFIX, '');

        if (data.status === 'offline') {
          this.activeSessionsMap.delete(sid);
          this.emitSessionsChange();
          return;
        }

        const sessionData: UserSessionData = {
          sessionId: sid,
          guestName: data.guestName || `Guest_${sid.slice(-3)}`,
          ip: data.ip || 'Remote Device',
          userAgent: data.userAgent || 'Web Browser',
          deviceType: data.deviceType || 'phone',
          connectedAt: data.connectedAt || Date.now(),
          lastPing: Date.now(), // fresh ping recorded right now!
          isKicked: data.isKicked || false,
          isAdmin: data.isAdmin || false,
          currentRoute: data.currentRoute || '/',
        };

        this.activeSessionsMap.set(sid, sessionData);
        this.emitSessionsChange();
      }
    } catch {}
  }

  // Broadcast immediate Heartbeat Ping to public active list
  public broadcastHeartbeat() {
    if (this.isKicked) return;

    const payload = JSON.stringify({
      sessionId: this.sessionId,
      guestName: this.guestName,
      deviceType: this.deviceType,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ip: this.clientIp,
      connectedAt: Date.now(),
      lastPing: Date.now(),
      isAdmin: this.isAdmin,
      isKicked: false,
      status: 'online',
      currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
    });

    // 1. Publish to public live MQTT topic
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(`${TOPIC_PRESENCE_PREFIX}${this.sessionId}`, payload);
    }

    // 2. Publish to local BroadcastChannel for same-browser tabs
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'PRESENCE_PING',
          session: JSON.parse(payload),
        });
      } catch {}
    }

    // 3. Also ping backend server
    this.pingBackend();
  }

  private publishOfflineState() {
    if (this.mqttClient && this.mqttClient.connected) {
      const payload = JSON.stringify({
        sessionId: this.sessionId,
        status: 'offline',
      });
      this.mqttClient.publish(`${TOPIC_PRESENCE_PREFIX}${this.sessionId}`, payload);
    }
  }

  private startHeartbeatLoop() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    // Fast 3.5 second heartbeat ping guarantees instant live updates
    this.heartbeatInterval = setInterval(() => {
      this.broadcastHeartbeat();
    }, 3500);
  }

  // Remove stale devices that stopped pinging (> 11 seconds without heartbeat)
  private startPruneLoop() {
    if (this.pruneInterval) clearInterval(this.pruneInterval);
    this.pruneInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      for (const [sid, session] of this.activeSessionsMap.entries()) {
        if (sid === this.sessionId) continue; // Keep self
        if (now - session.lastPing > 11000) {
          this.activeSessionsMap.delete(sid);
          changed = true;
        }
      }

      if (changed) {
        this.emitSessionsChange();
      }
    }, 4000);
  }

  private emitSessionsChange() {
    const list = this.getSessionsList();
    for (const cb of this.sessionCallbacks) {
      try {
        cb(list);
      } catch {}
    }
  }

  private handleBroadcastMessage(data: any) {
    if (!data) return;

    if (data.type === 'FORCE_LOGOUT') {
      if (data.targetSessionId === this.sessionId || data.targetSessionId === 'ALL') {
        this.executeForceLogout('Kicked via Admin Local Broadcast');
      }
    } else if (data.type === 'PRESENCE_PING' && data.session) {
      this.activeSessionsMap.set(data.session.sessionId, {
        ...data.session,
        lastPing: Date.now(),
      });
      this.emitSessionsChange();
    }
  }

  // Ask all active devices on the network to ping back immediately
  public requestPingsFromAll() {
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(TOPIC_PING_REQUEST, JSON.stringify({ t: Date.now() }));
    }
  }

  // 4. User Reaction: completely block page layout and trigger window.location.replace("https://google.com")
  public executeForceLogout(reason?: string) {
    if (this.isKicked) return;
    this.isKicked = true;

    // Clear session so when user comes back, they get a clean session and can return!
    safeStorage.removeItem('aurora_session_id');
    safeStorage.removeItem('aurora_kicked_status');

    // Notify listeners / React components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:force_logout', {
          detail: { reason: reason || 'FORCE_LOGOUT' },
        })
      );
    }

    // Completely block the page layout immediately
    this.injectLockoutOverlay();

    // Trigger instant replacement redirect to Google
    setTimeout(() => {
      try {
        window.location.replace('https://google.com');
      } catch {
        window.location.href = 'https://google.com';
      }
    }, 450);
  }

  private injectLockoutOverlay() {
    try {
      const existing = document.getElementById('aurora-lockout-overlay');
      if (existing) return;

      const overlay = document.createElement('div');
      overlay.id = 'aurora-lockout-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '9999999';
      overlay.style.backgroundColor = '#000000';
      overlay.style.color = '#ef4444';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.fontFamily = 'monospace';
      overlay.style.textAlign = 'center';
      overlay.style.padding = '24px';
      overlay.innerHTML = `
        <div style="max-width: 500px; padding: 32px; border: 2px solid #ef4444; border-radius: 16px; background-color: rgba(239, 68, 68, 0.1); box-shadow: 0 0 50px rgba(239, 68, 68, 0.5);">
          <div style="font-size: 48px; margin-bottom: 16px;">⛔</div>
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ffffff; margin-bottom: 8px;">FORCE LOGOUT</h1>
          <p style="font-size: 14px; color: #fca5a5; margin-bottom: 24px; line-height: 1.5;">Your session has been terminated by the Administrator. You are being removed from the gaming network...</p>
          <div style="display: inline-block; padding: 8px 16px; border-radius: 8px; background-color: #ef4444; color: #ffffff; font-weight: bold; font-size: 12px; letter-spacing: 1px;">REDIRECTING TO GOOGLE...</div>
        </div>
      `;
      document.body.appendChild(overlay);
    } catch {}
  }

  // The Kick Action: Broadcast FORCE_LOGOUT signal to that specific user across all devices & networks
  public async kickUser(targetSessionId: string): Promise<boolean> {
    const kickPayload = JSON.stringify({
      type: 'FORCE_LOGOUT',
      targetSessionId,
      adminSessionId: this.sessionId,
      timestamp: Date.now(),
    });

    // 1. Broadcast via public live MQTT broker to every device everywhere
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(TOPIC_KICK, kickPayload);
    }

    // 2. Broadcast via local cross-tab channel
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'FORCE_LOGOUT',
          targetSessionId,
        });
      } catch {}
    }

    // 3. If kicking this current device session, trigger logout immediately
    if (targetSessionId === this.sessionId) {
      this.executeForceLogout('Admin self-kick');
      return true;
    }

    // Update local state
    const target = this.activeSessionsMap.get(targetSessionId);
    if (target) {
      target.isKicked = true;
      this.emitSessionsChange();
    }

    // 4. Also post to backend server
    try {
      fetch('/api/realtime/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: targetSessionId }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  // Bulk Kick Action
  public async kickAllUsers(): Promise<boolean> {
    const kickPayload = JSON.stringify({
      type: 'FORCE_LOGOUT',
      targetSessionId: 'ALL',
      adminSessionId: this.sessionId,
      timestamp: Date.now(),
    });

    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(TOPIC_KICK, kickPayload);
    }

    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'FORCE_LOGOUT',
          targetSessionId: 'ALL',
        });
      } catch {}
    }

    for (const [sid, s] of this.activeSessionsMap.entries()) {
      if (sid !== this.sessionId) {
        s.isKicked = true;
      }
    }
    this.emitSessionsChange();

    try {
      fetch('/api/realtime/kick-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exceptSessionId: this.sessionId }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  // Promote to Admin
  public async promoteToAdmin(password: string): Promise<boolean> {
    const valid = ['1234', 'admin', 'zahid'];
    const isValidPassword = valid.includes(password.trim());
    if (!isValidPassword) return false;

    this.isAdmin = true;
    if (this.guestName.startsWith('Guest_')) {
      this.guestName = this.guestName.replace('Guest_', 'Admin_');
      safeStorage.setItem('aurora_guest_name', this.guestName);
    }
    safeStorage.setItem('aurora_is_admin', 'true');

    // Update self in session map
    const self = this.activeSessionsMap.get(this.sessionId);
    if (self) {
      self.isAdmin = true;
      self.guestName = this.guestName;
    }
    this.emitSessionsChange();

    // Broadcast promotion to all devices
    const promoPayload = JSON.stringify({
      sessionId: this.sessionId,
      guestName: this.guestName,
      isAdmin: true,
    });

    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish(TOPIC_PROMOTE, promoPayload);
      this.broadcastHeartbeat();
    }

    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'ADMIN_PROMOTION',
          sessionId: this.sessionId,
          guestName: this.guestName,
        });
      } catch {}
    }

    try {
      fetch('/api/realtime/promote-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          password,
        }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  // Server Fallbacks
  private async fetchBackendSessions() {
    try {
      const res = await fetch('/api/realtime/sessions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sessions)) {
          for (const s of data.sessions) {
            if (!this.activeSessionsMap.has(s.sessionId)) {
              this.activeSessionsMap.set(s.sessionId, s);
            }
          }
          this.emitSessionsChange();
        }
      }
    } catch {}
  }

  private async pingBackend() {
    try {
      fetch('/api/realtime/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      }).catch(() => {});
    } catch {}
  }

  public destroy() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.pruneInterval) clearInterval(this.pruneInterval);
    if (this.channel) this.channel.close();
    if (this.mqttClient) {
      this.publishOfflineState();
      this.mqttClient.end(true);
    }
  }
}

export const sessionManager = new SessionManager();
