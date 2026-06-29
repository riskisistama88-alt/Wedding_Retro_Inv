/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Heart, MapPin, Sparkles, User, ArrowRight, Music, Volume2, VolumeX } from 'lucide-react';
import { WeddingData } from '../types';

interface OpeningScreenProps {
  data: WeddingData;
  onOpen: (guestName: string) => void;
}

export default function OpeningScreen({ data, onOpen }: OpeningScreenProps) {
  const [guestName, setGuestName] = useState('');
  const [hasAutoName, setHasAutoName] = useState(false);

  // Automatically parse Guest Name from query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTo = params.get('to') || params.get('guest') || params.get('nama') || params.get('name');
    if (rawTo) {
      const decodedName = decodeURIComponent(rawTo.replace(/\+/g, ' ')).trim();
      if (decodedName) {
        setGuestName(decodedName);
        setHasAutoName(true);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpen(guestName.trim() || 'Tamu Kehormatan');
  };

  return (
    <div 
      id="opening-screen-wrapper" 
      className="relative min-h-screen flex items-center justify-center bg-[#090d16] p-0 sm:p-4 overflow-hidden font-sans"
    >
      {/* 16-Bit Sky & Mountain Atmospheric Background covering outer area */}
      <div className="absolute inset-0 bg-[#7dd3fc] opacity-10" />

      {/* Main 9:16 Mobile Preview Canvas mimicking img_5809.png */}
      <div 
        id="mobile-phone-frame"
        className="relative w-full max-w-md h-screen sm:h-[840px] sm:rounded-[40px] sm:border-[10px] sm:border-[#1e293b] sm:shadow-2xl overflow-hidden bg-gradient-to-b from-[#87ceeb] via-[#aed8f2] to-[#cbe4f9] flex flex-col items-center justify-between py-10 px-6 text-center"
      >
        {/* Soft morning fog & clouds floating layer */}
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay">
          <div className="absolute top-20 left-10 w-44 h-16 bg-white rounded-full blur-xl animate-pulse" />
          <div className="absolute top-44 right-6 w-56 h-20 bg-white rounded-full blur-xl animate-pulse delay-75" />
        </div>

        {/* 16-bit Mountains in the far background (pixel outline look) */}
        <div className="absolute bottom-60 left-0 right-0 h-96 pointer-events-none opacity-90 z-0">
          {/* Back peak */}
          <div 
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#475569] rotate-45 rounded-xl border-t-8 border-l-8 border-[#334155] shadow-inner"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          {/* Left Peak */}
          <div 
            className="absolute bottom-10 -left-20 w-80 h-80 bg-[#334155] rotate-45 rounded-lg border-t-4 border-[#1e293b]"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          {/* Right Peak */}
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 bg-[#334155] rotate-45 rounded-lg border-t-4 border-[#1e293b]"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        </div>

        {/* Top Header - "The Wedding Of" in Retro Pixel Typography */}
        <div className="z-10 mt-6 space-y-4">
          <p 
            className="font-retro text-[10px] tracking-[0.2em] text-zinc-900 uppercase text-retro-stroke"
            style={{ fontFamily: 'var(--font-retro)' }}
          >
            The Wedding Of
          </p>

          {/* Couple Name display with a cute beating pixel heart */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <h1 
              className="font-retro text-2xl tracking-wide text-zinc-950 font-extrabold flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
              style={{ fontFamily: 'var(--font-retro)', textShadow: '2px 2px 0px #ffffff' }}
            >
              <span>{data.couple.groom.name}</span>
              <span className="text-red-500 animate-pulse text-xl">❤️</span>
              <span>{data.couple.bride.name}</span>
            </h1>

            {/* Date format "28.02.27" in spaced block typography */}
            <p 
              className="font-retro text-xs text-zinc-800 tracking-[0.3em] font-bold"
              style={{ fontFamily: 'var(--font-retro)' }}
            >
              28.02.27
            </p>
          </div>
        </div>

        {/* Play center ornament widget mimicking the screen play button */}
        <div className="z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/45 border-2 border-white/60 flex items-center justify-center backdrop-blur-xs animate-retro-float cursor-pointer shadow-lg">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
          </div>
          <span className="text-[8px] font-retro text-zinc-800 tracking-wider mt-2.5 font-bold">KETUK UNTUK EXPLORE</span>
        </div>

        {/* Guest Invite Board Container (Automatic name vs custom input) */}
        <div className="z-10 w-full px-2 space-y-6">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
            
            {hasAutoName ? (
              /* High-end Wooden/Stone hanging placard showing automatic guest name from DB */
              <div 
                id="auto-guest-placard"
                className="bg-[#fef3c7] border-4 border-black px-5 py-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative max-w-[280px] w-full animate-fade-in"
              >
                {/* Placard hanging loops */}
                <div className="absolute -top-3.5 left-1/4 w-2 h-4 bg-zinc-800 rounded-xs" />
                <div className="absolute -top-3.5 right-1/4 w-2 h-4 bg-zinc-800 rounded-xs" />
                
                <span className="text-[8px] font-retro text-amber-800 tracking-wider block mb-1 uppercase font-bold">
                  Spesial Kepada Yth:
                </span>
                <p 
                  className="font-retro text-xs text-zinc-900 font-extrabold truncate"
                  style={{ fontFamily: 'var(--font-retro)' }}
                >
                  {guestName}
                </p>
                <span className="text-[7px] text-zinc-500 font-mono block mt-1.5 uppercase tracking-widest font-semibold">
                  Tanpa Mengurangi Rasa Hormat
                </span>
              </div>
            ) : (
              /* Sleek Scroll-style Input text field for manual name input */
              <div className="bg-white/90 border-4 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-[280px] w-full text-left space-y-1">
                <label className="text-[7px] font-retro text-zinc-500 uppercase tracking-widest block font-bold">
                  Nama Tamu Undangan
                </label>
                <div className="relative">
                  <input
                    id="guest-name-field"
                    type="text"
                    required
                    placeholder="Ketik nama Anda..."
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-2.5 py-1.5 bg-zinc-100 border-2 border-black rounded focus:outline-hidden focus:bg-white text-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* Retro 16-Bit Green Button "open_invitation" styled exactly like img_5809.png */}
            <button
              id="open-invitation-btn"
              type="submit"
              className="bg-[#6ec04a] hover:bg-[#5da83b] active:translate-y-1 active:shadow-none border-4 border-black text-white font-retro text-[9px] tracking-widest uppercase px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-bold"
              style={{ fontFamily: 'var(--font-retro)' }}
            >
              open_invitation
            </button>
          </form>
        </div>

        {/* Bottom Graphic Ornament: Pixel greenhouse/pavilion arch with sunflowers & couple standing side-by-side */}
        <div className="w-full relative h-40 z-0 pointer-events-none mt-4 shrink-0 overflow-visible">
          {/* Soil/stone path background base */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#78350f] border-t-4 border-black" />
          <div className="absolute bottom-4 left-0 right-0 h-8 bg-[#15803d]" />

          {/* Sunflowers in the background */}
          <div className="absolute bottom-12 left-6 flex space-x-1">
            <span className="text-xl">🌻</span>
            <span className="text-lg translate-y-1">🌻</span>
          </div>
          <div className="absolute bottom-12 right-6 flex space-x-1">
            <span className="text-lg translate-y-1">🌻</span>
            <span className="text-xl">🌻</span>
          </div>

          {/* Wooden Easel board board */}
          <div className="absolute bottom-10 left-16 flex flex-col items-center">
            <div className="bg-[#fef3c7] border-2 border-black rounded p-1 w-12 text-center text-[5px] font-retro text-zinc-800 leading-none shadow-xs">
              Dewi <br/> & <br/> Ranggi
            </div>
            <div className="w-1 h-6 bg-amber-900 border-x border-black" />
          </div>

          {/* Glass Conservatory Arch (Greenhouse Outline in pixel style) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-32 border-4 border-dashed border-sky-400/55 rounded-t-full flex items-end justify-center">
            <div className="w-24 h-24 border-t-2 border-x-2 border-sky-200/40 rounded-t-full" />
          </div>

          {/* Pixel Groom (left) and Bride (right) standing hand-in-hand */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end justify-center space-x-4">
            
            {/* Groom (blue vest and smart grey trousers) */}
            <div className="flex flex-col items-center">
              {/* Hair */}
              <div className="w-4 h-3.5 bg-[#451a03] rounded-t-md" />
              {/* Head */}
              <div className="w-3.5 h-3 bg-[#fbcfe8] flex items-end justify-center -mt-0.5">
                <div className="w-1 h-1 bg-zinc-900 mb-0.5" />
              </div>
              {/* Blue Vest Body */}
              <div className="w-4 h-4 bg-[#1e3a8a] border-x border-white -mt-0.5" />
              {/* Pants */}
              <div className="w-4 h-3 bg-zinc-500" />
            </div>

            {/* Bride (soft pink hair, white wedding gown) */}
            <div className="flex flex-col items-center">
              {/* Veil/Hair */}
              <div className="w-4.5 h-4 bg-pink-300 rounded-t-md" />
              {/* Head */}
              <div className="w-3.5 h-3 bg-[#fbcfe8] flex items-end justify-center -mt-0.5">
                <div className="w-1 h-1 bg-zinc-900 mb-0.5" />
              </div>
              {/* White wedding Gown */}
              <div className="w-5 h-6 bg-white border border-pink-200 rounded-b-md -mt-0.5" />
            </div>
          </div>
        </div>

        {/* Elegant responsive frame notch decoration for true app emulation */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full hidden sm:block" />
      </div>
    </div>
  );
}
