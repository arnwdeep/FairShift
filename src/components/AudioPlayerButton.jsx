import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/audio';

export default function AudioPlayerButton({ text, lang = 'en', label = 'Listen', className = '', size = 'md' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speakText(
        text,
        lang,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 transition-all select-none font-medium ${
        isPlaying
          ? 'bg-black text-white'
          : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200'
      } ${
        isSmall ? 'px-2.5 py-1 text-[11px] rounded-full' : 'px-3.5 py-1.5 text-xs rounded-full'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-orange-500 animate-ping' : 'bg-slate-400'}`}></span>
      <span>{isPlaying ? 'Stop' : label}</span>
    </button>
  );
}
