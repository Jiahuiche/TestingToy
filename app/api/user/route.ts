import { NextRequest, NextResponse } from 'next/server';
import { getSongsByDevice } from '@/lib/store';

// GET: Obtener canciones de un dispositivo específico
export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('deviceId');
  
  if (!deviceId) {
    return NextResponse.json(
      { success: false, error: 'deviceId requerido' },
      { status: 400 }
    );
  }

  const songs = getSongsByDevice(deviceId);
  return NextResponse.json({ 
    success: true,
    songs,
    count: songs.length,
    remaining: 2 - songs.length,
  });
}
