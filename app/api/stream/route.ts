import { NextResponse } from 'next/server';
import { getSongs, CONFIG } from '@/lib/kv-store';

// Endpoint de polling para obtener el estado actual de la cola
// Se llama cada 2-3 segundos desde el cliente
export async function GET() {
  const songs = await getSongs();
  
  return NextResponse.json({
    songs,
    stats: {
      total: songs.length,
      max: CONFIG.MAX_TOTAL_SONGS,
      available: CONFIG.MAX_TOTAL_SONGS - songs.length,
    },
    timestamp: Date.now(),
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
