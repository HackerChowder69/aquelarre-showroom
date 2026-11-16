# Aquelarre Showroom — FrontEnd

React 19 · Vite 6 · TypeScript · Tailwind CSS 3 · React Router 7 · TanStack Query 5

```bash
npm install
npm run dev     # http://localhost:5173 — /api se redirige al BackEnd en http://localhost:4000
npm run build   # tsc + vite build -> dist/
```

Para apuntar a otra instancia del API en desarrollo: `API_PROXY=http://localhost:4001 npm run dev`.
En producción se define `VITE_API_URL` con la URL pública del BackEnd.

Pantallas terminadas: inicio, catálogo, detalle, carrito/apartado, confirmación, login/registro, mis apartados.
Pendientes: ubicación y contacto, panel de administración.
