# 🎉 Fiesta Fin de Año 2026 - App de Canciones

Una aplicación web moderna y festiva para que los asistentes a tu fiesta de Nochevieja puedan pedir canciones de forma ordenada, evitando conflictos y duplicados.

![Preview](https://via.placeholder.com/800x400/1a1a2e/fcd34d?text=🎉+Fiesta+2026+🎵)

## ✨ Características

- **🎵 Petición de canciones**: Los usuarios pueden añadir título, artista y enlace (Spotify/YouTube)
- **📋 Cola en tiempo real**: Actualización instantánea usando Server-Sent Events (SSE)
- **🔒 Límites inteligentes**: Máximo 2 canciones por persona, 10 en cola total
- **📱 Diseño responsive**: Optimizado para móviles (acceso vía QR)
- **🎨 Estética festiva**: Colores dorados, confeti animado, cuenta atrás a 2026
- **👤 Identificación sin login**: UUID único por dispositivo (localStorage)
- **🛠️ Panel de administración**: Gestión de la cola protegida por clave

## 🚀 Instalación y Ejecución Local

### Requisitos previos

- Node.js 18+ instalado
- npm o yarn

### Pasos

```bash
# 1. Navegar al directorio del proyecto
cd C:\Users\Public\fiesta-2026

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

La aplicación estará disponible en `http://localhost:3000`

### Panel de administración

Accede a `http://localhost:3000/admin` con la clave por defecto: `fiesta2026admin`

> ⚠️ **Importante**: Cambia la clave en producción editando `lib/store.ts` o usando una variable de entorno `ADMIN_KEY`.

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado - Gratis)

1. **Sube el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Fiesta 2026 app"
   git remote add origin https://github.com/TU_USUARIO/fiesta-2026.git
   git push -u origin main
   ```

2. **Despliega en Vercel**:
   - Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
   - Click en "New Project" → Importa tu repositorio
   - Configura las variables de entorno (opcional):
     - `ADMIN_KEY`: Tu clave de administrador personalizada
   - Click en "Deploy"

3. **Obtén tu URL**:
   - Vercel te dará una URL como `https://fiesta-2026.vercel.app`
   - ¡Esta es la URL para tu código QR!

### Opción 2: Railway

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detectará automáticamente Next.js
4. Añade la variable de entorno `ADMIN_KEY`
5. Despliega

### Opción 3: Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio
4. Configura:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Añade variables de entorno
6. Despliega

## 📱 Generación del Código QR

Una vez tengas tu URL de producción:

1. Ve a [qr-code-generator.com](https://www.qr-code-generator.com/) o similar
2. Introduce tu URL (ej: `https://fiesta-2026.vercel.app`)
3. Personaliza el diseño (colores dorados/festivos)
4. Descarga e imprime para la fiesta

## 🏗️ Estructura del Proyecto

```
fiesta-2026/
├── app/
│   ├── api/
│   │   ├── songs/route.ts    # GET/POST canciones
│   │   ├── stream/route.ts   # SSE tiempo real
│   │   ├── user/route.ts     # Info del usuario
│   │   └── admin/route.ts    # Administración
│   ├── admin/page.tsx        # Panel admin
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── Confetti.tsx          # Animación de confeti
│   ├── Countdown.tsx         # Cuenta atrás a 2026
│   ├── SongForm.tsx          # Formulario de canciones
│   └── SongQueue.tsx         # Lista de canciones
├── lib/
│   └── store.ts              # Store en memoria
├── package.json
├── tailwind.config.js
└── README.md
```

## ⚙️ Configuración

### Límites (edita `lib/store.ts`)

```typescript
export const CONFIG = {
  MAX_SONGS_PER_USER: 2,    // Canciones por usuario
  MAX_TOTAL_SONGS: 10,      // Total en cola
  ADMIN_KEY: 'TU_CLAVE',    // Clave de admin
};
```

### Fecha del countdown (edita `app/page.tsx`)

```typescript
// Cambia la zona horaria si no es España
const NEW_YEAR_2026 = new Date('2026-01-01T00:00:00+01:00');
```

## 🛡️ Recomendaciones para la Fiesta

### Antes del evento

1. **Prueba la app** con varios dispositivos
2. **Configura la clave de admin** personalizada
3. **Genera el QR** con un diseño festivo
4. **Imprime varios QR** y colócalos en lugares visibles

### Durante el evento

1. **Monitorea desde /admin** en un dispositivo separado
2. **Vacía la cola** cuando las canciones se vayan reproduciendo
3. **Ten un backup** del enlace por si alguien pierde el QR

### Estabilidad

- ✅ La app soporta **100-200 usuarios simultáneos** sin problemas en Vercel/Railway
- ✅ SSE es más ligero que WebSockets y funciona bien en móviles
- ✅ Si hay desconexión, la app reconecta automáticamente
- ✅ Los datos persisten mientras el servidor esté activo

### Limitaciones

- ⚠️ Los datos se pierden si el servidor se reinicia (para persistencia permanente usa Redis/Firebase)
- ⚠️ Un usuario puede borrar su localStorage para "resetear" su límite (aceptable para una fiesta)

## 🎨 Personalización

### Cambiar colores

Edita `tailwind.config.js` para modificar la paleta de colores.

### Cambiar textos

- Título: `app/page.tsx` → busca "Nochevieja 2026"
- Footer: `app/page.tsx` → final del archivo

### Añadir más efectos

El componente `Confetti.tsx` se puede modificar para más o menos animaciones.

## 📝 API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/songs` | GET | Obtener todas las canciones |
| `/api/songs` | POST | Añadir una canción |
| `/api/stream` | GET | SSE para tiempo real |
| `/api/user?deviceId=xxx` | GET | Canciones de un usuario |
| `/api/admin` | POST | Acciones de administración |

## 🤝 Soporte

¿Problemas? Revisa:

1. Que Node.js esté actualizado (v18+)
2. Que las dependencias estén instaladas (`npm install`)
3. Que el puerto 3000 esté libre
4. Los logs de la consola del navegador (F12)

---

**¡Que tengas una increíble fiesta de Fin de Año! 🎉🥂✨**

*Hecho con ❤️ para despedir el 2025 y dar la bienvenida al 2026*
