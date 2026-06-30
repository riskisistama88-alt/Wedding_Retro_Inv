/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { 
  Home, 
  MapPin, 
  Compass, 
  Sparkles, 
  Award, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Globe,
  Camera,
  Gift,
  BookOpen
} from 'lucide-react';
import { Quest } from '../types';

interface GameCanvasProps {
  guestName: string;
  onInteract: (buildingId: string, buildingName: string) => void;
  quests: Quest[];
}

interface Point {
  x: number;
  y: number;
}

interface Building {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  description: string;
}

export default function GameCanvas({ guestName, onInteract, quests }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // World setup sizing
  const worldWidth = 1800;
  const worldHeight = 1100;
  const zoom = 1.6; // High resolution zoomed viewport factor to see player clearly!

  // Player position state
  const [player, setPlayer] = useState<Point>({ x: 300, y: 350 });
  const [playerDir, setPlayerDir] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);

  // Virtual Locked/Shadow Joystick State & Reference for smooth rendering
  const [joystick, setJoystick] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    curX: number;
    curY: number;
  }>({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });

  const joystickVector = useRef<{ dx: number; dy: number; active: boolean }>({ dx: 0, dy: 0, active: false });

  // Keyboard keys down
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Frame counting for animations
  const animationFrameId = useRef<number | null>(null);
  const animFrame = useRef(0);

  // Static list of interactive stations/buildings matching the user's aesthetic mockup
  const buildings: Building[] = [
    { 
      id: 'rumah', 
      name: 'Rumah Lama', 
      x: 300, 
      y: 320, 
      width: 140, 
      height: 120, 
      color: '#d97706', 
      icon: '🏠',
      description: 'Mempelai & Orang Tua'
    },
    { 
      id: 'masjid', 
      name: 'Masjid Akad Nikah', 
      x: 750, 
      y: 280, 
      width: 160, 
      height: 140, 
      color: '#10b981', 
      icon: '🕌',
      description: 'Acara Akad Nikah'
    },
    { 
      id: 'gedung', 
      name: 'Gedung Resepsi', 
      x: 1200, 
      y: 300, 
      width: 170, 
      height: 130, 
      color: '#ec4899', 
      icon: '🏛️',
      description: 'Acara Resepsi'
    },
    { 
      id: 'pohonsakura', 
      name: 'Pohon Sakura Cinta', 
      x: 500, 
      y: 750, 
      width: 120, 
      height: 120, 
      color: '#fbcfe8', 
      icon: '🌸',
      description: 'Love Story Timeline'
    },
    { 
      id: 'kamera', 
      name: 'Gulungan Kenangan', 
      x: 950, 
      y: 700, 
      width: 130, 
      height: 110, 
      color: '#f59e0b', 
      icon: '📜',
      description: 'Gulungan Galeri Foto'
    },
    { 
      id: 'giftbox', 
      name: 'Harta Karun Kado', 
      x: 1450, 
      y: 750, 
      width: 110, 
      height: 110, 
      color: '#eab308', 
      icon: '👑',
      description: 'Amplop / Kado Digital'
    },
    { 
      id: 'buku', 
      name: 'Buku Tamu & RSVP', 
      x: 1550, 
      y: 450, 
      width: 130, 
      height: 110, 
      color: '#8b5cf6', 
      icon: '📖',
      description: 'Konfirmasi RSVP & Pesan'
    },
    { 
      id: 'portal', 
      name: 'Magical Portal', 
      x: 1680, 
      y: 580, 
      width: 100, 
      height: 110, 
      color: '#0ea5e9', 
      icon: '🔮',
      description: 'Quest Completion Portal'
    },
  ];

  // Fast Travel handler (high accessibility)
  const handleFastTravel = (b: Building) => {
    setPlayer({ x: b.x, y: b.y + b.height / 2 + 30 });
    setPlayerDir('up');
    onInteract(b.id, b.name);
  };

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed.current[key] = true;
        setIsMoving(true);
      }
      if (e.key === 'Enter' || e.key === ' ') {
        // Trigger interaction if near building
        if (activeBuildingId) {
          const b = buildings.find(item => item.id === activeBuildingId);
          if (b) {
            onInteract(b.id, b.name);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed.current[key] = false;
        
        // check if any move key is still pressed
        const stillPressed = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].some(
          k => keysPressed.current[k]
        );
        if (!stillPressed) {
          setIsMoving(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeBuildingId]);

  // Movement loop updates
  useEffect(() => {
    const speed = 4.2;
    
    const updatePosition = () => {
      let dx = 0;
      let dy = 0;
      let dir: 'down' | 'up' | 'left' | 'right' = playerDir;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        dy = -speed;
        dir = 'up';
      } else if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        dy = speed;
        dir = 'down';
      }

      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        dx = -speed;
        dir = 'left';
      } else if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        dx = speed;
        dir = 'right';
      }

      // Check shadow joystick input if keyboard is idle
      if (dx === 0 && dy === 0 && joystickVector.current.active) {
        dx = joystickVector.current.dx * speed;
        dy = joystickVector.current.dy * speed;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? 'right' : 'left';
          } else {
            dir = dy > 0 ? 'down' : 'up';
          }
        }
      }

      if (dx !== 0 || dy !== 0) {
        setPlayerDir(dir);
        setPlayer(prev => {
          let nextX = prev.x + dx;
          let nextY = prev.y + dy;

          // Stay inside world boundaries
          nextX = Math.max(50, Math.min(worldWidth - 50, nextX));
          nextY = Math.max(50, Math.min(worldHeight - 50, nextY));

          // Bounding Box Collision Check for buildings
          for (const b of buildings) {
            const bxMin = b.x - b.width / 2;
            const bxMax = b.x + b.width / 2;
            const byMin = b.y - b.height / 2;
            const byMax = b.y + b.height / 2;

            if (nextX > bxMin - 15 && nextX < bxMax + 15 && nextY > byMin - 15 && nextY < byMax + 15) {
              // Sliding movement around solid buildings
              return prev;
            }
          }

          return { x: nextX, y: nextY };
        });
      }

      // Check proximity to interactive buildings
      let closestId: string | null = null;
      let minDist = 95;

      buildings.forEach(b => {
        const dist = Math.hypot(player.x - b.x, player.y - b.y);
        if (dist < minDist) {
          closestId = b.id;
        }
      });

      setActiveBuildingId(closestId);

      // Recursive animation frame
      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePosition);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [player, playerDir]);

  // Camera scroll tracking to keep player in center of screen automatically
  useEffect(() => {
    const scroller = document.getElementById('camera-scroller');
    if (!scroller) return;

    const { width, height } = scroller.getBoundingClientRect();
    scroller.scrollLeft = (player.x * zoom) - width / 2;
    scroller.scrollTop = (player.y * zoom) - height / 2;
  }, [player.x, player.y]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    animFrame.current++;

    // Clear zoomed canvas
    ctx.clearRect(0, 0, worldWidth * zoom, worldHeight * zoom);

    ctx.save();
    ctx.scale(zoom, zoom);

    // 1. Draw Ground Texture & Background Grass
    ctx.fillStyle = '#10b981'; // vibrant emerald grass
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    // Draw grid stripes for pixel vibes
    ctx.fillStyle = '#059669';
    for (let x = 0; x < worldWidth; x += 120) {
      ctx.fillRect(x, 0, 1.5, worldHeight);
    }
    for (let y = 0; y < worldHeight; y += 120) {
      ctx.fillRect(0, y, worldWidth, 1.5);
    }

    // 2. Draw Beautiful Rivers & Streams with Animation
    ctx.fillStyle = '#3b82f6'; // Bright water
    ctx.fillRect(100, 0, 110, worldHeight);

    // River details (ripples in motion)
    ctx.fillStyle = '#60a5fa';
    const rippleOffset = (animFrame.current * 0.4) % 60;
    for (let y = 0; y < worldHeight; y += 80) {
      ctx.fillRect(130 + Math.sin((animFrame.current + y) * 0.05) * 6, y + rippleOffset, 4, 15);
      ctx.fillRect(170 + Math.cos((animFrame.current + y) * 0.05) * 6, y + ((rippleOffset + 30) % 80), 3, 10);
    }

    // River Bridge
    ctx.fillStyle = '#b45309'; // Rich wooden bridge
    ctx.fillRect(80, 480, 150, 80);
    ctx.fillStyle = '#78350f'; // Railings
    ctx.fillRect(80, 480, 150, 8);
    ctx.fillRect(80, 552, 150, 8);
    
    // Bridge rivets and planks
    ctx.fillStyle = '#d97706';
    for (let bx = 95; bx < 220; bx += 20) {
      ctx.fillRect(bx, 488, 3, 64);
    }

    // 3. Draw Cobblestone Roads & Paths linking major spots
    ctx.fillStyle = '#e4e4e7'; // slate stone path
    // Main horizontal road connecting Rumah -> Masjid -> Gedung -> RSVP -> Portal
    ctx.fillRect(200, 480, worldWidth - 300, 45);
    // Path branching up to Rumah
    ctx.fillRect(280, 410, 45, 75);
    // Path branching up to Masjid
    ctx.fillRect(730, 400, 45, 85);
    // Path branching up to Gedung
    ctx.fillRect(1180, 410, 45, 75);
    // Path branching down to Love Story Sakura
    ctx.fillRect(480, 525, 45, 120);
    // Path branching down to Kamera Galeri
    ctx.fillRect(930, 525, 45, 80);
    // Path branching down to Giftbox
    ctx.fillRect(1430, 525, 45, 130);

    // Draw little stone dots inside cobblestone path
    ctx.fillStyle = '#a1a1aa';
    for (let rx = 210; rx < worldWidth - 100; rx += 45) {
      ctx.beginPath();
      ctx.arc(rx + (Math.sin(rx) * 10), 495 + (Math.cos(rx) * 6), 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Draw Cute Decorative Scenery
    // Pink Cherry Blossom trees (Sakura)
    const drawSakuraTree = (tx: number, ty: number, size = 32) => {
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 6, ty, 12, size);
      
      // Leaves/Blossoms
      ctx.fillStyle = '#fbcfe8'; // soft pink
      ctx.beginPath();
      ctx.arc(tx, ty - 10, size, 0, Math.PI * 2);
      ctx.arc(tx - size * 0.5, ty - 20, size * 0.8, 0, Math.PI * 2);
      ctx.arc(tx + size * 0.5, ty - 20, size * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Highlights
      ctx.fillStyle = '#fce7f3';
      ctx.beginPath();
      ctx.arc(tx - 5, ty - 22, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw static Sakura trees at various corners
    drawSakuraTree(140, 200);
    drawSakuraTree(140, 780);
    drawSakuraTree(400, 160);
    drawSakuraTree(1000, 150);
    drawSakuraTree(1580, 200);
    drawSakuraTree(1750, 800);

    // Green Oak Trees
    const drawGreenTree = (tx: number, ty: number, size = 28) => {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 5, ty, 10, size);
      ctx.fillStyle = '#047857'; // Forest green
      ctx.beginPath();
      ctx.arc(tx, ty - 8, size, 0, Math.PI * 2);
      ctx.arc(tx - size * 0.4, ty - 16, size * 0.7, 0, Math.PI * 2);
      ctx.arc(tx + size * 0.4, ty - 16, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    };

    drawGreenTree(500, 240);
    drawGreenTree(620, 200);
    drawGreenTree(880, 220);
    drawGreenTree(1100, 230);
    drawGreenTree(1360, 210);
    drawGreenTree(1460, 230);

    // Draw Cute Yellow Flower Patches
    ctx.fillStyle = '#fef08a';
    const drawFlowerPatch = (fx: number, fy: number) => {
      ctx.beginPath();
      ctx.arc(fx, fy, 4, 0, Math.PI * 2);
      ctx.arc(fx - 5, fy + 3, 3, 0, Math.PI * 2);
      ctx.arc(fx + 5, fy - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      // Orange center
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
    };

    drawFlowerPatch(260, 560);
    drawFlowerPatch(320, 580);
    drawFlowerPatch(700, 550);
    drawFlowerPatch(1250, 580);
    drawFlowerPatch(1580, 850);

    // 5. Draw Interactive Buildings / Stations as Beautiful Pixel Structures
    buildings.forEach(b => {
      const x = b.x;
      const y = b.y;
      const w = b.width;
      const h = b.height;

      // Drop shadow for the structure
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(x - w / 2 + 5, y - h / 2 + 5, w, h);

      if (b.id === 'rumah') {
        // --- Traditional Old House (Rumah Lama) ---
        // Raised wooden foundation platform
        ctx.fillStyle = '#78350f'; // Dark brown pillars
        ctx.fillRect(x - w/2 + 10, y + h/2 - 20, 8, 20);
        ctx.fillRect(x + w/2 - 18, y + h/2 - 20, 8, 20);
        ctx.fillRect(x - 4, y + h/2 - 20, 8, 20);

        // Wooden platform base
        ctx.fillStyle = '#b45309'; // Lighter brown wood
        ctx.fillRect(x - w/2 + 5, y + h/2 - 24, w - 10, 6);

        // Steps leading up
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(x - 12, y + h/2 - 18, 24, 18);
        ctx.fillStyle = '#a16207'; // Step treads
        ctx.fillRect(x - 10, y + h/2 - 15, 20, 2);
        ctx.fillRect(x - 10, y + h/2 - 9, 20, 2);

        // Main Timber Walls
        ctx.fillStyle = '#854d0e'; // Rustic logs brown
        ctx.fillRect(x - w/2 + 8, y - h/2 + 10, w - 16, h - 34);

        // Drawing timber lines (logs effect)
        ctx.fillStyle = '#713f12';
        for (let ly = y - h/2 + 20; ly < y + h/2 - 24; ly += 14) {
          ctx.fillRect(x - w/2 + 8, ly, w - 16, 2);
        }

        // Two cute windows
        ctx.fillStyle = '#fef08a'; // Glowing warm light
        ctx.fillRect(x - w/2 + 20, y - 10, 18, 18);
        ctx.fillRect(x + w/2 - 38, y - 10, 18, 18);
        // Window frames
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - w/2 + 20, y - 10, 18, 18);
        ctx.strokeRect(x + w/2 - 38, y - 10, 18, 18);
        ctx.beginPath();
        ctx.moveTo(x - w/2 + 29, y - 10); ctx.lineTo(x - w/2 + 29, y + 8);
        ctx.moveTo(x - w/2 + 20, y - 1); ctx.lineTo(x - w/2 + 38, y - 1);
        ctx.moveTo(x + w/2 - 29, y - 10); ctx.lineTo(x + w/2 - 29, y + 8);
        ctx.moveTo(x + w/2 - 38, y - 1); ctx.lineTo(x + w/2 - 20, y - 1);
        ctx.stroke();

        // Front Door
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x - 14, y + h/2 - 44, 28, 20);
        ctx.fillStyle = '#eab308'; // Brass lock plate
        ctx.fillRect(x - 2, y + h/2 - 34, 4, 6);

        // Grand Pointed layered Roof (Traditional Indonesian style)
        ctx.fillStyle = '#7c2d12'; // Rich clay tile color
        ctx.beginPath();
        ctx.moveTo(x - w/2 - 10, y - h/2 + 10);
        ctx.lineTo(x, y - h/2 - 32);
        ctx.lineTo(x + w/2 + 10, y - h/2 + 10);
        ctx.closePath();
        ctx.fill();

        // Top layered peak roof cap
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(x - w/2 + 15, y - h/2 + 5);
        ctx.lineTo(x, y - h/2 - 40);
        ctx.lineTo(x + w/2 - 15, y - h/2 + 5);
        ctx.closePath();
        ctx.fill();

      } else if (b.id === 'masjid') {
        // --- Mosque (Masjid Akad Nikah) ---
        // Clean ivory/white marble base and walls
        ctx.fillStyle = '#f4f4f5';
        ctx.fillRect(x - w/2, y - h/2 + 15, w, h - 25);
        
        // Green geometric tile trims
        ctx.fillStyle = '#059669'; // Emerald green trim
        ctx.fillRect(x - w/2, y + h/2 - 18, w, 8); // Base trim
        ctx.fillRect(x - w/2, y - h/2 + 15, w, 6);  // Roof trim

        // Arch Windows
        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath();
        ctx.arc(x - 35, y, 10, Math.PI, 0);
        ctx.fillRect(x - 45, y, 20, 15);
        ctx.arc(x + 35, y, 10, Math.PI, 0);
        ctx.fillRect(x + 25, y, 20, 15);
        ctx.fill();

        // Arch window grid lines
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 35, y - 10); ctx.lineTo(x - 35, y + 15);
        ctx.moveTo(x + 35, y - 10); ctx.lineTo(x + 35, y + 15);
        ctx.stroke();

        // Grand Arched Doorway
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.arc(x, y + h/2 - 38, 16, Math.PI, 0);
        ctx.fillRect(x - 16, y + h/2 - 38, 32, 28);
        ctx.fill();

        // Glowing center in door
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y + h/2 - 38, 4, 0, Math.PI * 2);
        ctx.fill();

        // Central Drum for Dome
        ctx.fillStyle = '#e4e4e7';
        ctx.fillRect(x - 30, y - h/2 - 10, 60, 25);

        // Grand Golden Dome
        ctx.fillStyle = '#fbbf24'; // Golden dome
        ctx.beginPath();
        ctx.arc(x, y - h/2 - 10, 28, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        // Golden Crescent Moon and Star on top of the dome
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y - h/2 - 46, 6, Math.PI * 0.2, Math.PI * 1.5);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x - 1.5, y - h/2 - 50, 3, 3); // Star point

        // Side Minaret Towers (Left and Right)
        const drawMinaret = (mx: number) => {
          ctx.fillStyle = '#f4f4f5';
          ctx.fillRect(mx - 10, y - h/2 - 15, 20, h + 5);
          ctx.fillStyle = '#059669'; // Trim
          ctx.fillRect(mx - 12, y - h/2 - 15, 24, 4);
          ctx.fillRect(mx - 10, y + h/2 - 18, 20, 6);
          
          // Tiny green dome on top of Minaret
          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.arc(mx, y - h/2 - 15, 10, Math.PI, 0);
          ctx.closePath();
          ctx.fill();

          // Spire
          ctx.fillRect(mx - 1, y - h/2 - 30, 2, 8);
        };
        drawMinaret(x - w/2 - 4);
        drawMinaret(x + w/2 + 4);

      } else if (b.id === 'gedung') {
        // --- Grand Palace / Building (Gedung Resepsi Lama) ---
        // Stately classic heritage masonry walls (Red Brick block structure)
        ctx.fillStyle = '#991b1b'; // Dark brick red
        ctx.fillRect(x - w/2, y - h/2 + 10, w, h - 22);

        // Horizontal brick lines (details)
        ctx.fillStyle = '#7f1d1d';
        for (let ly = y - h/2 + 20; ly < y + h/2 - 12; ly += 12) {
          ctx.fillRect(x - w/2, ly, w, 1.5);
        }

        // Grand Ivory Pillars (Pilar-Pilar Gedung Klasik)
        ctx.fillStyle = '#f4f5f6'; // Clean pillars
        const pillarPositions = [x - w/2 + 20, x - 25, x + 25, x + w/2 - 20];
        pillarPositions.forEach(pxPos => {
          ctx.fillRect(pxPos - 6, y - h/2 + 10, 12, h - 22);
          ctx.fillStyle = '#e4e4e7'; // Pillar shadow details
          ctx.fillRect(pxPos + 2, y - h/2 + 10, 4, h - 22);
          ctx.fillStyle = '#f4f5f6';
        });

        // Elegant Triangular Classical Pediment (Roof)
        ctx.fillStyle = '#450a0a'; // Deep wood/stone shingles
        ctx.beginPath();
        ctx.moveTo(x - w/2 - 15, y - h/2 + 10);
        ctx.lineTo(x, y - h/2 - 35);
        ctx.lineTo(x + w/2 + 15, y - h/2 + 10);
        ctx.closePath();
        ctx.fill();

        // Pediment Trim border
        ctx.strokeStyle = '#f4f4f5';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Grand Double Doors
        ctx.fillStyle = '#451a03'; // Dark Mahogany
        ctx.fillRect(x - 20, y + h/2 - 48, 40, 36);
        ctx.fillStyle = '#78350f'; // Panel borders
        ctx.strokeRect(x - 20, y + h/2 - 48, 40, 36);
        
        // Golden door knobs
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(x - 3, y + h/2 - 30, 2.5, 0, Math.PI * 2);
        ctx.arc(x + 3, y + h/2 - 30, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Red Carpet Rolling Down out of the building
        ctx.fillStyle = '#be123c'; // Royal Red carpet
        ctx.fillRect(x - 16, y + h/2 - 12, 32, 25);
        ctx.fillStyle = '#e11d48'; // Bright red borders
        ctx.fillRect(x - 16, y + h/2 - 12, 2, 25);
        ctx.fillRect(x + 14, y + h/2 - 12, 2, 25);

        // Side lanterns with glowing yellow lights
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(x - 45, y - 5, 4, 0, Math.PI * 2);
        ctx.arc(x + 45, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();

      } else if (b.id === 'pohonsakura') {
        // --- Giant Sakura Tree (Pohon Sakura) ---
        // Thick twisted ancient wood trunk
        ctx.fillStyle = '#451a03'; // Dark bark
        ctx.beginPath();
        ctx.moveTo(x - 12, y + h/2 - 5);
        ctx.quadraticCurveTo(x - 4, y, x - 6, y - h/2 + 15);
        ctx.lineTo(x + 6, y - h/2 + 15);
        ctx.quadraticCurveTo(x + 4, y, x + 12, y + h/2 - 5);
        ctx.closePath();
        ctx.fill();

        // Roots spreading out
        ctx.fillRect(x - 22, y + h/2 - 10, 14, 5);
        ctx.fillRect(x + 8, y + h/2 - 10, 14, 5);

        // Massive cloud-like Sakura canopy (layers of pink overlapping circles)
        const drawCanopyNode = (cx: number, cy: number, r: number, color: string) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        };

        // Dark/Shadow underlayer
        drawCanopyNode(x - 35, y - 25, 34, '#f472b6'); // Medium pink
        drawCanopyNode(x + 35, y - 25, 34, '#f472b6');
        drawCanopyNode(x, y - 45, 40, '#f472b6');

        // Bright blossom main layer
        drawCanopyNode(x - 30, y - 30, 32, '#fbcfe8'); // Soft pink
        drawCanopyNode(x + 30, y - 30, 32, '#fbcfe8');
        drawCanopyNode(x, y - 50, 36, '#fbcfe8');
        drawCanopyNode(x - 10, y - 15, 26, '#fbcfe8');
        drawCanopyNode(x + 10, y - 15, 26, '#fbcfe8');

        // Highlight layer (fluffy top)
        drawCanopyNode(x - 15, y - 48, 22, '#fdf2f8'); // Lightest pink
        drawCanopyNode(x + 15, y - 48, 22, '#fdf2f8');
        drawCanopyNode(x, y - 60, 24, '#fdf2f8');

        // Hanging red paper lanterns
        const drawHangingLantern = (lx: number, ly: number) => {
          ctx.fillStyle = '#b45309'; // string
          ctx.fillRect(lx - 1, ly - 15, 2, 15);
          
          ctx.fillStyle = '#ef4444'; // Red lantern ball
          ctx.beginPath();
          ctx.arc(lx, ly, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a'; // Glowing yellow core
          ctx.beginPath();
          ctx.arc(lx, ly, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbbf24'; // gold caps
          ctx.fillRect(lx - 4, ly - 8, 8, 2);
          ctx.fillRect(lx - 4, ly + 6, 8, 2);
        };
        drawHangingLantern(x - 28, y - 5);
        drawHangingLantern(x + 28, y - 5);

        // Carpet of fallen pink petals on ground
        ctx.fillStyle = '#fbcfe8';
        for (let i = 0; i < 15; i++) {
          const pxOffset = Math.sin(i * 123) * 45;
          const pyOffset = Math.cos(i * 456) * 15;
          ctx.fillRect(x + pxOffset - 2, y + h/2 - 12 + pyOffset, 4, 3);
        }

        // Falling animated petals drifting in the breeze
        ctx.fillStyle = '#f472b6';
        for (let i = 0; i < 3; i++) {
          const speed = 0.5 + (i * 0.2);
          const pxOffset = ((animFrame.current * speed + i * 140) % 90) - 45;
          const pyOffset = ((animFrame.current * speed * 1.2 + i * 80) % 70) - 20;
          ctx.fillRect(x + pxOffset, y - 20 + pyOffset, 3.5, 2.5);
        }

      } else if (b.id === 'giftbox') {
        // --- Treasure Chest (Harta Karun) ---
        // Sturdy vintage wooden body
        ctx.fillStyle = '#78350f'; // Dark mahogany brown
        ctx.fillRect(x - w/2 + 10, y - h/2 + 20, w - 20, h - 30);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - w/2 + 10, y - h/2 + 20, w - 20, h - 30);

        // Arched lid of the chest
        ctx.fillStyle = '#9a3412'; // Lighter brown lid
        ctx.beginPath();
        ctx.arc(x, y - h/2 + 20, w/2 - 10, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Horizontal wooden texture lines
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x - w/2 + 12, y - 5, w - 24, 2.5);
        ctx.fillRect(x - w/2 + 12, y + 10, w - 24, 2.5);

        // Heavy metallic gold band straps
        ctx.fillStyle = '#eab308'; // Bright gold
        ctx.fillRect(x - w/2 + 18, y - h/2 + 8, 8, h - 18);
        ctx.fillRect(x + w/2 - 26, y - h/2 + 8, 8, h - 18);
        // Horizontal band strap
        ctx.fillRect(x - w/2 + 10, y - h/2 + 20, w - 20, 5);

        // Golden studs on bands
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x - w/2 + 21, y, 2, 2);
        ctx.fillRect(x - w/2 + 21, y + 15, 2, 2);
        ctx.fillRect(x + w/2 - 23, y, 2, 2);
        ctx.fillRect(x + w/2 - 23, y + 15, 2, 2);

        // Large golden keyhole lockplate in the center
        ctx.fillStyle = '#f59e0b'; // Shiny gold plate
        ctx.fillRect(x - 12, y - h/2 + 35, 24, 24);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - 12, y - h/2 + 35, 24, 24);

        // Keyhole
        ctx.fillStyle = '#1e1b4b'; // Deep dark slot
        ctx.beginPath();
        ctx.arc(x, y - h/2 + 43, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 1.5, y - h/2 + 43, 3, 9);

        // Magical gold/yellow sparkles floating up
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < 3; i++) {
          const sparkleX = x + Math.sin(animFrame.current * 0.05 + i * 2) * 20;
          const sparkleY = y - 25 - ((animFrame.current * 0.6 + i * 15) % 35);
          ctx.fillRect(sparkleX, sparkleY, 3, 3);
        }

      } else if (b.id === 'kamera') {
        // --- Unrolled Paper Scroll (Gulungan Kertas) ---
        // Wooden rollers (spindles) at top and bottom
        ctx.fillStyle = '#78350f'; // Roller color
        ctx.fillRect(x - w/2 - 4, y - h/2 + 12, w + 8, 8); // Top roller
        ctx.fillRect(x - w/2 - 4, y + h/2 - 20, w + 8, 8); // Bottom roller

        // Shiny gold knobs on spindles ends
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x - w/2 - 8, y - h/2 + 10, 4, 12);
        ctx.fillRect(x + w/2 + 4, y - h/2 + 10, 4, 12);
        ctx.fillRect(x - w/2 - 8, y + h/2 - 22, 4, 12);
        ctx.fillRect(x + w/2 + 4, y + h/2 - 22, 4, 12);

        // Unrolled warm parchment paper body
        ctx.fillStyle = '#fef3c7'; // Cream parchment paper
        ctx.fillRect(x - w/2 + 2, y - h/2 + 20, w - 4, h - 40);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x - w/2 + 2, y - h/2 + 20, w - 4, h - 40);

        // Subtle horizontal calligraphy/inscription lines on paper
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x - 25, y - 14, 50, 2);
        ctx.fillRect(x - 32, y - 6, 64, 2);
        ctx.fillRect(x - 20, y + 2, 40, 2);

        // Tiny pixel heart design on the scroll
        ctx.fillStyle = '#ec4899'; // Hot pink heart
        ctx.beginPath();
        ctx.arc(x - 4, y + 14, 3, 0, Math.PI * 2);
        ctx.arc(x + 4, y + 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - 7.5, y + 14);
        ctx.lineTo(x, y + 22);
        ctx.lineTo(x + 7.5, y + 14);
        ctx.closePath();
        ctx.fill();

        // Magic sparkling particles drifting around
        ctx.fillStyle = '#f59e0b';
        for (let i = 0; i < 3; i++) {
          const pxOffset = Math.sin(animFrame.current * 0.1 + i * 20) * (w/2 + 5);
          const pyOffset = Math.cos(animFrame.current * 0.08 + i * 15) * 20;
          ctx.fillRect(x + pxOffset, y + pyOffset, 2.5, 2.5);
        }

      } else if (b.id === 'buku') {
        // --- Open Guest Registry Book on a Table ---
        // Wooden desk/table
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x - w/2 + 10, y - h/2 + 25, w - 20, h - 35);
        ctx.fillStyle = '#7c2d12'; // table legs
        ctx.fillRect(x - w/2 + 15, y + h/2 - 10, 8, 12);
        ctx.fillRect(x + w/2 - 23, y + h/2 - 10, 8, 12);

        // Open book pages
        ctx.fillStyle = '#f4f4f5'; // white pages
        ctx.fillRect(x - 35, y - 12, 34, 22);
        ctx.fillRect(x + 1, y - 12, 34, 22);
        
        // Book leather cover backing
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(x - 38, y - 14, 76, 2);
        ctx.fillRect(x - 38, y + 10, 76, 2);
        ctx.fillRect(x - 38, y - 14, 2, 26);
        ctx.fillRect(x + 36, y - 14, 2, 26);

        // Text lines in book
        ctx.fillStyle = '#a1a1aa';
        ctx.fillRect(x - 30, y - 6, 24, 1.5);
        ctx.fillRect(x - 30, y - 1, 20, 1.5);
        ctx.fillRect(x - 30, y + 4, 24, 1.5);
        ctx.fillRect(x + 6, y - 6, 24, 1.5);
        ctx.fillRect(x + 6, y - 1, 24, 1.5);
        ctx.fillRect(x + 6, y + 4, 18, 1.5);

      } else if (b.id === 'portal') {
        // --- Mystical Rotating Glowing Portal ---
        const rotTime = animFrame.current * 0.06;
        
        // Floating platform pedestal
        ctx.fillStyle = '#3f3f46';
        ctx.fillRect(x - 30, y + h/2 - 20, 60, 10);
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x - 24, y + h/2 - 10, 48, 10);

        // Glowing outer circle ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(x, y - 10, 24 + Math.sin(rotTime) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Inner galaxy layers
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(x, y - 10, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.arc(x, y - 10, 14 + Math.cos(rotTime) * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(x, y - 10, 8 + Math.sin(rotTime * 2) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Light core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y - 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Stars rotating around
        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 4; i++) {
          const starAngle = rotTime + (i * Math.PI / 2);
          const starDist = 18 + Math.sin(rotTime + i) * 4;
          const starX = x + Math.cos(starAngle) * starDist;
          const starY = y - 10 + Math.sin(starAngle) * starDist;
          ctx.fillRect(starX - 1.5, starY - 1.5, 3, 3);
        }
      }

      // --- TEXT LABEL & BADGES (Consistent, high readability HUD signs) ---
      // Signboard wood post
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 4, y - h / 2 - 38, 8, 38);

      // Station Text Label sign board on top of the roof
      ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
      ctx.fillRect(x - 65, y - h / 2 - 58, 130, 22);
      
      // Border for label
      const questStatus = quests.find(q => q.targetId === b.id);
      ctx.strokeStyle = questStatus?.completed ? '#10b981' : '#f43f5e'; // Green if done, pink if open
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 65, y - h / 2 - 58, 130, 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(b.name, x, y - h / 2 - 47);

      // Tiny green checkmark badge if visited
      if (questStatus?.completed) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x + 54, y - h / 2 - 47, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px Arial';
        ctx.fillText('✓', x + 54, y - h / 2 - 47);
      }
    });

    // 6. Draw the player (Animated Pixel Character)
    const px = player.x;
    const py = player.y;

    // Bobbing offset when walking
    const isWalking = isMoving;
    const bobOffset = isWalking ? Math.sin(animFrame.current * 0.2) * 2.5 : 0;
    const footSwing = isWalking ? Math.sin(animFrame.current * 0.2) * 4 : 0;

    // Drop shadow under player legs
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(px, py + 18, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (White shirt + blue vest)
    ctx.fillStyle = '#1e3a8a'; // Deep blue vest
    ctx.fillRect(px - 7, py - 4 + bobOffset, 14, 16);
    
    // Shirt sleeves
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 10, py - 4 + bobOffset, 3, 10);
    ctx.fillRect(px + 7, py - 4 + bobOffset, 3, 10);

    // Cute rounded head / face
    ctx.fillStyle = '#fbcfe8'; // peach/pink skin tone
    ctx.beginPath();
    ctx.arc(px, py - 14 + bobOffset, 9, 0, Math.PI * 2);
    ctx.fill();

    // Groom brown hair
    ctx.fillStyle = '#451a03'; // dark brown
    ctx.beginPath();
    ctx.arc(px, py - 17 + bobOffset, 9.5, Math.PI, 0); // hair top
    ctx.fill();
    // Hair bangs
    ctx.fillRect(px - 10, py - 17 + bobOffset, 4, 6);
    ctx.fillRect(px + 6, py - 17 + bobOffset, 4, 6);

    // Eyes looking based on direction
    ctx.fillStyle = '#18181b';
    if (playerDir === 'down') {
      ctx.fillRect(px - 4, py - 14 + bobOffset, 2, 2.5);
      ctx.fillRect(px + 2, py - 14 + bobOffset, 2, 2.5);
    } else if (playerDir === 'left') {
      ctx.fillRect(px - 7, py - 14 + bobOffset, 2, 2.5);
    } else if (playerDir === 'right') {
      ctx.fillRect(px + 5, py - 14 + bobOffset, 2, 2.5);
    }

    // Legs (Trousers & shoes)
    ctx.fillStyle = '#374151'; // dark trousers
    ctx.fillRect(px - 6, py + 12 + bobOffset, 4, 6);
    ctx.fillRect(px + 2, py + 12 + bobOffset, 4, 6);
    
    // Shoes swing offset when walking
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(px - 7 - (playerDir === 'left' ? footSwing : 0), py + 17 + bobOffset, 5, 3);
    ctx.fillRect(px + 2 + (playerDir === 'right' ? footSwing : 0), py + 17 + bobOffset, 5, 3);

    // Float Label "You" above player
    ctx.fillStyle = 'rgba(24, 24, 27, 0.75)';
    ctx.fillRect(px - 28, py - 38 + bobOffset, 56, 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8.5px sans-serif';
    ctx.fillText('KAMU', px, py - 27 + bobOffset);

    ctx.restore();
  }, [player, playerDir, isMoving, quests]);

  // Virtual Locked Joystick Touch Event Handlers
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    setJoystick({
      active: true,
      startX: cx,
      startY: cy,
      curX: touch.clientX,
      curY: touch.clientY
    });

    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const dist = Math.hypot(dx, dy);
    
    let normX = 0;
    let normY = 0;
    if (dist > 0) {
      normX = dx / dist;
      normY = dy / dist;
    }

    joystickVector.current = { dx: normX, dy: normY, active: true };
    setIsMoving(true);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!joystick.active) return;

    const touch = e.touches[0];
    const cx = joystick.startX;
    const cy = joystick.startY;

    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 24; // boundary limit for visual knob movement

    let finalX = touch.clientX;
    let finalY = touch.clientY;
    let normX = 0;
    let normY = 0;

    if (dist > 0) {
      normX = dx / dist;
      normY = dy / dist;

      if (dist > maxRadius) {
        finalX = cx + normX * maxRadius;
        finalY = cy + normY * maxRadius;
      }
    } else {
      finalX = cx;
      finalY = cy;
    }

    setJoystick(prev => ({
      ...prev,
      curX: finalX,
      curY: finalY
    }));

    joystickVector.current = { dx: normX, dy: normY, active: true };
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setJoystick({
      active: false,
      startX: 0,
      startY: 0,
      curX: 0,
      curY: 0
    });
    joystickVector.current = { dx: 0, dy: 0, active: false };
    setIsMoving(false);
  };

  return (
    <div 
      id="game-canvas-container" 
      className="relative flex-1 flex flex-col min-h-0 bg-emerald-950 overflow-hidden select-none"
    >
      
      {/* 🧭 Retro Pixel Mini Map in top-left corner */}
      <div 
        id="retro-minimap" 
        className="absolute top-4 left-4 z-40 w-32 h-24 bg-zinc-950/85 border-4 border-black rounded-xl p-1.5 shadow-2xl flex flex-col justify-between select-none pointer-events-none"
      >
        <span className="text-[7.5px] text-pink-500 font-extrabold uppercase tracking-widest text-center border-b border-zinc-800 pb-0.5" style={{ fontFamily: 'var(--font-retro)' }}>
          🗺️ PETA MINI DESA
        </span>
        <div className="relative flex-1 bg-[#065f46] rounded-md overflow-hidden mt-1 border border-zinc-800/80">
          {/* Mini River representation */}
          <div className="absolute top-0 bottom-0 bg-blue-500/50" style={{ left: '5.5%', width: '6.1%' }} />
          {/* Mini Bridge representation */}
          <div className="absolute h-0.5 bg-amber-800" style={{ left: '4.5%', width: '8.3%', top: '43.6%' }} />
          
          {/* Dynamic Buildings indicators */}
          {buildings.map(b => {
            const bx = (b.x / worldWidth) * 100;
            const by = (b.y / worldHeight) * 100;
            return (
              <div 
                key={`mini-${b.id}`}
                className="absolute w-2 h-2 rounded-xs border border-black/50 flex items-center justify-center"
                style={{ 
                  left: `${bx}%`, 
                  top: `${by}%`, 
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: b.color 
                }}
              />
            );
          })}

          {/* Player Blinking Dot */}
          <div 
            className="absolute w-2 h-2 bg-pink-500 rounded-full border border-white animate-pulse"
            style={{ 
              left: `${(player.x / worldWidth) * 100}%`, 
              top: `${(player.y / worldHeight) * 100}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 4px #ec4899'
            }}
          />
        </div>
      </div>

      {/* Scrollable Viewport with Camera Centered Tracking */}
      <div 
        id="camera-scroller"
        className="flex-1 overflow-auto relative"
      >
        <div 
          className="relative"
          style={{ width: worldWidth * zoom, height: worldHeight * zoom }}
        >
          {/* Real HTML5 Game Canvas */}
          <canvas
            ref={canvasRef}
            width={worldWidth * zoom}
            height={worldHeight * zoom}
            style={{ width: worldWidth * zoom, height: worldHeight * zoom }}
            className="absolute inset-0 block bg-emerald-900"
            id="wae-game-canvas"
          />

          {/* Prompt banner shown above player head when close to a building */}
          {activeBuildingId && (
            <div 
              className="absolute pointer-events-none z-30 animate-bounce"
              style={{
                left: player.x * zoom,
                top: (player.y - 72) * zoom,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-zinc-900 text-white font-black text-[9.5px] uppercase px-3 py-1.5 rounded-lg shadow-lg border border-pink-500 tracking-wider flex items-center space-x-1 whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>Tekan ENTER / Ketuk untuk Membuka</span>
              </div>
            </div>
          )}

          {/* Invisible click targets over the buildings so mobile users can just TAP directly on the buildings! */}
          {buildings.map(b => (
            <button
              key={`target-${b.id}`}
              onClick={() => handleFastTravel(b)}
              className="absolute cursor-pointer border border-transparent focus:outline-hidden animate-pulse hover:border-white/20"
              style={{
                left: (b.x - b.width / 2) * zoom,
                top: (b.y - b.height / 2 - 30) * zoom,
                width: b.width * zoom,
                height: (b.height + 40) * zoom,
                zIndex: 20
              }}
              title={`Klik untuk pergi ke ${b.name}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Button (A Button) on the bottom right of the screen */}
      {activeBuildingId && (
        <button 
          id="interact-btn-mobile"
          onClick={() => {
            const b = buildings.find(item => item.id === activeBuildingId);
            if (b) onInteract(b.id, b.name);
          }}
          className="absolute bottom-16 right-6 z-40 w-16 h-16 bg-pink-600 active:bg-pink-700 text-white font-retro text-[9px] border-4 border-black rounded-full flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer select-none md:hidden"
          style={{ fontFamily: 'var(--font-retro)' }}
        >
          <span className="text-[14px]">A</span>
          <span className="text-[7px] leading-none uppercase font-bold tracking-tighter mt-0.5">OPEN</span>
        </button>
      )}

      {/* Locked Virtual Joystick D-Pad in the bottom-left corner */}
      <div 
        id="locked-joystick-dpad"
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
        onTouchCancel={handleJoystickTouchEnd}
        className="absolute bottom-16 left-6 z-40 w-24 h-24 bg-black/75 border-4 border-zinc-950 rounded-full flex items-center justify-center shadow-2xl select-none md:hidden"
      >
        {/* Outer Ring directions */}
        <div className="absolute top-1 text-[8px] text-zinc-500 font-bold">▲</div>
        <div className="absolute bottom-1 text-[8px] text-zinc-500 font-bold">▼</div>
        <div className="absolute left-1.5 text-[8px] text-zinc-500 font-bold">◀</div>
        <div className="absolute right-1.5 text-[8px] text-zinc-500 font-bold">▶</div>
        
        {/* Center decorative ring */}
        <div className="w-16 h-16 rounded-full border border-zinc-800/50 flex items-center justify-center relative">
          {/* Inner Draggable Knob */}
          <div 
            className="w-10 h-10 bg-gradient-to-br from-[#86efac] via-[#22c55e] to-[#15803d] rounded-full border-2 border-black flex items-center justify-center shadow-lg cursor-pointer"
            style={{
              transform: joystick.active
                ? `translate(${joystick.curX - joystick.startX}px, ${joystick.curY - joystick.startY}px)`
                : 'translate(0px, 0px)'
            }}
          >
            {/* Inner red dot for authentic retro style */}
            <div className="w-3.5 h-3.5 bg-red-600 rounded-full border border-black shadow-inner animate-pulse" />
          </div>
        </div>
      </div>

      {/* Simple touch indicator overlay */}
      <div className="absolute bottom-16 left-32 z-30 pointer-events-none flex flex-col space-y-1 md:hidden">
        <div className="bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[8px] font-retro text-zinc-300 shadow-md">
          <span className="text-yellow-400">💡 HP Tip:</span> Gunakan <span className="text-pink-400 font-extrabold">Joystick Kunci</span> di pojok kiri bawah untuk menjelajah!
        </div>
      </div>

      {/* Quest Tracker Floating HUD panel on top right */}
      <div id="quest-hud-tracker" className="absolute top-4 right-4 z-30 w-64 bg-zinc-900/95 backdrop-blur-md text-white rounded-xl p-4 border border-zinc-800 shadow-xl space-y-2 max-h-[220px] overflow-y-auto">
        <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center space-x-1.5">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Daftar Misi Eksplorasi</span>
        </h3>
        
        <div className="space-y-1.5">
          {quests.map(q => (
            <button
              id={`hud-quest-btn-${q.id}`}
              key={q.id}
              onClick={() => {
                const b = buildings.find(item => item.id === q.targetId);
                if (b) handleFastTravel(b);
              }}
              className="w-full flex items-center justify-between text-left p-1.5 rounded-lg hover:bg-zinc-800 transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${q.completed ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`text-[11px] font-semibold truncate group-hover:text-pink-400 ${q.completed ? 'line-through text-zinc-400' : 'text-zinc-200'}`}>
                  {q.label}
                </span>
              </div>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 pl-1">Go ➔</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating interactive instructions badge */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-none bg-zinc-900/90 text-zinc-200 px-3 py-1.5 rounded-full text-[10px] font-medium border border-zinc-800 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Gunakan WASD/Arah atau klik langsung pada bangunan untuk teleportasi instant!</span>
      </div>

    </div>
  );
}
