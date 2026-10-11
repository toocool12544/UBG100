import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Plus, Disc, Trash2, Upload } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  url?: string;
}

export const Mp3PlayerApp: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newArtist, setNewArtist] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const synthRef = useRef<ReturnType<typeof sound.createSynthBeat> | null>(null);

  const currentTrack = playlist[currentTrackIndex] || null;

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  const togglePlay = () => {
    if (playlist.length === 0) return;

    if (!synthRef.current) {
      synthRef.current = sound.createSynthBeat();
    }

    if (isPlaying) {
      synthRef.current?.stop();
      setIsPlaying(false);
    } else {
      synthRef.current?.start();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    sound.playKeypadClick(600);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setProgress(0);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    sound.playKeypadClick(500);
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.6));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTrack: Track = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Custom Artist',
      genre: 'User Audio',
      duration: '3:00',
    };

    setPlaylist((prev) => [...prev, newTrack]);
    setNewTitle('');
    setNewArtist('');
    setShowAddForm(false);
    sound.playSoundEffect('levelup');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Local Audio',
        genre: 'Uploaded File',
        duration: 'Custom',
      };
      setPlaylist((prev) => [...prev, newTrack]);
      sound.playSoundEffect('levelup');
    }
  };

  const handleRemoveTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playKeypadClick(400);
    setPlaylist((prev) => prev.filter((t) => t.id !== id));
    if (currentTrackIndex >= playlist.length - 1) {
      setCurrentTrackIndex(Math.max(0, playlist.length - 2));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 p-4 text-slate-100 max-w-4xl mx-auto items-center justify-center">
      {/* Vinyl & Visualizer Display */}
      <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900/60 to-slate-950 border border-purple-500/20 shadow-2xl">
        <div className="relative mb-6">
          <div
            className={`w-44 h-44 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-950 to-purple-600 p-2 shadow-2xl flex items-center justify-center border-4 border-slate-900 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-purple-400 flex items-center justify-center">
              <Disc className="w-8 h-8 text-purple-300" />
            </div>
          </div>
        </div>

        {/* Real-time Visualizer bars */}
        <div className="flex items-end justify-center gap-1.5 h-12 w-full mb-4 px-4">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 60, 85, 50].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-t-sm bg-gradient-to-t from-purple-600 to-cyan-400 transition-all duration-150"
              style={{
                height: isPlaying ? `${Math.max(15, h * (0.4 + Math.random() * 0.6))}%` : '15%',
              }}
            />
          ))}
        </div>

        <h3 className="text-lg font-bold text-white text-center truncate max-w-full">
          {currentTrack ? currentTrack.title : 'No Track Loaded'}
        </h3>
        <p className="text-xs text-purple-300/80 mb-4">
          {currentTrack ? `${currentTrack.artist} • ${currentTrack.genre}` : 'Playlist is empty'}
        </p>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 mb-4 text-[10px] text-slate-400 font-mono">
          <span>0:{Math.floor(progress * 0.6).toString().padStart(2, '0')}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{currentTrack ? currentTrack.duration : '--:--'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={prevTrack}
            disabled={playlist.length === 0}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-40 text-slate-300 cursor-pointer active:scale-95"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            disabled={playlist.length === 0}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-purple-500/40 cursor-pointer active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            disabled={playlist.length === 0}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-40 text-slate-300 cursor-pointer active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 w-full max-w-sm flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center justify-between">
          <span>Aurora Audio Playlist</span>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-normal cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Add Track Form */}
        {showAddForm && (
          <form onSubmit={handleAddTrack} className="p-3 bg-purple-950/50 rounded-xl border border-purple-500/30 mb-2 space-y-2">
            <input
              type="text"
              placeholder="Track title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              placeholder="Artist name..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-purple-400"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold bg-purple-500 hover:bg-purple-600 rounded-lg text-white"
              >
                Add Track
              </button>
            </div>
          </form>
        )}

        {playlist.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center flex flex-col items-center justify-center">
            <Music className="w-8 h-8 text-purple-400/50 mb-2" />
            <div className="text-sm font-semibold text-white mb-1">No Tracks in Playlist</div>
            <p className="text-xs text-slate-400 max-w-[220px]">
              All tracks have been removed. You can upload an audio file or add custom tracks anytime.
            </p>
          </div>
        ) : (
          playlist.map((track, idx) => (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setProgress(0);
                if (!isPlaying) togglePlay();
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                currentTrackIndex === idx
                  ? 'bg-purple-500/20 border-purple-500/40 text-white font-medium shadow-md shadow-purple-500/10'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}</span>
                <div className="truncate">
                  <div className="text-xs font-semibold truncate">{track.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{track.artist}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                <button
                  onClick={(e) => handleRemoveTrack(track.id, e)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
