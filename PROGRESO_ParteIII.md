# Progreso — Proyecto final Parte III (Codificación BackEnd)

Entrega: 15/11/2026 (hoy). Equipo ChowCode: Oscar Montoya López 22450607, Alejandro Madrid Gonzáles 21450680, Grupo 8-A.
Docente: Dr. Jaime Iván López Veyna. Materia: Aseguramiento de Aplicaciones Web.

## Rúbrica
a) Portada 10 · b) 3.1 Diseño final BD + modelo E-R 10 · c) 3.2 Diagrama de secuencia api/rest 10 ·
d) 3.3 Listado de rutas 10 · e) 3.4 Parámetros de solicitud por ruta 10 ·
f) 3.5 Códigos de respuesta/error + ejemplos de peticiones 10 · g) 3.6 Codificación del BackEnd 30 · h) Fuentes 10

## Decisiones
- Documento Word acumulativo: copiar `ProyectoFinal_ParteII_Aquelarre_corta.docx`, conservar secciones 1 y 2,
  añadir sección "3. CODIFICACIÓN DEL BACKEND" (3.1–3.6) antes de FUENTES BIBLIOGRÁFICAS.
- Portada: "PROYECTO FINAL – PARTE III" / "CODIFICACIÓN – BACKEND Y AVANCES DEL FRONTEND", fecha 15 de noviembre de 2026.
- Encabezado (word/header2.xml): Documento "Análisis de Requerimientos" -> "Codificación del BackEnd", Versión 2.0 -> 3.0, fecha 04/10/2026 -> 15/11/2026.
- Editar XML del docx (unpack con python zipfile -> editar word/document.xml -> zip). Actualizar TOC y exportar PDF con Word COM (Word está instalado; no hay pandoc/LibreOffice).
- Diagramas (E-R final y secuencia): HTML/SVG -> PNG con Edge headless, mismo estilo morado que la Parte II.
- Ejemplos de peticiones: capturarlos de respuestas reales del API corriendo contra PostgreSQL en Docker.
- Herramientas auxiliares en el scratchpad de la sesión (pymupdf en pylib, dump.py, render.py) — pueden haberse borrado; se recrean fácil.

## BackEnd (`aquelarre-backend/`)
Stack: Node 20 + Express 5 + TypeScript + Prisma 6 + PostgreSQL 16 + JWT + bcryptjs + helmet + cors + express-rate-limit + express-validator.
Estado: package.json, tsconfig, .env(.example), docker-compose.yml creados; dependencias instaladas.
HECHO: BD en Docker (puerto 5434), migración init + seed, todo el código src/ escrito y compila (tsc OK).
HECHO: 51 pruebas OK (aquelarre-backend/pruebas/resultados_pruebas.txt; BD de pruebas aquelarre_pruebas). Rate limit login probado (429).
HECHO: diagramas en diagramas/ (er.png, seq_login.png, seq_apartado.png, seq_admin.png; render.sh los regenera).
HECHO: ProyectoFinal_ParteIII_Aquelarre.docx generado (python -I _build/armar_parte3.py D:/Doc-Aquelarre <carpeta_temp>), validado con el esquema OOXML.
PENDIENTE (usuario): abrir en Word, aceptar actualizar campos (índice), revisar, Guardar como PDF y entregar. Word COM no funciona desde Claude (CO_E_SERVER_EXEC_FAILURE).
Nota: quedó un WINWORD.EXE /automation oculto y el servidor tsx en el puerto 4000 corriendo; contenedor Docker aquelarre_db arriba (BD aquelarre_db y aquelarre_pruebas).
Estructura planeada: src/{config,middlewares,utils,routes,controllers,services,validators}, prisma/schema.prisma, prisma/seed.ts.
Respuesta: { ok:true, data } / error: { ok:false, error:{ codigo, mensaje, detalles? } }.

Rutas planeadas (/api):
- GET /salud
- auth: POST /auth/registro, POST /auth/login, GET /auth/perfil (JWT)
- categorias: GET /, GET /:id, POST / (ADMIN), PUT /:id (ADMIN), DELETE /:id (ADMIN, 409 si tiene productos)
- emprendedores: GET /, POST, PUT /:id, DELETE /:id (ADMIN)
- productos: GET /?categoria&q&min&max&destacado&pagina&limite&orden, GET /:id, POST, PUT /:id, DELETE /:id (baja lógica) (ADMIN)
- apartados: POST / (público, JWT opcional; valida existencias, transacción, folio AQ-000001, fecha_limite = hoy + dias_vigencia),
  GET /mis-apartados (JWT), GET /folio/:folio?telefono=, GET / (ADMIN ?estado), PATCH /:id/estado (ADMIN; transiciones; cancelar/expirar regresa existencias)
- mensajes: POST / (público), GET / (ADMIN), PATCH /:id/leido (ADMIN)
- local: GET /, PUT / (ADMIN)

## Pendiente / avisar al usuario
- "Avances del FrontEnd" aparece en el título pero no en la rúbrica; no hay código de FrontEnd. Preguntar si se agrega sección.
- main.html en la carpeta está vacío (0 KB); no se ha tocado.

## Fase 2 (16/11/2026): Avances del FrontEnd
Plan: aquelarre-frontend/ (React 19 + Vite + TS + Tailwind 3 + React Router + TanStack Query) consumiendo el API real.
Pantallas: Inicio (destacados), Catálogo (filtros/búsqueda/orden), Detalle, Carrito→Apartado, Confirmación (folio), Login/Registro, Mis apartados.
Colores de los mockups: plum #2A1D31, bruja #5D417C, rosa #FFC3B9, carmin #C82255; fuentes Cinzel (display) + Poppins.
Luego: capturas con Edge headless -> sección "3.7 Avances del FrontEnd" en _build/armar_parte3.py -> regenerar docx.
HECHO (16/11): aquelarre-frontend completo para el flujo del cliente (tsc + build OK), capturas en diagramas/frontend/ (script _build/capturas_frontend.js con playwright-core + Edge),
sección 3.7 agregada al docx (validado). BD de demo: aquelarre_demo; API demo en puerto 4001 y Vite en 5173 corriendo.
PENDIENTE (usuario): abrir el docx en Word -> "Sí" a actualizar campos -> revisar -> Guardar como PDF -> entregar.

## 16/11 revisión final
Documento revisado contra la rúbrica: completo (portada, 3.1–3.7, fuentes 1–21). Word COM sigue fallando (cuelga en New-Object, también desde la terminal). El usuario decidió guardar el PDF él mismo desde Word.
