import { NextRequest } from 'next/server';
import { getSongs, subscribe, Song } from '@/lib/store';

// Server-Sent Events para actualizaciones en tiempo real
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Enviar estado inicial
      const initialData = JSON.stringify({ songs: getSongs() });
      controller.enqueue(encoder.encode(`data: ${initialData}\n\n`));
      
      // Suscribirse a cambios
      const unsubscribe = subscribe((songs: Song[]) => {
        try {
          const data = JSON.stringify({ songs });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (e) {
          // El cliente probablemente se desconectó
          unsubscribe();
        }
      });

      // Heartbeat cada 30 segundos para mantener la conexión
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 30000);

      // Cleanup cuando el cliente se desconecta
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch (e) {
          // Ya cerrado
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Para nginx
    },
  });
}
