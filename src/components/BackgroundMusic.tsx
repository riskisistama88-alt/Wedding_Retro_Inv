/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  autoStart?: boolean;
}

export default function BackgroundMusic({ autoStart = false }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Simple procedural acoustic chime progress bar loop
  const startChimeLoop = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Chords: Cmaj7 -> G6 -> Am7 -> Fmaj7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C, E, G, B (Cmaj7)
      [196.00, 246.94, 293.66, 392.00], // G, B, D, G (G6)
      [220.00, 261.63, 329.63, 392.00], // A, C, E, G (Am7)
      [174.61, 220.00, 261.63, 349.23], // F, A, C, F (Fmaj7)
    ];

    let chordIdx = 0;
    let step = 0;

    const playNote = (freq: number, startTime: number, duration: number, vol: number) => {
      if (!audioCtxRef.current) return;
      
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      // Soft triangle wave for physical woodwinds/chime feeling
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.1, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const runScheduler = () => {
      if (!audioCtxRef.current) return;
      const now = audioCtxRef.current.currentTime;

      // Arpeggiate notes of current chord every 0.35s
      const currentChord = chords[chordIdx];
      const noteFreq = currentChord[step % currentChord.length];
      
      // Add subtle variation
      playNote(noteFreq, now, 2.5, 0.4);

      if (step % 8 === 0) {
        // Deep root note
        playNote(currentChord[0] / 2, now, 4.0, 0.5);
      }

      step++;
      if (step % 16 === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }

      // Schedule next event
      timerRef.current = window.setTimeout(runScheduler, 450);
    };

    runScheduler();
    setIsPlaying(true);
  };

  const stopChimeLoop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopChimeLoop();
    } else {
      startChimeLoop();
    }
  };

  useEffect(() => {
    if (autoStart) {
      // Autoplay might block, so we attempt gently
      startChimeLoop();
    }
    return () => stopChimeLoop();
  }, []);

  return (
    <div id="bg-music-widget" className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
      <button
        id="toggle-music-btn"
        onClick={toggleMusic}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full border shadow-md transition-all font-medium text-xs bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 active:scale-95`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Music On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-zinc-400" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Music Off</span>
          </>
        )}
      </button>
    </div>
  );
}
