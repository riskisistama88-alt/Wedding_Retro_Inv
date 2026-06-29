/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeddingData {
  couple: {
    groom: {
      name: string;
      fullName: string;
      father: string;
      mother: string;
      avatar: string;
      bio: string;
    };
    bride: {
      name: string;
      fullName: string;
      father: string;
      mother: string;
      avatar: string;
      bio: string;
    };
  };
  akad: {
    date: string;
    time: string;
    venue: string;
    address: string;
    mapsUrl: string;
  };
  resepsi: {
    date: string;
    time: string;
    venue: string;
    address: string;
    mapsUrl: string;
  };
  loveStory: Array<{
    year: string;
    title: string;
    description: string;
    icon: string;
  }>;
  gallery: Array<{
    url: string;
    caption: string;
  }>;
  gifts: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrisUrl?: string;
  }>;
}

export interface Quest {
  id: string;
  label: string;
  description: string;
  targetId: string; // matches building ID
  completed: boolean;
}

export interface GuestGreeting {
  id: string;
  name: string;
  rsvpStatus: 'hadir' | 'tidak_hadir' | 'ragu';
  message: string;
  timestamp: string;
  likes: number;
}
