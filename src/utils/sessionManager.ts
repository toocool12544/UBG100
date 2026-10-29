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

class SessionManager {
  private sessionId: string;
  private guestName: string;
  private channel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private sessionCallbacks: Set<(sessions: UserSessionData[]) => void> = new Set();
  private isKicked = false;
  private isAdmin = false;

  constructor() {
    // 1. Assign or restore unique sessionId
    let sid = safeStorage.getItem('aurora_session_id');
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
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

    // 3. Initialize cross-tab BroadcastChannel
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

    // Clean up any stale kick markers so users can return freely
    safeStorage.removeItem('aurora_kicked_status');

    // Restore Admin status if user authenticated previously
    if (safeStorage.getItem('aurora_is_admin') === 'true') {
      this.isAdmin = true;
      if (this.guestName.startsWith('Guest_')) {
        this.guestName = this.guestName.replace('Guest_', 'Admin_');
      }
    }
  }

  public init() {
    this.registerOnServer();
    this.connectSSE();
    this.startHeartbeat();
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getGuestName(): string {
    return this.guestName;
  }

  public isUserKicked(): boolean {
    return this.isKicked;
  }

  public onSessionsUpdate(callback: (sessions: UserSessionData[]) => void): () => void {
    this.sessionCallbacks.add(callback);
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

  private async registerOnServer() {
    try {
      const response = await fetch('/api/realtime/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          guestName: this.guestName,
          deviceType: this.detectDeviceType(),
          currentRoute: window.location.pathname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isKicked) {
          this.executeForceLogout('Session blocked on server');
        }
      }
    } catch {
      // Backend registration failed or offline
    }
  }

  private connectSSE() {
    if (typeof EventSource === 'undefined') return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource(`/api/realtime/events?sessionId=${encodeURIComponent(this.sessionId)}`);

      this.eventSource.addEventListener('SESSIONS_UPDATE', (event) => {
        try {
          const sessions: UserSessionData[] = JSON.parse(event.data);
          this.notifySessionsUpdate(sessions);
        } catch {}
      });

      this.eventSource.addEventListener('FORCE_LOGOUT', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.sessionId === this.sessionId || !data.sessionId) {
            this.executeForceLogout(data.message || 'FORCE_LOGOUT');
          }
        } catch {
          this.executeForceLogout('FORCE_LOGOUT');
        }
      });

      this.eventSource.onerror = () => {
        // SSE reconnect handles automatically
      };
    } catch {}
  }

  private startHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/realtime/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.sessionId,
            currentRoute: window.location.pathname,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isKicked) {
            this.executeForceLogout('Session flagged as kicked during heartbeat');
          }
        }
      } catch {}
    }, 10000);
  }

  private handleBroadcastMessage(data: any) {
    if (!data) return;

    if (data.type === 'FORCE_LOGOUT') {
      if (data.targetSessionId === this.sessionId || data.targetSessionId === 'ALL') {
        this.executeForceLogout('Kicked via Admin Broadcast');
      }
    } else if (data.type === 'SESSIONS_UPDATE' && Array.isArray(data.sessions)) {
      this.notifySessionsUpdate(data.sessions);
    }
  }

  private notifySessionsUpdate(sessions: UserSessionData[]) {
    // If our session is in the list and marked kicked, trigger logout
    const mySession = sessions.find((s) => s.sessionId === this.sessionId);
    if (mySession?.isKicked) {
      this.executeForceLogout('Admin kicked this session');
      return;
    }

    for (const cb of this.sessionCallbacks) {
      try {
        cb(sessions);
      } catch {}
    }
  }

  // 4. User Reaction: completely block page layout and trigger window.location.replace("https://google.com")
  public executeForceLogout(reason?: string) {
    if (this.isKicked) return;
    this.isKicked = true;

    // Clear session so when user comes back, they get a clean session and are not permanently blocked
    safeStorage.removeItem('aurora_session_id');
    safeStorage.removeItem('aurora_kicked_status');

    // Notify listeners / React components
    window.dispatchEvent(
      new CustomEvent('aurora:force_logout', {
        detail: { reason: reason || 'FORCE_LOGOUT' },
      })
    );

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

  // Admin Kick Methods
  public async kickUser(targetSessionId: string): Promise<boolean> {
    // 1. Broadcast locally across tabs
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'FORCE_LOGOUT',
          targetSessionId,
        });
      } catch {}
    }

    // 2. If kicking this current device session, trigger logout immediately
    if (targetSessionId === this.sessionId) {
      this.executeForceLogout('Admin self-kick');
      return true;
    }

    // 3. Post to backend server
    try {
      const res = await fetch('/api/realtime/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: targetSessionId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async kickAllUsers(): Promise<boolean> {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'FORCE_LOGOUT',
          targetSessionId: 'ALL',
        });
      } catch {}
    }

    try {
      const res = await fetch('/api/realtime/kick-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exceptSessionId: this.sessionId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public isUserAdmin(): boolean {
    return this.isAdmin;
  }

  // The people who go into the app and knows the passwords become admin when they enter password
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

    // Notify other tabs
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
      const res = await fetch('/api/realtime/promote-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          password,
        }),
      });
      return res.ok;
    } catch {
      return true;
    }
  }

  public destroy() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.eventSource) this.eventSource.close();
    if (this.channel) this.channel.close();
  }
}

export const sessionManager = new SessionManager();
