import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mqtt from 'mqtt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Set Cross-Origin Isolation and security headers
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Interface for live user sessions
export interface UserSession {
  sessionId: string;
  guestName: string;
  ip: string;
  userAgent: string;
  deviceType: 'laptop' | 'phone' | 'tablet' | 'desktop';
  connectedAt: number;
  lastPing: number;
  isKicked: boolean;
  isAdmin: boolean;
  currentRoute?: string;
}

// In-memory real-time state database
const activeSessions = new Map<string, UserSession>();
const sseClients = new Map<string, express.Response>();

// Public Live Database Broker Integration
const APPLET_ID = '0454c44b';
const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const TOPIC_PRESENCE_WILDCARD = `auroraos/${APPLET_ID}/presence/+`;
const TOPIC_KICK = `auroraos/${APPLET_ID}/kick`;

let mqttServerClient: mqtt.MqttClient | null = null;
try {
  mqttServerClient = mqtt.connect(MQTT_BROKER_URL, {
    clientId: `aurora_server_${Date.now()}`,
    clean: true,
  });

  mqttServerClient.on('connect', () => {
    console.log('[Server Live State] Connected to public realtime broker');
    mqttServerClient?.subscribe([TOPIC_PRESENCE_WILDCARD, TOPIC_KICK]);
  });

  mqttServerClient.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      if (topic.startsWith(`auroraos/${APPLET_ID}/presence/`)) {
        const sid = topic.replace(`auroraos/${APPLET_ID}/presence/`, '');
        if (data.status === 'offline') {
          activeSessions.delete(sid);
        } else {
          activeSessions.set(sid, {
            sessionId: sid,
            guestName: data.guestName || `Guest_${sid.slice(-3)}`,
            ip: data.ip || 'Remote Device',
            userAgent: data.userAgent || 'Web Client',
            deviceType: data.deviceType || 'phone',
            connectedAt: data.connectedAt || Date.now(),
            lastPing: Date.now(),
            isKicked: data.isKicked || false,
            isAdmin: data.isAdmin || false,
            currentRoute: data.currentRoute || '/',
          });
        }
        broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));
      }
    } catch {}
  });
} catch {}

// Broadcast to all active clients (e.g. admins monitoring the user list)
function broadcastToAll(eventType: string, data: unknown) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [sid, clientRes] of sseClients.entries()) {
    try {
      clientRes.write(payload);
    } catch {
      sseClients.delete(sid);
    }
  }
}

// Send event specifically to a target session
function sendToSession(sessionId: string, eventType: string, data: unknown) {
  const clientRes = sseClients.get(sessionId);
  if (clientRes) {
    try {
      clientRes.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      sseClients.delete(sessionId);
    }
  }
}

// Clean stale sessions (disconnected > 40s)
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [sid, session] of activeSessions.entries()) {
    if (now - session.lastPing > 40000) {
      activeSessions.delete(sid);
      sseClients.delete(sid);
      changed = true;
    }
  }
  if (changed) {
    broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));
  }
}, 10000);

// API Routes
// 1. Get all active sessions
app.get('/api/realtime/sessions', (_req, res) => {
  res.json({ sessions: Array.from(activeSessions.values()) });
});

// 2. User Tracking: Register or renew a guest session
app.post('/api/realtime/register', (req, res) => {
  const { sessionId, guestName, deviceType, currentRoute } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const existing = activeSessions.get(sessionId);

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  const userAgent = (req.headers['user-agent'] as string) || 'Browser Client';

  // Assign random guest profile name if not provided (e.g., "Guest_482")
  const assignedName =
    guestName || existing?.guestName || `Guest_${Math.floor(100 + Math.random() * 900)}`;

  const session: UserSession = {
    sessionId,
    guestName: assignedName,
    ip,
    userAgent,
    deviceType: deviceType || 'laptop',
    connectedAt: existing?.connectedAt || Date.now(),
    lastPing: Date.now(),
    isKicked: false,
    isAdmin: existing?.isAdmin || false,
    currentRoute: currentRoute || '/',
  };

  activeSessions.set(sessionId, session);
  broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));
  res.json({ session });
});

// Promote session to Admin when correct password is submitted
app.post('/api/realtime/promote-admin', (req, res) => {
  const { sessionId, password } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const validPasswords = ['1234', 'admin', 'zahid'];
  if (!validPasswords.includes(password?.toString().trim())) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const session = activeSessions.get(sessionId);
  if (session) {
    session.isAdmin = true;
    if (session.guestName.startsWith('Guest_')) {
      session.guestName = session.guestName.replace('Guest_', 'Admin_');
    }
    broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));
    return res.json({ success: true, session });
  }

  res.status(404).json({ error: 'Session not found' });
});

// 3. User Heartbeat / Ping
app.post('/api/realtime/ping', (req, res) => {
  const { sessionId, currentRoute } = req.body;
  if (sessionId && activeSessions.has(sessionId)) {
    const s = activeSessions.get(sessionId)!;
    s.lastPing = Date.now();
    if (currentRoute) s.currentRoute = currentRoute;
    res.json({ ok: true, isKicked: s.isKicked, isAdmin: s.isAdmin });
  } else {
    res.json({ ok: false });
  }
});

// 4. SSE Real-Time Stream for instant alerts & session list syncing
app.get('/api/realtime/events', (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    return res.status(400).send('sessionId is required');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.set(sessionId, res);

  // Send initial session list immediately
  res.write(
    `event: SESSIONS_UPDATE\ndata: ${JSON.stringify(Array.from(activeSessions.values()))}\n\n`
  );

  req.on('close', () => {
    sseClients.delete(sessionId);
  });
});

// 5. The Kick Action: Broadcast FORCE_LOGOUT signal to that specific user session
app.post('/api/realtime/kick', (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId required' });
  }

  const session = activeSessions.get(sessionId);
  if (session) {
    session.isKicked = true;
  }

  // 1. Send FORCE_LOGOUT specifically to the user's active session
  sendToSession(sessionId, 'FORCE_LOGOUT', {
    sessionId,
    message: 'FORCE_LOGOUT: Your session was terminated by the administrator.',
    redirectUrl: 'https://google.com',
  });

  // Broadcast to global public MQTT network
  if (mqttServerClient && mqttServerClient.connected) {
    mqttServerClient.publish(
      TOPIC_KICK,
      JSON.stringify({
        type: 'FORCE_LOGOUT',
        targetSessionId: sessionId,
        timestamp: Date.now(),
      })
    );
  }

  // 2. Broadcast updated session list to all admins
  broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));

  res.json({ success: true, kickedSessionId: sessionId });
});

// 6. Bulk Kick All Users (Except requesting admin session)
app.post('/api/realtime/kick-all', (req, res) => {
  const { exceptSessionId } = req.body;
  for (const [sid, session] of activeSessions.entries()) {
    if (sid !== exceptSessionId) {
      session.isKicked = true;
      sendToSession(sid, 'FORCE_LOGOUT', {
        sessionId: sid,
        message: 'FORCE_LOGOUT: All guest sessions terminated by administrator.',
        redirectUrl: 'https://google.com',
      });
    }
  }

  if (mqttServerClient && mqttServerClient.connected) {
    mqttServerClient.publish(
      TOPIC_KICK,
      JSON.stringify({
        type: 'FORCE_LOGOUT',
        targetSessionId: 'ALL',
        timestamp: Date.now(),
      })
    );
  }

  broadcastToAll('SESSIONS_UPDATE', Array.from(activeSessions.values()));
  res.json({ success: true });
});

// Server boot & Vite integration
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
