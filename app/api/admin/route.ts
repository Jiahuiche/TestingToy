import { NextRequest, NextResponse } from 'next/server';
import { removeSong, clearAllSongs, getSongs, CONFIG } from '@/lib/store';

// Endpoint de administración protegido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, songId, adminKey } = body;

    // Verificar clave de admin
    if (adminKey !== CONFIG.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: 'Clave de administrador incorrecta' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'remove':
        if (!songId) {
          return NextResponse.json(
            { success: false, error: 'ID de canción requerido' },
            { status: 400 }
          );
        }
        const removed = removeSong(songId);
        return NextResponse.json({ 
          success: removed, 
          message: removed ? 'Canción eliminada' : 'Canción no encontrada' 
        });

      case 'clear':
        clearAllSongs();
        return NextResponse.json({ 
          success: true, 
          message: 'Cola vaciada completamente' 
        });

      case 'list':
        return NextResponse.json({ 
          success: true, 
          songs: getSongs() 
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
