'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  type: 'circle' | 'square' | 'star';
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      '#FFD700', // Oro
      '#FFA500', // Naranja
      '#FF6B6B', // Rosa
      '#4ECDC4', // Turquesa
      '#FFFFFF', // Blanco
      '#FFE66D', // Amarillo
      '#C9B037', // Oro oscuro
    ];

    const types: ('circle' | 'square' | 'star')[] = ['circle', 'square', 'star'];

    const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      type: types[Math.floor(Math.random() * types.length)],
    }));

    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            top: '-20px',
          }}
        >
          {piece.type === 'circle' && (
            <div
              className="rounded-full opacity-80"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size}px ${piece.color}`,
              }}
            />
          )}
          {piece.type === 'square' && (
            <div
              className="opacity-80 rotate-45"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
              }}
            />
          )}
          {piece.type === 'star' && (
            <div
              className="opacity-80"
              style={{
                color: piece.color,
                fontSize: piece.size * 1.5,
                textShadow: `0 0 ${piece.size}px ${piece.color}`,
              }}
            >
              ✦
            </div>
          )}
        </div>
      ))}
      
      {/* Destellos flotantes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-sparkle opacity-60" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle opacity-60" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}
