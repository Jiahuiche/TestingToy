// Store en memoria para las canciones
// En producción podrías usar Redis, Firebase, o una base de datos

export interface Song {
  id: string;
  title: string;
  artist: string;
  link?: string;
  deviceId: string;
  createdAt: number;
}

interface Store {
  songs: Song[];
  listeners: Set<(songs: Song[]) => void>;
}

// Configuración
export const CONFIG = {
  MAX_SONGS_PER_USER: 2,
  MAX_TOTAL_SONGS: 10,
  ADMIN_KEY: process.env.ADMIN_KEY || 'fiesta2026admin', // Cambia esto en producción
};

// Store global (persiste mientras el servidor esté corriendo)
const globalStore: Store = {
  songs: [],
  listeners: new Set(),
};

// Para persistencia entre reinicios en desarrollo
if (typeof global !== 'undefined') {
  (global as any).__songStore = (global as any).__songStore || globalStore;
}

const store: Store = typeof global !== 'undefined' 
  ? (global as any).__songStore 
  : globalStore;

export function getSongs(): Song[] {
  return [...store.songs];
}

export function getSongsByDevice(deviceId: string): Song[] {
  return store.songs.filter(song => song.deviceId === deviceId);
}

export function addSong(song: Omit<Song, 'id' | 'createdAt'>): { success: boolean; error?: string; song?: Song } {
  // Validar campos
  if (!song.title?.trim() || !song.artist?.trim()) {
    return { success: false, error: 'El título y artista son obligatorios' };
  }

  // Verificar límite total
  if (store.songs.length >= CONFIG.MAX_TOTAL_SONGS) {
    return { success: false, error: 'La cola está completa, inténtalo más tarde' };
  }

  // Verificar límite por usuario
  const userSongs = getSongsByDevice(song.deviceId);
  if (userSongs.length >= CONFIG.MAX_SONGS_PER_USER) {
    return { success: false, error: 'Has alcanzado el máximo de 2 canciones' };
  }

  // Verificar duplicados (opcional: avisar pero permitir)
  const duplicate = store.songs.find(
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

  store.songs.push(newSong);
  notifyListeners();
  
  return { success: true, song: newSong };
}

export function removeSong(songId: string): boolean {
  const index = store.songs.findIndex(s => s.id === songId);
  if (index !== -1) {
    store.songs.splice(index, 1);
    notifyListeners();
    return true;
  }
  return false;
}

export function clearAllSongs(): void {
  store.songs = [];
  notifyListeners();
}

// Sistema de listeners para SSE
export function subscribe(listener: (songs: Song[]) => void): () => void {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

function notifyListeners(): void {
  const songs = getSongs();
  store.listeners.forEach(listener => {
    try {
      listener(songs);
    } catch (e) {
      console.error('Error notifying listener:', e);
    }
  });
}

export function getStats() {
  return {
    totalSongs: store.songs.length,
    maxSongs: CONFIG.MAX_TOTAL_SONGS,
    listeners: store.listeners.size,
  };
}
