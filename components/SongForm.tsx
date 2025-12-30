'use client';

import { useState } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  link?: string;
  deviceId: string;
  createdAt: number;
}

interface SongFormProps {
  deviceId: string;
  userSongsCount: number;
  totalSongs: number;
  maxUserSongs: number;
  maxTotalSongs: number;
  onSongAdded: (song: Song) => void;
}

export default function SongForm({
  deviceId,
  userSongsCount,
  totalSongs,
  maxUserSongs,
  maxTotalSongs,
  onSongAdded,
}: SongFormProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canAddSong = userSongsCount < maxUserSongs && totalSongs < maxTotalSongs;
  const userLimitReached = userSongsCount >= maxUserSongs;
  const queueFull = totalSongs >= maxTotalSongs;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !artist.trim()) {
      setError('Por favor, introduce el título y el artista');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, link, deviceId }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Error al añadir la canción');
        return;
      }

      setSuccess('¡Canción añadida! 🎉');
      setTitle('');
      setArtist('');
      setLink('');
      onSongAdded(data.song);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/20 shadow-xl shadow-yellow-500/10">
      <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
        <span>🎵</span> Pide tu canción
      </h2>

      {/* Estado del usuario */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
          Tus canciones: {userSongsCount}/{maxUserSongs}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Cola: {totalSongs}/{maxTotalSongs}
        </span>
      </div>

      {/* Mensajes de límite */}
      {queueFull && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
          ⚠️ La cola está completa, inténtalo más tarde
        </div>
      )}

      {userLimitReached && !queueFull && (
        <div className="mb-4 p-3 bg-orange-500/20 border border-orange-500/40 rounded-lg text-orange-300 text-sm">
          ⚠️ Has alcanzado el máximo de 2 canciones
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Título de la canción *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canAddSong || isSubmitting}
            placeholder="Ej: Blinding Lights"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
            Artista *
          </label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            disabled={!canAddSong || isSubmitting}
            placeholder="Ej: The Weeknd"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
            Enlace (Spotify/YouTube) <span className="text-gray-500">- opcional</span>
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={!canAddSong || isSubmitting}
            placeholder="https://open.spotify.com/track/..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm animate-pulse">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 text-sm">
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={!canAddSong || isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold rounded-lg shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Añadiendo...
            </span>
          ) : (
            '🎶 Añadir a la cola'
          )}
        </button>
      </form>
    </div>
  );
}
