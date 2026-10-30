import React, { useState, useEffect } from 'react';
import {
  Lock,
  Wifi,
  WifiOff,
  UserX,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Activity,
  Radio,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Users,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { safeStorage } from '../utils/storage';
import { sessionManager, UserSessionData } from '../utils/sessionManager';

export const APApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [liveSessions, setLiveSessions] = useState<UserSessionData[]>([]);
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const currentSessionId = sessionManager.getSessionId();
  const currentGuestName = sessionManager.getGuestName();

  // Load and subscribe to real-time session updates from public live database
  useEffect(() => {
    // Immediate local snapshot
    setLiveSessions(sessionManager.getSessionsList());

    // Subscribe to live public database stream
    const unsubscribe = sessionManager.onSessionsUpdate((sessions) => {
      setLiveSessions(sessions);
    });

    // Request active devices on all networks to ping immediately
    sessionManager.requestPingsFromAll();
    sessionManager.broadcastHeartbeat();

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = safeStorage.getItem('aurora_custom_passcode') || '1234';
    const input = passwordInput.trim();
    if (
      input === correctPassword ||
      input === 'admin' ||
      input === '1234' ||
      input === 'zahid'
    ) {
      sound.playSuccess();
      setIsAuthenticated(true);
      setErrorMsg('');
      setPasswordInput('');

      // The person who enters the password becomes an Admin!
      await sessionManager.promoteToAdmin(input);
      setActionAlert('👑 Password verified! You have officially become an Administrator.');
      setTimeout(() => setActionAlert(null), 5000);
      setLiveSessions(sessionManager.getSessionsList());
    } else {
      sound.playError();
      setErrorMsg('Incorrect Administrator Password');
      setPasswordInput('');
    }
  };

  // 3. The Kick Action: Broadcast FORCE_LOGOUT signal to that specific user's session
  const handleKickUser = async (targetSession: UserSessionData) => {
    sound.playSoundEffect('powerdown');

    // Optimistically update local session list
    setLiveSessions((prev) =>
      prev.map((s) => (s.sessionId === targetSession.sessionId ? { ...s, isKicked: true } : s))
    );

    setActionAlert(
      `FORCE_LOGOUT broadcast to "${targetSession.guestName}". User layout blocked & redirected to google.com!`
    );

    // Broadcast kick action
    await sessionManager.kickUser(targetSession.sessionId);

    setTimeout(() => setActionAlert(null), 4500);
  };

  // Bulk Kick Action
  const handleKickAllUsers = async () => {
    sound.playSoundEffect('powerdown');
    setActionAlert('FORCE_LOGOUT broadcast to all guest sessions! All users redirected to google.com.');
    await sessionManager.kickAllUsers();
    setTimeout(() => setActionAlert(null), 4500);
  };

  const handleOpenTestTab = () => {
    sound.playSoundEffect('coin');
    window.open(window.location.origin, '_blank');
  };

  const renderDeviceIcon = (type: UserSessionData['deviceType']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-indigo-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'laptop':
      default:
        return <Laptop className="w-5 h-5 text-sky-400" />;
    }
  };

  // SCREEN 1: PRIVATE ADMIN PASSWORD GATE
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[460px] p-6 text-center select-none bg-slate-950/90 text-white relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-red-500/30 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500/20 via-rose-600/30 to-slate-900 border border-red-500/40 mx-auto mb-4 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
            <Lock className="w-8 h-8 text-red-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-300 text-[10px] font-black uppercase tracking-widest mb-2">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Private Admin Route</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
            Admin Session Panel
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter admin password to monitor real-time connected users and trigger instant kicks.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter password (e.g. 1234)"
                autoFocus
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/50 border border-white/20 focus:border-red-400 text-sm text-white focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold animate-shake">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all active:scale-95 cursor-pointer"
            >
              Enter Admin Dashboard
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-500">
            Default Passcode: <span className="font-mono text-red-400 font-bold">1234</span>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: ADMIN REAL-TIME SESSION DASHBOARD
  const activeSessions = liveSessions.filter((s) => !s.isKicked);
  const kickedSessions = liveSessions.filter((s) => s.isKicked);

  return (
    <div className="flex flex-col h-full text-slate-100 bg-slate-950/80 p-4 sm:p-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Top Banner & Stat Bar */}
      <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 border border-red-500/30 shadow-2xl mb-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/30 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
              <Activity className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Real-Time Admin Session Manager
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track active site visitors in real-time • Remotely kick sessions with instant Google redirect
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenTestTab}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              title="Open website in new tab to test live user tracking"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Test User Tab</span>
            </button>

            <button
              onClick={() => {
                setIsRefreshing(true);
                sound.playKeypadClick(500);
                sessionManager.requestPingsFromAll();
                sessionManager.broadcastHeartbeat();
                setTimeout(() => {
                  setLiveSessions(sessionManager.getSessionsList());
                  setIsRefreshing(false);
                }, 500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-white/10"
              title="Ping and scan all online devices globally"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Ping All Devices</span>
            </button>

            <button
              onClick={() => {
                sound.playKeypadClick(400);
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] mb-0.5">Online Users</div>
            <div className="text-xl font-black text-cyan-300">{activeSessions.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] mb-0.5">Kicked Users</div>
            <div className="text-xl font-black text-rose-400">{kickedSessions.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] mb-0.5">Your Admin Profile</div>
            <div className="text-sm font-bold text-emerald-400 font-mono truncate">
              {currentGuestName}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px] mb-0.5">Kick Action Target</div>
            <div className="text-xs font-bold text-amber-300 truncate">
              google.com (Instant)
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert Toast */}
      {actionAlert && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shadow-lg shadow-red-500/10 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{actionAlert}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-red-400 hover:text-white text-xs cursor-pointer ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Section 1: All Currently Connected Users with Prominent Red "Kick User" Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Connected Users Online ({activeSessions.length})
            </h2>
          </div>

          {activeSessions.length > 1 && (
            <button
              onClick={handleKickAllUsers}
              className="text-xs text-rose-400 hover:text-rose-300 font-black flex items-center gap-1 cursor-pointer transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Kick All Guests</span>
            </button>
          )}
        </div>

        {activeSessions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-slate-400 text-xs">
            No active users found. Open another browser tab to simulate multiple users.
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session) => {
              const isCurrent = session.sessionId === currentSessionId;
              const formattedTime = new Date(session.connectedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={session.sessionId}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/70 border-white/10 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {renderDeviceIcon(session.deviceType)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
                          {session.isAdmin && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                          <span>{session.guestName}</span>
                        </span>
                        {session.isAdmin ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-sm shadow-amber-500/10">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>{isCurrent ? 'You (Administrator)' : 'Administrator'}</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                            You (Guest)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                            Guest User
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs mt-1">
                        <span className="font-mono text-cyan-300/80">{session.ip}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {session.sessionId.slice(0, 14)}...
                        </span>
                        <span>•</span>
                        <span>Connected: {formattedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT RED "KICK USER" BUTTON */}
                  <div>
                    <button
                      onClick={() => handleKickUser(session)}
                      className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 border border-red-400/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                      title={`Kick ${session.guestName} and redirect to google.com`}
                    >
                      <UserX className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>Kick User</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Kicked Users History */}
      {kickedSessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <WifiOff className="w-4 h-4" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Kicked Out Sessions ({kickedSessions.length})
            </h2>
          </div>

          <div className="space-y-2">
            {kickedSessions.map((s) => (
              <div
                key={s.sessionId}
                className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white line-through opacity-75">
                      {s.guestName}
                    </span>
                    <span className="text-[11px] font-mono text-rose-400/80 ml-2">
                      {s.ip} • Kicked to google.com
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  Kicked & Blocked
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
