# Aquelarre Showroom — Proyecto final (Aseguramiento de Aplicaciones Web)

Tienda en línea para **Aquelarre Showroom**, un bazar de emprendedores zacatecanos (Av. Preparatoria 208, Col. Hidráulica).
Los clientes ven el catálogo, **apartan** productos en línea y los **recogen y pagan en el local** (no hay pagos en línea ni envíos).

**Equipo ChowCode · Grupo 8-A** — Oscar Montoya López, Alejandro Madrid Gonzáles
**Docente:** Dr. Jaime Iván López Veyna · Instituto Tecnológico de Zacatecas

---

## ¿Qué hay en este repositorio?

| Carpeta / archivo | Contenido |
|---|---|
| `ProyectoFinal_ParteIII_Aquelarre.docx` | **Entrega actual (Parte III)**: codificación del BackEnd y avances del FrontEnd. Incluye las secciones 1 y 2 de entregas anteriores. |
| `ProyectoFinal_ParteII_Aquelarre_corta.docx` / `.pdf` | Entrega anterior (Parte II): requerimientos, base de datos, mockups y arquitectura. Es la plantilla de formato. |
| `aquelarre-backend/` | API REST: Node.js 20 · Express 5 · TypeScript · Prisma 6 · PostgreSQL 16 · JWT |
| `aquelarre-frontend/` | SPA: React 19 · Vite 6 · TypeScript · Tailwind 3 · React Router 7 · TanStack Query 5 |
| `diagramas/` | Fuentes HTML/SVG y PNG del modelo E-R, diagramas de secuencia y capturas del FrontEnd |
| `_build/` | Scripts que arman el Word de la Parte III a partir del de la Parte II, y que toman las capturas |
| `PROGRESO_ParteIII.md` | Bitácora de lo que se hizo, decisiones y pendientes |

## Rúbrica de la Parte III y dónde está cada punto

| Punto | Sección del documento | Código |
|---|---|---|
| a) Portada | Portada | — |
| b) 3.1 Diseño final de la BD + modelo E-R | 3.1 | `aquelarre-backend/prisma/schema.prisma`, `diagramas/er.png` |
| c) 3.2 Diagramas de secuencia | 3.2 | `diagramas/seq_*.png` |
| d) 3.3 Listado de rutas | 3.3 (28 rutas) | `aquelarre-backend/src/routes/index.ts` |
| e) 3.4 Parámetros por ruta | 3.4 | `aquelarre-backend/src/validators/` |
| f) 3.5 Códigos de respuesta y ejemplos | 3.5 (12 ejemplos reales) | `aquelarre-backend/pruebas/` |
| g) 3.6 Codificación del BackEnd | 3.6 (11 listados) | `aquelarre-backend/src/` |
| h) Fuentes bibliográficas | Fuentes (21 referencias) | — |
| Avances del FrontEnd (título) | 3.7 | `aquelarre-frontend/src/` |

## Pendiente para entregar el Word

1. Abrir `ProyectoFinal_ParteIII_Aquelarre.docx` en Word y responder **Sí** a "¿Actualizar los campos?" (así se llenan los números de página del índice; si no, salen en 0).
2. Revisarlo completo (imágenes y tablas).
3. *Archivo → Guardar como → PDF* y subir a Classroom.

## Cómo correr el proyecto

Requisitos: Node.js 20+, Docker Desktop.

```bash
# 1) BackEnd
cd aquelarre-backend
cp .env.example .env
docker compose up -d          # PostgreSQL 16 en el puerto 5434
npm install
npx prisma migrate dev        # crea las 8 tablas
npm run db:seed               # admin@aquelarre.mx / Admin123* + categorías y productos de ejemplo
npm run dev                   # http://localhost:4000/api

# 2) FrontEnd (otra terminal)
cd aquelarre-frontend
npm install
npm run dev                   # http://localhost:5173 (redirige /api al puerto 4000)
```

Pruebas del API (51 peticiones con curl): `bash aquelarre-backend/pruebas/pruebas_api.sh resultados.txt`
(conviene correrlas sobre una base de datos limpia, porque crean y modifican registros).

> Las credenciales del seed y el `JWT_SECRET` de `.env.example` son solo para desarrollo local; en producción (Render + Neon) se deben cambiar.

## Estado actual

**BackEnd — terminado para esta entrega**
- 28 rutas: auth, categorías, emprendedores, productos, apartados, mensajes y local.
- Seguridad: bcrypt, JWT (8 h), roles CLIENTE/ADMIN, helmet, CORS, rate limit (10 intentos de login / 15 min), validación con express-validator + `matchedData`, consultas parametrizadas de Prisma.
- Apartados en transacción con descuento condicional de existencias, folio `AQ-000001`, fecha límite según `dias_vigencia_apartado`, transiciones de estado controladas (cancelar/expirar regresa las existencias).
- Formato uniforme: `{ ok: true, data, meta? }` / `{ ok: false, error: { codigo, mensaje, detalles? } }`.

**FrontEnd — flujo del cliente terminado**
- Inicio, catálogo (filtros/búsqueda/orden/paginación), detalle, carrito → apartado, confirmación con folio, login/registro, mis apartados. Responsivo.

**Siguiente entrega (pendiente)**
- FrontEnd: página de ubicación y contacto, panel de administración (CRUD de productos/categorías/emprendedores, gestión de apartados y mensajes).
- Subida de imágenes a Cloudinary (hoy se muestra un ícono por categoría).
- Despliegue en Render (API + sitio estático) y Neon (PostgreSQL).

## Regenerar el documento o los diagramas

- Diagramas: `bash diagramas/render.sh diagramas/er.html diagramas/er.png <carpeta con pymupdf>` (usa Edge en modo headless).
- Word: `python -I _build/armar_parte3.py <ruta de esta carpeta> <carpeta temporal>` → genera `ParteIII_sin_actualizar.docx` en la carpeta temporal. El contenido de la sección 3 está en `_build/contenido.py`.
