# Aquelarre Showroom — BackEnd (API REST)

Node.js 20 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · JWT

## Ejecutar en local
```bash
cp .env.example .env
docker compose up -d          # PostgreSQL 16 en el puerto 5434
npm install
npx prisma migrate dev        # crea las 8 tablas
npm run db:seed               # admin@aquelarre.mx / Admin123*, categorías y productos de ejemplo
npm run dev                   # http://localhost:4000/api
```

## Estructura
```
src/
  server.ts         arranque del servidor
  app.ts            helmet, cors, json, rate limit, rutas y errores
  config/           variables de entorno y Prisma Client
  routes/           definición de rutas /api
  middlewares/      JWT, roles, validación y manejo de errores
  validators/       reglas de express-validator por recurso
  controllers/      reciben la petición y arman la respuesta
  services/         reglas de negocio y acceso a datos (Prisma)
  utils/            ApiError, formato de respuesta y folio
prisma/schema.prisma  modelo de datos (8 tablas)
pruebas/            script de pruebas con curl y resultados
```
