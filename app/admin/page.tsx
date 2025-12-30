'use client';

import { useState, useEffect } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  deviceId: string;
  createdAt: number;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', adminKey }),
      });
      const data = await response.json();
      
      if (data.success) {
        setSongs(data.songs);
        setIsAuthenticated(true);
      } else {
        showMessage('error', data.error || 'Error de autenticación');
        setIsAuthenticated(false);
      }
    } catch (error) {
      showMessage('error', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSong = async (songId: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', songId, adminKey }),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Canción eliminada');
        loadSongs();
      } else {
        showMessage('error', data.error || 'Error al eliminar');
      }
    } catch (error) {
      showMessage('error', 'Error de conexión');
    }
  };

  const clearAll = async () => {
    if (!confirm('¿Seguro que quieres vaciar TODA la cola?')) return;
    
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', adminKey }),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Cola vaciada');
        loadSongs();
      } else {
        showMessage('error', data.error || 'Error al vaciar');
      }
    } catch (error) {
      showMessage('error', 'Error de conexión');
    }
  };

  // Auto-refresh cada 5 segundos si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadSongs, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, adminKey]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            🔐 Panel de Administración
          </h1>
          
          <div className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Clave de administrador"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onKeyDown={(e) => e.key === 'Enter' && loadSongs()}
            />
            
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'error' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              onClick={loadSongs}
              disabled={isLoading || !adminKey}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
            </button>
          </div>
          
          <p className="mt-4 text-center text-gray-500 text-sm">
            <a href="/" className="text-yellow-400 hover:underline">← Volver a la fiesta</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">
            🎛️ Panel de Administración
          </h1>
          <div className="flex gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              ← Volver
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'error' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Cola de canciones ({songs.length}/10)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={loadSongs}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
              >
                🔄 Actualizar
              </button>
              <button
                onClick={clearAll}
                disabled={songs.length === 0}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Vaciar todo
              </button>
            </div>
          </div>

          {songs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay canciones en la cola</p>
          ) : (
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-600 rounded-full text-xs text-gray-300">
                    {index + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="text-white font-medium">{song.title}</p>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {song.deviceId.slice(0, 12)}...
                  </span>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-gray-500 text-xs">
          Auto-actualización cada 5 segundos
        </p>
      </div>
    </div>
  );
}
