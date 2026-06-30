/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Copy, 
  Check, 
  Heart, 
  Calendar, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Send, 
  ThumbsUp,
  Award,
  Download,
  Info
} from 'lucide-react';
import { WeddingData, GuestGreeting } from '../types';

interface InteractivePopupProps {
  buildingId: string;
  buildingName: string;
  data: WeddingData;
  guestName: string;
  greetings: GuestGreeting[];
  onAddGreeting: (greeting: Omit<GuestGreeting, 'id' | 'timestamp' | 'likes'>) => void;
  onLikeGreeting: (id: string) => void;
  onClose: () => void;
  questCount: number;
  totalQuests: number;
}

export default function InteractivePopup({
  buildingId,
  buildingName,
  data,
  guestName,
  greetings,
  onAddGreeting,
  onLikeGreeting,
  onClose,
  questCount,
  totalQuests
}: InteractivePopupProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // RSVP Form state
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
  const [greetingMsg, setGreetingMsg] = useState('');
  const [rsvpName, setRsvpName] = useState(guestName);
  const [formSuccess, setFormSuccess] = useState(false);

  // Gallery active slide state
  const [activeSlide, setActiveSlide] = useState(0);

  // Handle Account Copying
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGreetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!greetingMsg.trim() || !rsvpName.trim()) return;

    onAddGreeting({
      name: rsvpName.trim(),
      rsvpStatus,
      message: greetingMsg.trim()
    });

    setGreetingMsg('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const renderContent = () => {
    switch (buildingId) {
      case 'rumah':
        return (
          <div className="space-y-6">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Selamat datang di Rumah Mempelai! Di sinilah awal mula persiapan kehidupan baru kami bermula. Kenali kami lebih dekat:
            </p>

            {/* Groom card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <img 
                src={data.couple.groom.avatar} 
                alt={data.couple.groom.fullName} 
                className="w-20 h-20 rounded-xl object-cover border-2 border-zinc-900 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <span className="text-[9px] bg-zinc-900 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Mempelai Pria
                </span>
                <h4 className="text-sm font-bold text-zinc-900">{data.couple.groom.fullName}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  Putra dari: <br />
                  <span className="text-zinc-900">{data.couple.groom.father}</span> & <span className="text-zinc-900">{data.couple.groom.mother}</span>
                </p>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed pt-1 border-t border-zinc-200/50">
                  "{data.couple.groom.bio}"
                </p>
              </div>
            </div>

            {/* Bride card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <img 
                src={data.couple.bride.avatar} 
                alt={data.couple.bride.fullName} 
                className="w-20 h-20 rounded-xl object-cover border-2 border-zinc-900 shadow-sm shrink-0 transform scale-x-[-1]"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <span className="text-[9px] bg-pink-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Mempelai Wanita
                </span>
                <h4 className="text-sm font-bold text-zinc-900">{data.couple.bride.fullName}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  Putri dari: <br />
                  <span className="text-zinc-900">{data.couple.bride.father}</span> & <span className="text-zinc-900">{data.couple.bride.mother}</span>
                </p>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed pt-1 border-t border-zinc-200/50">
                  "{data.couple.bride.bio}"
                </p>
              </div>
            </div>
          </div>
        );

      case 'masjid':
        return (
          <div className="space-y-5">
            <div className="relative h-44 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 shadow-inner flex items-center justify-center">
              {/* Masjid pixel graphic or scenic mockup */}
              <img 
                src="https://picsum.photos/seed/masjid/800/400" 
                alt="Masjid" 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white space-y-0.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">
                    Sesi Akad Nikah
                  </span>
                  <p className="text-xs text-zinc-200 font-medium">{data.akad.venue}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tanggal Akad</h4>
                  <p className="text-sm font-bold text-zinc-900">{data.akad.date}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Waktu Pelaksanaan</h4>
                  <p className="text-sm font-semibold text-zinc-900">{data.akad.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-sans">Tempat & Alamat</h4>
                  <p className="text-sm font-semibold text-zinc-900">{data.akad.venue}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{data.akad.address}</p>
                </div>
              </div>
            </div>

            <a
              id="akad-maps-btn"
              href={data.akad.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Petunjuk Arah Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        );

      case 'gedung':
        return (
          <div className="space-y-5">
            <div className="relative h-44 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 shadow-inner flex items-center justify-center">
              <img 
                src="https://picsum.photos/seed/reception/800/400" 
                alt="Gedung" 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white space-y-0.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-pink-600 text-white px-2 py-0.5 rounded">
                    Sesi Resepsi Pernikahan
                  </span>
                  <p className="text-xs text-zinc-200 font-medium">{data.resepsi.venue}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tanggal Resepsi</h4>
                  <p className="text-sm font-bold text-zinc-900">{data.resepsi.date}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Waktu Resepsi</h4>
                  <p className="text-sm font-semibold text-zinc-900">{data.resepsi.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tempat & Alamat</h4>
                  <p className="text-sm font-semibold text-zinc-900">{data.resepsi.venue}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{data.resepsi.address}</p>
                </div>
              </div>
            </div>

            <a
              id="resepsi-maps-btn"
              href={data.resepsi.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Petunjuk Arah Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        );

      case 'pohonsakura':
        return (
          <div className="space-y-6">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Di bawah rindangnya pohon sakura kehidupan kami tumbuh subur, berikut adalah tapak-tapak perjalanan cinta kami:
            </p>

            <div className="relative pl-6 border-l-2 border-pink-200 space-y-6">
              {data.loveStory.map((story, i) => (
                <div key={i} className="relative">
                  {/* Point icon */}
                  <span className="absolute -left-9 top-0.5 bg-pink-100 border-2 border-pink-600 text-pink-700 rounded-full w-5.5 h-5.5 flex items-center justify-center text-[10px] font-black shadow-xs">
                    {i + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-pink-600 font-mono bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        {story.year}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-900">{story.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'kamera':
        return (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              Berikut adalah beberapa tangkapan momen manis dalam album digital petualangan kami:
            </p>

            {/* Album Slider */}
            <div className="relative rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden shadow-sm">
              <div className="aspect-video relative">
                <img 
                  src={data.gallery[activeSlide].url} 
                  alt={data.gallery[activeSlide].caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <p className="text-white text-xs font-medium leading-relaxed">
                    {data.gallery[activeSlide].caption}
                  </p>
                </div>
              </div>

              {/* Slider Dots indicators */}
              <div className="flex items-center justify-center space-x-1.5 p-3.5 bg-white border-t border-zinc-100">
                {data.gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeSlide === i ? 'bg-zinc-900 w-5' : 'bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Complete Grid View */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {data.gallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveSlide(i)}
                  className={`aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-all ${
                    activeSlide === i ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-1' : 'border-zinc-200'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'giftbox':
        return (
          <div className="space-y-5">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Doa restu Anda adalah hadiah paling berharga untuk kami. Namun, apabila Anda ingin mengirimkan tanda kasih digital secara praktis, silakan gunakan metode berikut:
            </p>

            {data.gifts.map((gift, i) => (
              <div key={i} className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-zinc-900">{gift.bankName}</span>
                  {gift.qrisUrl && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                      Mendukung QRIS
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between bg-white border border-zinc-150 p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nomor Rekening</p>
                    <p className="text-sm font-black text-zinc-800 font-mono tracking-wide">{gift.accountNumber}</p>
                    <p className="text-xs text-zinc-600 font-medium">A.n. {gift.accountHolder}</p>
                  </div>

                  <button
                    id={`copy-gift-${i}`}
                    onClick={() => copyToClipboard(gift.accountNumber, i)}
                    className="flex items-center space-x-1 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-zinc-950 rounded-lg text-xs font-semibold transition-all border border-zinc-200 cursor-pointer"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] text-emerald-700">Salin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {gift.qrisUrl && (
                  <div className="flex flex-col items-center justify-center p-3.5 border border-dashed border-zinc-200 rounded-xl bg-white space-y-2">
                    <img 
                      src={gift.qrisUrl} 
                      alt="QRIS Code" 
                      className="w-32 h-32 object-contain border border-zinc-100 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[10px] text-zinc-400 font-medium">Scan QRIS di atas melalui m-Banking atau E-Wallet pilihan Anda</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'buku':
        return (
          <div className="space-y-5">
            {/* Live RSVP form */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-zinc-600" />
                <span>Isi RSVP & Kirim Ucapan Manis</span>
              </h4>

              <form onSubmit={handleGreetingSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nama Anda</label>
                  <input
                    id="rsvp-name-field"
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Konfirmasi Kehadiran</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'hadir', label: 'Hadir' },
                      { value: 'tidak_hadir', label: 'Absen' },
                      { value: 'ragu', label: 'Ragu' }
                    ].map((status) => (
                      <button
                        id={`rsvp-btn-${status.value}`}
                        key={status.value}
                        type="button"
                        onClick={() => setRsvpStatus(status.value as any)}
                        className={`py-2 px-1.5 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          rsvpStatus === status.value
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pesan Ucapan / Doa</label>
                  <textarea
                    id="rsvp-message-field"
                    rows={2.5}
                    required
                    value={greetingMsg}
                    onChange={(e) => setGreetingMsg(e.target.value)}
                    placeholder="Tuliskan doa atau pesan hangat untuk kedua mempelai di sini..."
                    className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 resize-none"
                  />
                </div>

                <button
                  id="submit-rsvp-btn"
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Buku Tamu</span>
                </button>

                {formSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded-lg text-[11px] font-semibold text-center animate-pulse">
                    Ucapan dan RSVP berhasil dikirim! Terima kasih banyak!
                  </div>
                )}
              </form>
            </div>

            {/* List of greetings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ucapan Sahabat & Tamu ({greetings.length})</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {greetings.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic text-center py-4">Belum ada ucapan. Jadilah yang pertama!</p>
                ) : (
                  greetings.map((greet) => (
                    <div key={greet.id} className="bg-white border border-zinc-200 rounded-xl p-3 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-zinc-800 truncate max-w-[120px]">{greet.name}</span>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                            greet.rsvpStatus === 'hadir'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : greet.rsvpStatus === 'tidak_hadir'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {greet.rsvpStatus === 'hadir' ? 'Hadir' : greet.rsvpStatus === 'tidak_hadir' ? 'Absen' : 'Ragu'}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono">{greet.timestamp}</span>
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {greet.message}
                      </p>

                      <div className="flex items-center justify-end">
                        <button
                          id={`like-btn-${greet.id}`}
                          onClick={() => onLikeGreeting(greet.id)}
                          className="flex items-center space-x-1 text-[10px] font-bold text-zinc-400 hover:text-pink-600 transition-all cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{greet.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'portal':
        return (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex items-center justify-center bg-zinc-900 text-white p-4 rounded-full border-4 border-white shadow-lg animate-bounce">
              <Award className="w-10 h-10 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-zinc-950">Selamat Petualang! 🎉</h4>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                Anda telah menjelajahi seluruh sudut dari Desa Pixel Pernikahan kami! ({questCount}/{totalQuests} misi terselesaikan)
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2 max-w-sm mx-auto text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 pb-1.5 border-b border-zinc-200/50">
                <span>Total Eksplorasi:</span>
                <span className="text-zinc-950 font-bold">{Math.round((questCount / totalQuests) * 100)}%</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                Kami sangat menghargai kehadiran Anda dalam mengeksplorasi undangan digital interaktif ini. Kehadiran dan doa tulus Anda adalah segalanya bagi kami.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-zinc-400 italic">Sampai jumpa di hari kebahagiaan kami!</p>
              <button
                id="portal-close-btn"
                onClick={onClose}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Kembali ke Game
              </button>
            </div>
          </div>
        );

      default:
        return (
          <p className="text-xs text-zinc-500">
            Terima kasih telah mengunjungi area ini! Informasi mendalam akan segera ditampilkan.
          </p>
        );
    }
  };

  if (buildingId === 'kamera') {
    return (
      <div 
        id="rpg-popup-container" 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-sans"
      >
        {/* Ancient unrolling scroll container */}
        <div className="relative max-w-md w-full flex flex-col items-center max-h-[95vh]">
          
          {/* Top Wooden Roller */}
          <div className="w-[105%] h-6 bg-gradient-to-b from-[#7c2d12] via-[#b45309] to-[#7c2d12] rounded-full shadow-lg relative flex justify-between items-center z-10 border-y-2 border-black">
            {/* Golden Knobs */}
            <div className="w-4 h-8 -ml-2 rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] border-2 border-[#7c2d12] shadow-md" />
            <div className="w-4 h-8 -mr-2 rounded-md bg-gradient-to-l from-[#fbbf24] to-[#f59e0b] border-2 border-[#7c2d12] shadow-md" />
          </div>

          {/* Parchment Body */}
          <div className="w-full bg-[#fdf6e2] border-x-8 border-[#d97706]/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative -my-1 pb-4 border-2 border-amber-900/40 rounded-sm">
            
            {/* Decorative Ribbon Hook or shading */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-950/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-950/15 to-transparent pointer-events-none" />
            
            {/* Header */}
            <header className="px-5 py-3 border-b border-amber-900/10 flex items-center justify-between bg-[#fbf0d0]/55">
              <div className="flex items-center space-x-2">
                <span className="text-amber-800 font-retro text-xs animate-pulse">📜</span>
                <h3 className="text-[11px] uppercase tracking-wider font-extrabold text-amber-950" style={{ fontFamily: 'var(--font-retro)' }}>
                  Gulungan Kenangan Indah
                </h3>
              </div>
              <button
                id="close-popup-btn"
                onClick={onClose}
                className="p-1.5 bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Scroll Content Body with beautiful photos */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {renderContent()}
            </div>

            {/* Scroll Footer */}
            <footer className="border-t border-amber-900/10 px-5 py-2.5 flex items-center justify-between text-[8px] font-retro text-amber-800 font-bold bg-[#fbf0d0]/55">
              <span>ALBUM PETUALANGAN CINTA</span>
              <span className="text-amber-950 font-mono">Progress: {questCount}/{totalQuests} Spots</span>
            </footer>

          </div>

          {/* Bottom Wooden Roller */}
          <div className="w-[105%] h-6 bg-gradient-to-b from-[#7c2d12] via-[#b45309] to-[#7c2d12] rounded-full shadow-lg relative flex justify-between items-center z-10 border-y-2 border-black">
            {/* Golden Knobs */}
            <div className="w-4 h-8 -ml-2 rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] border-2 border-[#7c2d12] shadow-md" />
            <div className="w-4 h-8 -mr-2 rounded-md bg-gradient-to-l from-[#fbbf24] to-[#f59e0b] border-2 border-[#7c2d12] shadow-md" />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      id="rpg-popup-container" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
    >
      <div 
        id={`popup-card-${buildingId}`}
        className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* RPG-styled Header */}
        <header className="bg-zinc-900 text-white px-5 py-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-pink-400">
              <Sparkles className="w-4.5 h-4.5" />
            </span>
            <h3 className="text-xs uppercase tracking-widest font-black text-white">{buildingName}</h3>
          </div>
          
          <button
            id="close-popup-btn"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content Body */}
        <div id="popup-scroll-body" className="p-6 overflow-y-auto flex-1 space-y-4">
          {renderContent()}
        </div>

        {/* RPG-styled Footer */}
        <footer className="bg-zinc-50 border-t border-zinc-150 px-6 py-3.5 flex items-center justify-between text-[11px] font-bold text-zinc-400 shrink-0">
          <span>Wedding Adventure Engine v1.0</span>
          <span className="text-zinc-500 font-mono">Progress: {questCount}/{totalQuests} Map Nodes</span>
        </footer>
      </div>
    </div>
  );
}
