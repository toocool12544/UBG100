import React, { useState, useEffect, useRef } from 'react';
import { Camera, Download, Trash2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const FILTERS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'aurora', name: 'Aurora Glow', css: 'hue-rotate-180 contrast-125 saturate-150' },
  { id: 'cyber', name: 'Cyberpunk', css: 'contrast-150 saturate-200 hue-rotate-90' },
  { id: 'bw', name: 'Vintage B&W', css: 'grayscale contrast-125' },
  { id: 'sunset', name: 'Warm Sunset', css: 'sepia brightness-110 contrast-110' },
];

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
        setHasPermission(true);
      })
      .catch(() => {
        setHasPermission(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    sound.playKeypadClick(600);
    setCountdown(3);
    const countTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          captureFrame();
          return null;
        }
        sound.playKeypadClick(700);
        return prev - 1;
      });
    }, 800);
  };

  const captureFrame = () => {
    sound.playSoundEffect('levelup');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 360;

    if (video && hasPermission) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      // Draw simulated photobooth graphic
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Aurora Snapshot', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(new Date().toLocaleTimeString(), canvas.width / 2, canvas.height / 2 + 20);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedPhotos((prev) => [dataUrl, ...prev]);
  };

  const currentCss = FILTERS.find((f) => f.id === activeFilter)?.css || '';

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        {/* Main Viewfinder */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl flex items-center justify-center">
            {hasPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-950/80">
                <AlertCircle className="w-10 h-10 text-sky-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Camera Standby Mode</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Camera permission not granted or device has no webcam. Simulated booth snapshot mode is ready!
                </p>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${currentCss} transition-all duration-300`}
            />

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-20">
                <span className="text-7xl font-black text-white animate-ping font-mono">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Filters Bar */}
          <div className="flex items-center gap-1.5 mt-4 p-1.5 rounded-xl bg-slate-900/80 border border-white/10 overflow-x-auto max-w-md w-full justify-center">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playKeypadClick(500);
                  setActiveFilter(f.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Shutter Button */}
          <button
            onClick={takePhoto}
            disabled={countdown !== null}
            className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Take Snapshot</span>
          </button>
        </div>

        {/* Snapshot Gallery Roll */}
        <div className="flex flex-col h-full bg-slate-900/60 p-4 rounded-2xl border border-white/10 max-h-[460px]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Photo Roll ({capturedPhotos.length})</span>
            {capturedPhotos.length > 0 && (
              <button
                onClick={() => setCapturedPhotos([])}
                className="text-[10px] text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                Clear
              </button>
            )}
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3">
            {capturedPhotos.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-10">
                Take a photo to see snapshots here!
              </div>
            ) : (
              capturedPhotos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/15">
                  <img src={photo} alt="Snapshot" className="w-full object-cover" />
                  <a
                    href={photo}
                    download={`aurora-photo-${Date.now()}.png`}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-sky-500 text-white text-xs transition-colors flex items-center gap-1"
                    title="Download Photo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
