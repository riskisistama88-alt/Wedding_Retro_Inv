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

  // Player position state
  const [player, setPlayer] = useState<Point>({ x: 300, y: 350 });
  const [playerDir, setPlayerDir] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);

  // Virtual Shadow Joystick ("joystick bayangan") State & Reference for smooth, lag-free rendering
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
      name: 'Rumah Mempelai', 
      x: 300, 
      y: 320, 
      width: 140, 
      height: 120, 
      color: '#fef08a', 
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
      color: '#a7f3d0', 
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
      color: '#fbcfe8', 
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
      color: '#fce7f3', 
      icon: '🌸',
      description: 'Love Story Timeline'
    },
    { 
      id: 'kamera', 
      name: 'Galeri Foto Retro', 
      x: 950, 
      y: 700, 
      width: 130, 
      height: 110, 
      color: '#bfdbfe', 
      icon: '📷',
      description: 'Galeri & Album Foto'
    },
    { 
      id: 'giftbox', 
      name: 'Amplop Kado Digital', 
      x: 1450, 
      y: 750, 
      width: 110, 
      height: 110, 
      color: '#fed7aa', 
      icon: '🎁',
      description: 'Hadiah / Digital Gift'
    },
    { 
      id: 'buku', 
      name: 'Buku Tamu & RSVP', 
      x: 1550, 
      y: 450, 
      width: 130, 
      height: 110, 
      color: '#ddd6fe', 
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
      color: '#e0f2fe', 
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
    scroller.scrollLeft = player.x - width / 2;
    scroller.scrollTop = player.y - height / 2;
  }, [player.x, player.y]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    animFrame.current++;

    // Clear canvas
    ctx.clearRect(0, 0, worldWidth, worldHeight);

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

      // Drop shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(x - w / 2 + 5, y - h / 2 + 5, w, h);

      // Core building walls
      ctx.fillStyle = '#ffffff'; // Pristine clean walls
      ctx.fillRect(x - w / 2, y - h / 2, w, h);

      // Distinct trim based on station category
      ctx.fillStyle = b.color;
      ctx.fillRect(x - w / 2, y + h / 2 - 12, w, 12); // foundation
      ctx.fillRect(x - w / 2, y - h / 2, w, 10); // roof base trim

      // Draw elegant roof triangle
      ctx.fillStyle = '#3f3f46'; // charcoal dark shingles
      ctx.beginPath();
      ctx.moveTo(x - w / 2 - 10, y - h / 2);
      ctx.lineTo(x, y - h / 2 - 38);
      ctx.lineTo(x + w / 2 + 10, y - h / 2);
      ctx.closePath();
      ctx.fill();

      // Front door (dark mahogany wood)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 16, y + h / 2 - 40, 32, 40);
      // Brass doorknob
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(x + 10, y + h / 2 - 20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Circular station logo banner
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(x, y - 8, 22, 0, Math.PI * 2);
      ctx.fill();

      // Draw Station Icon symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.icon, x, y - 8);

      // Station Text Label sign board on top of the roof
      ctx.fillStyle = 'rgba(24, 24, 27, 0.85)';
      ctx.fillRect(x - 65, y - h / 2 - 58, 130, 22);
      
      // Border for label
      const questStatus = quests.find(q => q.targetId === b.id);
      ctx.strokeStyle = questStatus?.completed ? '#10b981' : '#f43f5e'; // Green if done, pink if open
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 65, y - h / 2 - 58, 130, 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9.5px sans-serif';
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

  }, [player, playerDir, isMoving, quests]);

  // Virtual Shadow Joystick Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent joystick triggers on UI buttons, HUD panel, or interaction buttons
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('#quest-hud-tracker') || 
      target.id === 'interact-btn-mobile'
    ) {
      return; 
    }

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setJoystick({
      active: true,
      startX: x,
      startY: y,
      curX: x,
      curY: y
    });

    joystickVector.current = { dx: 0, dy: 0, active: true };
    setIsMoving(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickVector.current.active) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const deltaX = x - joystick.startX;
    const deltaY = y - joystick.startY;
    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = 45;

    let finalX = x;
    let finalY = y;
    let normX = 0;
    let normY = 0;

    if (distance > 0) {
      normX = deltaX / distance;
      normY = deltaY / distance;

      if (distance > maxRadius) {
        finalX = joystick.startX + normX * maxRadius;
        finalY = joystick.startY + normY * maxRadius;
      }
    }

    setJoystick(prev => ({
      ...prev,
      curX: finalX,
      curY: finalY
    }));

    joystickVector.current = {
      dx: normX,
      dy: normY,
      active: true
    };
  };

  const handleTouchEnd = () => {
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      
      {/* Scrollable Viewport with Camera Centered Tracking */}
      <div 
        id="camera-scroller"
        className="flex-1 overflow-auto relative"
      >
        <div 
          className="relative"
          style={{ width: worldWidth, height: worldHeight }}
        >
          {/* Real HTML5 Game Canvas */}
          <canvas
            ref={canvasRef}
            width={worldWidth}
            height={worldHeight}
            className="absolute inset-0 block bg-emerald-900"
            id="wae-game-canvas"
          />

          {/* Prompt banner shown above player head when close to a building */}
          {activeBuildingId && (
            <div 
              className="absolute pointer-events-none z-30 animate-bounce"
              style={{
                left: player.x,
                top: player.y - 72,
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
              className="absolute cursor-pointer border border-transparent focus:outline-hidden"
              style={{
                left: b.x - b.width / 2,
                top: b.y - b.height / 2 - 30,
                width: b.width,
                height: b.height + 40,
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

      {/* Dynamic Floating Shadow Joystick (Joystick Bayangan) */}
      {joystick.active && (
        <div 
          className="absolute pointer-events-none z-50 select-none animate-fade-in"
          style={{
            left: joystick.startX - 50,
            top: joystick.startY - 50,
            width: 100,
            height: 100,
          }}
        >
          {/* Outer Ring */}
          <div className="w-full h-full rounded-full bg-black/40 border-2 border-white/50 flex items-center justify-center shadow-2xl relative backdrop-blur-[2px]">
            {/* Guide Arrows */}
            <div className="absolute top-1 text-[8px] text-white/45 font-bold">▲</div>
            <div className="absolute bottom-1 text-[8px] text-white/45 font-bold">▼</div>
            <div className="absolute left-1 text-[8px] text-white/45 font-bold">◀</div>
            <div className="absolute right-1 text-[8px] text-white/45 font-bold">▶</div>
            
            {/* Inner Draggable Knob (Joystick Bayangan) */}
            <div 
              className="absolute w-12 h-12 bg-[#6ec04a] rounded-full border-2 border-zinc-950 flex items-center justify-center shadow-lg"
              style={{
                transform: `translate(${joystick.curX - joystick.startX}px, ${joystick.curY - joystick.startY}px)`
              }}
            >
              {/* Inner core accent */}
              <div className="w-4 h-4 rounded-full bg-white/90 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Simple touch indicator overlay */}
      <div className="absolute bottom-16 left-6 z-30 pointer-events-none flex flex-col space-y-1 md:hidden">
        <div className="bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[8px] font-retro text-zinc-300 shadow-md">
          <span className="text-yellow-400">💡 HP Tip:</span> Sentuh & Seret di mana saja untuk mengaktifkan <span className="text-pink-400 font-extrabold">Joystick Bayangan</span>!
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
