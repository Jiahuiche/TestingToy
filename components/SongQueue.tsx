'use client';

interface Song {
  id: string;
  title: string;
  artist: string;
  link?: string;
  deviceId: string;
  createdAt: number;
}

interface SongQueueProps {
  songs: Song[];
  currentDeviceId: string;
  isLoading: boolean;
}

export default function SongQueue({ songs, currentDeviceId, isLoading }: SongQueueProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSpotifyLink = (link?: string) => link?.includes('spotify.com');
  const isYouTubeLink = (link?: string) => link?.includes('youtube.com') || link?.includes('youtu.be');

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 shadow-xl shadow-purple-500/10">
      <h2 className="text-xl md:text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
        <span>📋</span> Cola de canciones
        <span className="ml-auto text-sm font-normal text-purple-300/70">
          {songs.length}/10
        </span>
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg className="animate-spin h-8 w-8 mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Cargando canciones...</span>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">🎵</div>
          <p>No hay canciones en la cola</p>
          <p className="text-sm text-gray-500 mt-1">¡Sé el primero en añadir una!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {songs.map((song, index) => {
            const isOwnSong = song.deviceId === currentDeviceId;
            
            return (
              <div
                key={song.id}
                className={`relative flex items-start gap-3 p-4 rounded-xl transition-all ${
                  isOwnSong
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-gray-800/50 border border-gray-700/50'
                }`}
              >
                {/* Número de posición */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {index + 1}
                </div>

                {/* Info de la canción */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">
                      {song.title}
                    </h3>
                    {isOwnSong && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                        Tuya
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    {song.artist}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(song.createdAt)}
                    </span>
                    {song.link && (
                      <a
                        href={song.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                          isSpotifyLink(song.link)
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : isYouTubeLink(song.link)
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        {isSpotifyLink(song.link) ? '🎧 Spotify' : isYouTubeLink(song.link) ? '▶️ YouTube' : '🔗 Enlace'}
                      </a>
                    )}
                  </div>
                </div>

                {/* Indicador de primera canción */}
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full animate-pulse">
                    ▶ SONANDO
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Indicador de actualización en tiempo real */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Actualización en tiempo real
      </div>
    </div>
  );
}
