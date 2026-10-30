import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Download, Sparkles, Sliders } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [filter, setFilter] = useState<'none' | 'cyberpunk' | 'retro' | 'grayscale' | 'sepia'>('none');
  const [photos, setPhotos] = useState<string[]>([]);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setStreamActive(true);
        }
      })
      .catch(() => {
        setStreamActive(false);
      });

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleSnap = () => {
    sound.playSoundEffect('coin');
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (filter === 'grayscale') ctx.filter = 'grayscale(100%)';
    else if (filter === 'sepia') ctx.filter = 'sepia(80%)';
    else if (filter === 'cyberpunk') ctx.filter = 'hue-rotate(180deg) contrast(140%)';
    else if (filter === 'retro') ctx.filter = 'sepia(50%) contrast(120%)';

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setPhotos([dataUrl, ...photos]);
  };

  const getFilterClass = () => {
    switch (filter) {
      case 'cyberpunk':
        return 'hue-rotate-180 contrast-125 saturate-150';
      case 'retro':
        return 'sepia contrast-125';
      case 'grayscale':
        return 'grayscale';
      case 'sepia':
        return 'sepia';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto h-full flex flex-col justify-between overflow-y-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black">Camera & Photo Booth</h1>
          <p className="text-xs text-slate-400">Webcam snapshot booth with real-time filters</p>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 aspect-video max-h-[380px] mx-auto w-full flex items-center justify-center shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${getFilterClass()}`}
        />
        {!streamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 p-6 text-center">
            <Camera className="w-12 h-12 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-400">Camera preview unavailable or permission blocked.</p>
          </div>
        )}
      </div>

      {/* Filter and Shutter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['none', 'cyberpunk', 'retro', 'grayscale', 'sepia'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize font-semibold transition-all cursor-pointer ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleSnap}
          disabled={!streamActive}
          className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-40 cursor-pointer shadow-lg shadow-blue-500/25 transition-transform active:scale-95"
        >
          Capture Snapshot
        </button>
      </div>

      {/* Snapshot Gallery */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Snapshots ({photos.length})</h3>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((src, i) => (
              <a key={i} href={src} download={`snapshot-${i}.png`} className="rounded-xl overflow-hidden border border-white/15 block relative group">
                <img src={src} alt="Snapshot" className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Download className="w-4 h-4 text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
