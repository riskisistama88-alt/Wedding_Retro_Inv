/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Compass, 
  Award, 
  Sparkles, 
  User, 
  ChevronRight, 
  RotateCcw 
} from 'lucide-react';
import { Quest, GuestGreeting } from './types';
import { weddingData } from './data';
import OpeningScreen from './components/OpeningScreen';
import GameCanvas from './components/GameCanvas';
import InteractivePopup from './components/InteractivePopup';
import BackgroundMusic from './components/BackgroundMusic';

// Initial mock greetings to make the Guestbook look lively and professional from start
const INITIAL_GREETINGS: GuestGreeting[] = [
  {
    id: 'init-1',
    name: 'Budi Santoso',
    rsvpStatus: 'hadir',
    message: 'Selamat menempuh hidup baru Ranggi & Dewi! Konsep undangan gamenya keren sekali, bernuansa retro seperti Harvest Moon! Semoga sakinah, mawaddah, warahmah.',
    timestamp: '29 Jun 2026',
    likes: 5
  },
  {
    id: 'init-2',
    name: 'Amelia Putri',
    rsvpStatus: 'hadir',
    message: 'Happy wedding guys! Desain dunianya cantik sekali, sakura berguguran di mana-mana. Semoga lancar sampai hari H ya! See you soon!',
    timestamp: '29 Jun 2026',
    likes: 8
  },
  {
    id: 'init-3',
    name: 'Reza Mahardika',
    rsvpStatus: 'ragu',
    message: 'Benar-benar undangan digital paling kreatif yang pernah saya mainkan! Selamat atas persatuan cinta Ranggi & Dewi. Semoga abadi selamanya.',
    timestamp: '29 Jun 2026',
    likes: 3
  }
];

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Kehormatan');
  const [activeBuilding, setActiveBuilding] = useState<{ id: string; name: string } | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [greetings, setGreetings] = useState<GuestGreeting[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load state and progress from LocalStorage
  useEffect(() => {
    // 1. Load Guest Book
    const storedGreetings = localStorage.getItem('wae_greetings_v1');
    if (storedGreetings) {
      setGreetings(JSON.parse(storedGreetings));
    } else {
      setGreetings(INITIAL_GREETINGS);
      localStorage.setItem('wae_greetings_v1', JSON.stringify(INITIAL_GREETINGS));
    }

    // 2. Load Quests state
    const defaultQuests: Quest[] = [
      { id: 'q1', label: 'Kenali Profil Mempelai (Rumah)', description: 'Kunjungi Rumah Mempelai untuk melihat foto profil dan data keluarga.', targetId: 'rumah', completed: false },
      { id: 'q2', label: 'Periksa Jadwal Akad (Masjid)', description: 'Kunjungi Masjid Akad untuk memeriksa waktu acara akad nikah.', targetId: 'masjid', completed: false },
      { id: 'q3', label: 'Periksa Jadwal Resepsi (Gedung)', description: 'Kunjungi Gedung Resepsi untuk melihat detail dan lokasi resep.', targetId: 'gedung', completed: false },
      { id: 'q4', label: 'Baca Kisah Kasih (Pohon Sakura)', description: 'Telusuri Love Story timeline di bawah teduhnya pohon sakura.', targetId: 'pohonsakura', completed: false },
      { id: 'q5', label: 'Buka Album Foto (Kamera)', description: 'Buka galeri album petualangan cinta di spot Kamera.', targetId: 'kamera', completed: false },
      { id: 'q6', label: 'Kunjungi Amplop Kado (Gift Box)', description: 'Lihat metode pengiriman tanda kasih digital di spot Giftbox.', targetId: 'giftbox', completed: false },
      { id: 'q7', label: 'Isi Buku Tamu & RSVP (Buku)', description: 'Konfirmasi kehadiran dan tinggalkan ucapan manis di Buku Tamu.', targetId: 'buku', completed: false },
      { id: 'q8', label: 'Mencapai Gerbang Selesai (Portal)', description: 'Capai gerbang portal suci untuk menyelesaikan petualangan.', targetId: 'portal', completed: false },
    ];

    const storedQuests = localStorage.getItem('wae_quests_v1');
    if (storedQuests) {
      setQuests(JSON.parse(storedQuests));
    } else {
      setQuests(defaultQuests);
      localStorage.setItem('wae_quests_v1', JSON.stringify(defaultQuests));
    }

    // 3. Load general open state
    const storedGuest = localStorage.getItem('wae_guest_name');
    const storedOpened = localStorage.getItem('wae_is_opened');
    if (storedOpened === 'true' && storedGuest) {
      setGuestName(storedGuest);
      setIsOpened(true);
    }
  }, []);

  // Set opening parameters and initialize player session
  const handleOpenInvitation = (name: string) => {
    setGuestName(name);
    setIsOpened(true);
    localStorage.setItem('wae_guest_name', name);
    localStorage.setItem('wae_is_opened', 'true');
  };

  // Triggered when player interacts with an overworld station
  const handleBuildingInteract = (id: string, name: string) => {
    setActiveBuilding({ id, name });
    
    // Complete associated quest
    setQuests(prev => {
      const updated = prev.map(q => q.targetId === id ? { ...q, completed: true } : q);
      localStorage.setItem('wae_quests_v1', JSON.stringify(updated));

      // Check if all quests are now completed!
      const allDone = updated.every(q => q.completed);
      if (allDone) {
        setShowCelebration(true);
      }

      return updated;
    });
  };

  // Add guest greeting with local storage preservation
  const handleAddGreeting = (newGreet: Omit<GuestGreeting, 'id' | 'timestamp' | 'likes'>) => {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const greeting: GuestGreeting = {
      id: `greet-${Date.now()}`,
      name: newGreet.name,
      rsvpStatus: newGreet.rsvpStatus,
      message: newGreet.message,
      timestamp: formattedDate,
      likes: 0
    };

    setGreetings(prev => {
      const updated = [greeting, ...prev];
      localStorage.setItem('wae_greetings_v1', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle high-performance greeting liking
  const handleLikeGreeting = (id: string) => {
    setGreetings(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, likes: g.likes + 1 } : g);
      localStorage.setItem('wae_greetings_v1', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset progress and quests
  const handleResetProgress = () => {
    localStorage.removeItem('wae_quests_v1');
    localStorage.removeItem('wae_is_opened');
    localStorage.removeItem('wae_guest_name');
    window.location.reload();
  };

  const completedQuestsCount = quests.filter(q => q.completed).length;

  return (
    <div id="wae-app-root" className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      
      {/* Background ambient music loops safely */}
      <BackgroundMusic autoStart={isOpened} />

      {!isOpened ? (
        <OpeningScreen data={weddingData} onOpen={handleOpenInvitation} />
      ) : (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Main Top Exploration Bar */}
          <nav id="exploration-navbar" className="bg-zinc-900 border-b border-zinc-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-pink-600 rounded-lg">
                <Heart className="w-4.5 h-4.5 fill-white text-white animate-pulse" />
              </span>
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-100 leading-none">
                  Undangan {weddingData.couple.groom.name} & {weddingData.couple.bride.name}
                </h2>
                <p className="text-[10px] text-zinc-400 font-medium">Hai, <span className="text-pink-400 font-bold">{guestName}</span>! Selamat menjelajah!</p>
              </div>
            </div>

            {/* Misi Progress Badge */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                <Award className={`w-4 h-4 ${completedQuestsCount === quests.length ? 'text-amber-400 animate-spin-slow' : 'text-zinc-400'}`} />
                <span className="font-mono text-[11px] font-bold">Progress: {completedQuestsCount}/{quests.length}</span>
              </div>

              <button
                id="reset-progress-btn"
                onClick={handleResetProgress}
                className="flex items-center space-x-1 text-[10px] uppercase tracking-wider font-bold text-zinc-400 hover:text-white transition-all bg-zinc-800/50 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-800/80 cursor-pointer"
                title="Mulai ulang petualangan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>
            </div>
          </nav>

          {/* Overworld Map viewport stage */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            <GameCanvas 
              guestName={guestName} 
              onInteract={handleBuildingInteract} 
              quests={quests} 
            />
          </div>

          {/* Interactive RPG popup modal when triggered */}
          {activeBuilding && (
            <InteractivePopup
              buildingId={activeBuilding.id}
              buildingName={activeBuilding.name}
              data={weddingData}
              guestName={guestName}
              greetings={greetings}
              onAddGreeting={handleAddGreeting}
              onLikeGreeting={handleLikeGreeting}
              onClose={() => setActiveBuilding(null)}
              questCount={completedQuestsCount}
              totalQuests={quests.length}
            />
          )}

          {/* Celebratory Success overlay banner when all quests completed */}
          {showCelebration && (
            <div id="celebration-toast" className="fixed bottom-20 right-4 z-40 bg-zinc-900 border border-emerald-500 rounded-xl p-4 shadow-2xl text-white max-w-xs animate-slide-in flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span className="p-1 bg-emerald-500 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Quest Selesai! 🎉</h4>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Hebat! Anda telah menyelesaikan seluruh misi petualangan peta undangan pernikahan kami! Kunjungi **Portal** untuk konfirmasi akhir.
              </p>
              <button 
                onClick={() => setShowCelebration(false)}
                className="text-[10px] font-bold text-zinc-400 hover:text-white text-right"
              >
                Tutup
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
