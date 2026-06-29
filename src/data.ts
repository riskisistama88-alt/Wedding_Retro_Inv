/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeddingData } from './types';

export const weddingData: WeddingData = {
  couple: {
    groom: {
      name: 'Ranggi',
      fullName: 'Ranggi Pratama, S.Kom.',
      father: 'Bpk. Ahmad Pratama',
      mother: 'Ibu Siti Aminah',
      avatar: '/src/assets/images/groom_bride_pixel_avatar_1782741614962.jpg',
      bio: 'Seorang software engineer pencinta pixel art, petualangan RPG, dan kopi hangat di pagi hari. Menemukan belahan jiwanya dalam sebuah perjalanan kreativitas.'
    },
    bride: {
      name: 'Dewi',
      fullName: 'Dewi Lestari, S.Ds.',
      father: 'Bpk. Budi Lestari',
      mother: 'Ibu Ani Wijaya',
      avatar: '/src/assets/images/groom_bride_pixel_avatar_1782741614962.jpg',
      bio: 'Seorang desainer grafis yang menghidupkan dunia lewat warna. Sangat menyukai ilustrasi lucu, berkebun bunga sakura, dan petualangan santai.'
    }
  },
  akad: {
    date: 'Sabtu, 28 Februari 2026',
    time: '08:00 - 10:00 WIB',
    venue: 'Masjid Al Ikhlas',
    address: 'Jl. Merdeka No. 10, Jakarta Pusat, DKI Jakarta',
    mapsUrl: 'https://maps.google.com/?q=Masjid+Al+Ikhlas+Jakarta'
  },
  resepsi: {
    date: 'Sabtu, 28 Februari 2026',
    time: '11:00 - 14:00 WIB',
    venue: 'Gedung Serbaguna Merdeka',
    address: 'Jl. Merdeka No. 12, Jakarta Pusat, DKI Jakarta',
    mapsUrl: 'https://maps.google.com/?q=Gedung+Serbaguna+Merdeka+Jakarta'
  },
  loveStory: [
    {
      year: '2021',
      title: 'Pertemuan Pertama',
      description: 'Dipertemukan secara tidak sengaja dalam proyek kolaborasi game indie. Ranggi menulis kodenya dan Dewi mendesain dunianya.',
      icon: 'sparkles'
    },
    {
      year: '2023',
      title: 'Menyemai Impian',
      description: 'Setelah bertahun-tahun bertualang bersama, kami memutuskan untuk mengarungi bahtera hidup dengan impian yang selaras.',
      icon: 'heart'
    },
    {
      year: '2025',
      title: 'Langkah Serius',
      description: 'Pertemuan hangat antar kedua keluarga besar membawa kami pada kesepakatan suci untuk menyatukan janji pernikahan.',
      icon: 'compass'
    }
  ],
  gallery: [
    {
      url: 'https://picsum.photos/seed/wedding1/800/600',
      caption: 'Petualangan pertama kita di alam bebas'
    },
    {
      url: 'https://picsum.photos/seed/wedding2/800/600',
      caption: 'Berbagi tawa di kafe kecil sudut kota'
    },
    {
      url: 'https://picsum.photos/seed/wedding3/800/600',
      caption: 'Momen lamaran manis di bawah langit sakura'
    },
    {
      url: 'https://picsum.photos/seed/wedding4/800/600',
      caption: 'Sesi foto hangat bertema petualangan retro 16-bit'
    }
  ],
  gifts: [
    {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '123-456-7890',
      accountHolder: 'Ranggi Pratama',
      qrisUrl: 'https://picsum.photos/seed/qris/300/300'
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '987-654-3210',
      accountHolder: 'Dewi Lestari'
    }
  ]
};
