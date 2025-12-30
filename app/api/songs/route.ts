import { NextRequest, NextResponse } from 'next/server';
import { getSongs, addSong, getSongsByDevice, CONFIG } from '@/lib/kv-store';

// GET: Obtener todas las canciones
export async function GET() {
  const songs = await getSongs();
  return NextResponse.json({ 
    songs,
    stats: {
      total: songs.length,
      max: CONFIG.MAX_TOTAL_SONGS,
      available: CONFIG.MAX_TOTAL_SONGS - songs.length,
    }
  });
}

// POST: Añadir una canción
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artist, link, deviceId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { success: false, error: 'Identificador de dispositivo requerido' },
        { status: 400 }
      );
    }

    // Obtener info del usuario antes de añadir
    const userSongs = await getSongsByDevice(deviceId);
    
    const result = await addSong({ title, artist, link, deviceId });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          userSongsCount: userSongs.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      song: result.song,
      userSongsCount: userSongs.length + 1,
    });
  } catch (error) {
    console.error('Error adding song:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
