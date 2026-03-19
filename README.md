# Koenigsegg CC850 Experience

Landing inmersiva construida con **Next.js 16 + React 19 + Tailwind CSS v4**.
El proyecto combina narrativa visual, secuencias de frames por scroll y bloques editoriales de alto contraste para presentar el universo CC850.

## Características

- Experiencia single-page con secciones narrativas (`hero`, `heritage`, `invention`, `engineering`, `precision`, `chamber`, `specs`, `finality`).
- Navegación sticky con barra de progreso de scroll.
- Animaciones de aparición con `IntersectionObserver`.
- Secciones de secuencia en canvas sincronizadas al scroll.
- Diseño responsive (desktop + mobile).
- Tipografía con `next/font` (Playfair Display).

## Optimización de imágenes (carga procedural)

Las secuencias de frames **no** se cargan todas de una vez.

En `ScrollSequence` y `DetailScroll` se implementó:

- Carga inicial rápida del primer frame.
- Carga por ventana alrededor del frame objetivo (ahead/behind) durante el scroll.
- `requestAnimationFrame` para render desacoplado del evento de scroll.
- `IntersectionObserver` para pausar trabajo cuando la sección está fuera de viewport cercano.
- Fallback al frame cargado más cercano si el frame exacto aún no está disponible.
- Evicción de frames lejanos para controlar uso de memoria.

Resultado: mejor tiempo de arranque, menos picos de red y menor presión de memoria.

## Stack

- `next@16.2.0`
- `react@19.2.4`
- `tailwindcss@4`
- `typescript@5`

## Requisitos

- Node.js 20+
- npm 10+ (o Bun, opcional)

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev        # Desarrollo (webpack)
npm run dev:turbo  # Desarrollo (turbopack)
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # Lint (ver nota abajo)
```

### Nota sobre lint en Next 16

En este proyecto, `npm run lint` apunta a `next lint`, pero en Next 16 ese flujo puede requerir ajuste.
Si falla, usa ESLint directamente o actualiza el script de lint según tu setup.

## Estructura del proyecto

```text
app/
  globals.css
  layout.tsx
  page.tsx

components/
  Navbar.tsx
  ScrollRevealObserver.tsx
  ScrollSequence.tsx
  DetailScroll.tsx
  VideoScroll.tsx

public/
  frames/
    video1/
    video2/
  images/
  koenigsegg-logo.svg
```

## Arquitectura rápida

- `app/page.tsx`
  Página principal y composición de secciones.

- `components/ScrollSequence.tsx`
  Hero en canvas con secuencia de frames (`/public/frames/video1`) y títulos sincronizados.

- `components/DetailScroll.tsx`
  Segunda secuencia de frames (`/public/frames/video2`) con títulos dinámicos.

- `components/ScrollRevealObserver.tsx`
  Observer global para activar transiciones al entrar en viewport.

- `components/Navbar.tsx`
  Navegación fija, progreso de scroll y CTA.

## Assets de frames

Las secuencias esperan naming con padding de 4 dígitos:

- `frame_0001.png`, `frame_0002.png`, ...

Ajusta estos valores en los componentes si cambias estructura:

- `PATH`
- `startFrame`
- `endFrame`
- constantes de carga (`LOAD_AHEAD`, `LOAD_BEHIND`, `MAX_CACHE_DISTANCE`)

## Buenas prácticas para mantener rendimiento

- Mantener peso de PNGs bajo control (idealmente optimizados).
- Evitar subir resolución de frames más allá de lo necesario para pantalla objetivo.
- Afinar `LOAD_AHEAD`/`LOAD_BEHIND` según red y dispositivo.
- Revisar `MAX_CACHE_DISTANCE` si observas consumo alto de memoria.

## Deploy

Flujo estándar de Next.js:

```bash
npm run build
npm run start
```

Compatible con plataformas como Vercel o infraestructura Node propia.

## Estado del proyecto

Build de producción verificada correctamente con `npm run build`.
