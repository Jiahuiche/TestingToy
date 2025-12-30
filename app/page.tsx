'use client';

import { useEffect, useState, useCallback } from 'react';
import Countdown from '@/components/Countdown';
import Confetti from '@/components/Confetti';
import SongForm from '@/components/SongForm';
import SongQueue from '@/components/SongQueue';

interface Song {
  id: string;
  title: string;
  artist: string;
  link?: string;
  deviceId: string;
  createdAt: number;
}

const MAX_USER_SONGS = 2;
const MAX_TOTAL_SONGS = 10;

// Fecha objetivo: 1 de enero de 2026 a las 00:00:00 hora de España
const NEW_YEAR_2026 = new Date('2026-01-01T00:00:00+01:00');

export default function Home() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [userSongsCount, setUserSongsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Generar o recuperar ID único del dispositivo
  useEffect(() => {
    const storedId = localStorage.getItem('fiesta2026_deviceId');
    if (storedId) {
      setDeviceId(storedId);
    } else {
      const newId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('fiesta2026_deviceId', newId);
      setDeviceId(newId);
    }
  }, []);

  // Cargar canciones del usuario
  const loadUserSongs = useCallback(async () => {
    if (!deviceId) return;
    
    try {
      const response = await fetch(`/api/user?deviceId=${deviceId}`);
      const data = await response.json();
      if (data.success) {
        setUserSongsCount(data.count);
      }
    } catch (error) {
      console.error('Error loading user songs:', error);
    }
  }, [deviceId]);

  // Conectar a SSE para actualizaciones en tiempo real
  useEffect(() => {
    if (!deviceId) return;

    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      setConnectionStatus('connecting');
      eventSource = new EventSource('/api/stream');

      eventSource.onopen = () => {
        setConnectionStatus('connected');
        setIsLoading(false);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.songs) {
            setSongs(data.songs);
            // Actualizar conteo de canciones del usuario
            const userSongs = data.songs.filter((s: Song) => s.deviceId === deviceId);
            setUserSongsCount(userSongs.length);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = () => {
        setConnectionStatus('disconnected');
        eventSource.close();
        // Reconectar después de 3 segundos
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();
    loadUserSongs();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [deviceId, loadUserSongs]);

  const handleSongAdded = (song: Song) => {
    // La actualización real vendrá por SSE, pero actualizamos localmente para feedback inmediato
    setUserSongsCount(prev => prev + 1);
  };

  return (
    <main className="min-h-screen relative">
      {/* Confeti de fondo */}
      <Confetti />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header festivo */}
        <header className="text-center mb-8">
          <div className="inline-block animate-float">
            <h1 className="text-4xl md:text-6xl font-extrabold text-shimmer mb-2">
              ✨ Nochevieja 2026 ✨
            </h1>
          </div>
          <p className="text-lg md:text-xl text-yellow-200/80 mt-2">
            ¡Pide tu canción favorita! 🎶
          </p>

          {/* Cuenta atrás */}
          <div className="mt-6">
            <Countdown targetDate={NEW_YEAR_2026} />
          </div>

          {/* Indicador de conexión */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className={`${
              connectionStatus === 'connected'
                ? 'text-green-400'
                : connectionStatus === 'connecting'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {connectionStatus === 'connected'
                ? 'Conectado'
                : connectionStatus === 'connecting'
                ? 'Conectando...'
                : 'Reconectando...'}
            </span>
          </div>
        </header>

        {/* Grid de contenido */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulario para añadir canciones */}
          <div className="order-1">
            <SongForm
              deviceId={deviceId}
              userSongsCount={userSongsCount}
              totalSongs={songs.length}
              maxUserSongs={MAX_USER_SONGS}
              maxTotalSongs={MAX_TOTAL_SONGS}
              onSongAdded={handleSongAdded}
            />
          </div>

          {/* Cola de canciones */}
          <div className="order-2">
            <SongQueue
              songs={songs}
              currentDeviceId={deviceId}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Hecho con ❤️ para la fiesta de Fin de Año en Nou Wok 2025-2026
          </p>
          <p className="mt-1 text-xs">
            Máximo 2 canciones por persona • Cola de hasta 10 canciones
          </p>
        </footer>
      </div>
    </main>
  );
}
