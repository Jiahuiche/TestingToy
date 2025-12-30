import { kv } from '@vercel/kv';

export interface Song {
  id: string;
  title: string;
  artist: string;
  link?: string;
  deviceId: string;
  createdAt: number;
}

// Configuración
export const CONFIG = {
  MAX_SONGS_PER_USER: 2,
  MAX_TOTAL_SONGS: 10,
  ADMIN_KEY: process.env.ADMIN_KEY || 'fiesta2026admin',
};

const SONGS_KEY = 'fiesta2026:songs';

// Obtener todas las canciones
export async function getSongs(): Promise<Song[]> {
  try {
    const songs = await kv.get<Song[]>(SONGS_KEY);
    return songs || [];
  } catch (error) {
    console.error('Error getting songs from KV:', error);
    return [];
  }
}

// Obtener canciones de un dispositivo específico
export async function getSongsByDevice(deviceId: string): Promise<Song[]> {
  const songs = await getSongs();
  return songs.filter(song => song.deviceId === deviceId);
}

// Añadir una canción
export async function addSong(song: Omit<Song, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string; song?: Song }> {
  // Validar campos
  if (!song.title?.trim() || !song.artist?.trim()) {
    return { success: false, error: 'El título y artista son obligatorios' };
  }

  const songs = await getSongs();

  // Verificar límite total
  if (songs.length >= CONFIG.MAX_TOTAL_SONGS) {
    return { success: false, error: 'La cola está completa, inténtalo más tarde' };
  }

  // Verificar límite por usuario
  const userSongs = songs.filter(s => s.deviceId === song.deviceId);
  if (userSongs.length >= CONFIG.MAX_SONGS_PER_USER) {
    return { success: false, error: 'Has alcanzado el máximo de 2 canciones' };
  }

  // Verificar duplicados
  const duplicate = songs.find(
    s => s.title.toLowerCase() === song.title.toLowerCase() && 
         s.artist.toLowerCase() === song.artist.toLowerCase()
  );
  if (duplicate) {
    return { success: false, error: 'Esta canción ya está en la cola' };
  }

  const newSong: Song = {
    ...song,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: song.title.trim(),
    artist: song.artist.trim(),
    link: song.link?.trim() || undefined,
    createdAt: Date.now(),
  };

  songs.push(newSong);
  
  try {
    await kv.set(SONGS_KEY, songs);
    return { success: true, song: newSong };
  } catch (error) {
    console.error('Error saving song to KV:', error);
    return { success: false, error: 'Error al guardar la canción' };
  }
}

// Eliminar una canción
export async function removeSong(songId: string): Promise<boolean> {
  const songs = await getSongs();
  const index = songs.findIndex(s => s.id === songId);
  
  if (index !== -1) {
    songs.splice(index, 1);
    try {
      await kv.set(SONGS_KEY, songs);
      return true;
    } catch (error) {
      console.error('Error removing song from KV:', error);
      return false;
    }
  }
  return false;
}

// Limpiar todas las canciones
export async function clearAllSongs(): Promise<void> {
  try {
    await kv.set(SONGS_KEY, []);
  } catch (error) {
    console.error('Error clearing songs from KV:', error);
  }
}

// Estadísticas
export async function getStats(): Promise<{ totalSongs: number; maxSongs: number }> {
  const songs = await getSongs();
  return {
    totalSongs: songs.length,
    maxSongs: CONFIG.MAX_TOTAL_SONGS,
  };
}
