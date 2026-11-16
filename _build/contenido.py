# Contenido textual de la sección 3 (Parte III) — se importa desde armar_parte3.py

RUTAS = [
    ("GET", "/api/salud", "Verifica que el API esté en línea", "Público"),
    ("POST", "/api/auth/registro", "Crea una cuenta de cliente y devuelve su token", "Público"),
    ("POST", "/api/auth/login", "Inicia sesión y devuelve el token JWT", "Público"),
    ("GET", "/api/auth/perfil", "Datos del usuario que inició sesión", "Cliente / Admin"),
    ("GET", "/api/categorias", "Lista las categorías activas con su número de productos", "Público"),
    ("GET", "/api/categorias/:id", "Obtiene una categoría", "Público"),
    ("POST", "/api/categorias", "Crea una categoría (genera el slug)", "Admin"),
    ("PUT", "/api/categorias/:id", "Modifica una categoría", "Admin"),
    ("DELETE", "/api/categorias/:id", "Elimina una categoría que no tiene productos", "Admin"),
    ("GET", "/api/emprendedores", "Lista los emprendedores del bazar", "Público"),
    ("POST", "/api/emprendedores", "Registra un emprendedor", "Admin"),
    ("PUT", "/api/emprendedores/:id", "Modifica un emprendedor", "Admin"),
    ("DELETE", "/api/emprendedores/:id", "Elimina un emprendedor que no tiene productos", "Admin"),
    ("GET", "/api/productos", "Catálogo con filtros, búsqueda, orden y paginación", "Público"),
    ("GET", "/api/productos/:id", "Detalle de un producto", "Público"),
    ("POST", "/api/productos", "Crea un producto", "Admin"),
    ("PUT", "/api/productos/:id", "Modifica un producto", "Admin"),
    ("DELETE", "/api/productos/:id", "Baja lógica del producto (activo = false)", "Admin"),
    ("POST", "/api/apartados", "Crea un apartado, descuenta existencias y devuelve el folio", "Público (JWT opcional)"),
    ("GET", "/api/apartados/mis-apartados", "Historial de apartados del cliente", "Cliente"),
    ("GET", "/api/apartados/folio/:folio", "Consulta un apartado por folio y teléfono", "Público"),
    ("GET", "/api/apartados", "Lista los apartados con filtro por estado", "Admin"),
    ("PATCH", "/api/apartados/:id/estado", "Cambia el estado de un apartado", "Admin"),
    ("POST", "/api/mensajes", "Envía un mensaje del formulario de contacto", "Público"),
    ("GET", "/api/mensajes", "Lista los mensajes recibidos", "Admin"),
    ("PATCH", "/api/mensajes/:id/leido", "Marca un mensaje como leído", "Admin"),
    ("GET", "/api/local", "Dirección, horario y datos del local", "Público"),
    ("PUT", "/api/local", "Actualiza la información del local", "Admin"),
]

# (grupo, [(parámetro, ubicación, tipo, obligatorio, validación)])
PARAMETROS = [
    ("POST /api/auth/registro", [
        ("nombre", "Body", "string", "Sí", "Entre 2 y 100 caracteres."),
        ("correo", "Body", "string", "Sí", "Formato de correo; se normaliza a minúsculas; no debe estar registrado."),
        ("contrasena", "Body", "string", "Sí", "Mínimo 8 caracteres y al menos un número. Se guarda cifrada con bcrypt."),
        ("telefono", "Body", "string", "No", "Exactamente 10 dígitos."),
    ]),
    ("POST /api/auth/login", [
        ("correo", "Body", "string", "Sí", "Formato de correo."),
        ("contrasena", "Body", "string", "Sí", "No puede ir vacía."),
    ]),
    ("Rutas protegidas (Cliente / Admin)", [
        ("Authorization", "Header", "string", "Sí", "Bearer <token JWT>. El token expira en 8 horas."),
    ]),
    ("Rutas con :id (categorías, emprendedores, productos, apartados, mensajes)", [
        ("id", "Path", "integer", "Sí", "Entero mayor o igual a 1."),
    ]),
    ("GET /api/categorias", [
        ("todas", "Query", "boolean", "No", "Solo para Admin: true incluye las categorías desactivadas."),
    ]),
    ("POST / PUT /api/categorias", [
        ("nombre", "Body", "string", "Sí (POST)", "Entre 2 y 60 caracteres, único. Con él se genera el slug."),
        ("descripcion", "Body", "string", "No", "Máximo 255 caracteres."),
        ("activa", "Body", "boolean", "No", "Si la categoría se muestra en el catálogo."),
    ]),
    ("POST / PUT /api/emprendedores", [
        ("nombreMarca", "Body", "string", "Sí (POST)", "Entre 2 y 100 caracteres, único."),
        ("responsable", "Body", "string", "No", "Máximo 100 caracteres."),
        ("telefono", "Body", "string", "No", "Exactamente 10 dígitos."),
        ("instagram", "Body", "string", "No", "Debe iniciar con @ (ej. @lunabruja.zac)."),
        ("activo", "Body", "boolean", "No", "Si sigue participando en el bazar."),
    ]),
    ("GET /api/productos", [
        ("categoria", "Query", "string", "No", "Slug de la categoría (comida, ropa, accesorios)."),
        ("q", "Query", "string", "No", "Texto a buscar en el nombre, sin distinguir mayúsculas. Máx. 60."),
        ("min / max", "Query", "number", "No", "Rango de precio, mayor o igual a 0."),
        ("destacado", "Query", "boolean", "No", "true = solo productos destacados (página de inicio)."),
        ("orden", "Query", "string", "No", "recientes (defecto), precio_asc, precio_desc o nombre."),
        ("pagina", "Query", "integer", "No", "Mayor o igual a 1. Por defecto 1."),
        ("limite", "Query", "integer", "No", "Entre 1 y 50. Por defecto 12."),
    ]),
    ("POST / PUT /api/productos", [
        ("nombre", "Body", "string", "Sí (POST)", "Entre 2 y 120 caracteres."),
        ("precio", "Body", "number", "Sí (POST)", "Mayor a 0."),
        ("categoriaId", "Body", "integer", "Sí (POST)", "Debe existir en categorias (si no, 400)."),
        ("emprendedorId", "Body", "integer", "Sí (POST)", "Debe existir en emprendedores (si no, 400)."),
        ("existencias", "Body", "integer", "No", "Mayor o igual a 0. Por defecto 0."),
        ("descripcion", "Body", "string", "No", "Texto libre."),
        ("imagenUrl", "Body", "string", "No", "URL válida (imagen en Cloudinary)."),
        ("destacado / activo", "Body", "boolean", "No", "Mostrar en inicio / mostrar en catálogo."),
    ]),
    ("POST /api/apartados", [
        ("Authorization", "Header", "string", "No", "Si se envía, el apartado queda ligado a la cuenta del cliente."),
        ("nombreCliente", "Body", "string", "Sí", "Entre 2 y 100 caracteres (quién recoge)."),
        ("telefonoCliente", "Body", "string", "Sí", "Exactamente 10 dígitos."),
        ("correoCliente", "Body", "string", "No", "Formato de correo."),
        ("notas", "Body", "string", "No", "Máximo 255 caracteres."),
        ("productos", "Body", "array", "Sí", "Entre 1 y 20 elementos."),
        ("productos[].productoId", "Body", "integer", "Sí", "Producto existente y activo."),
        ("productos[].cantidad", "Body", "integer", "Sí", "Entre 1 y 10, sin superar las existencias (si no, 409)."),
    ]),
    ("GET /api/apartados/folio/:folio", [
        ("folio", "Path", "string", "Sí", "Formato AQ-000000."),
        ("telefono", "Query", "string", "Sí", "10 dígitos; debe coincidir con el del apartado (si no, 404)."),
    ]),
    ("GET /api/apartados", [
        ("estado", "Query", "string", "No", "PENDIENTE, LISTO, RECOGIDO, CANCELADO o EXPIRADO."),
        ("pagina / limite", "Query", "integer", "No", "pagina ≥ 1; limite entre 1 y 50 (por defecto 20)."),
    ]),
    ("PATCH /api/apartados/:id/estado", [
        ("estado", "Body", "string", "Sí", "LISTO, RECOGIDO, CANCELADO o EXPIRADO; la transición debe estar permitida."),
    ]),
    ("POST /api/mensajes", [
        ("nombre", "Body", "string", "Sí", "Entre 2 y 100 caracteres."),
        ("correo", "Body", "string", "Sí", "Formato de correo."),
        ("telefono", "Body", "string", "No", "Exactamente 10 dígitos."),
        ("asunto", "Body", "string", "Sí", "Entre 3 y 120 caracteres."),
        ("mensaje", "Body", "string", "Sí", "Entre 10 y 2000 caracteres."),
    ]),
    ("GET /api/mensajes", [
        ("leido", "Query", "boolean", "No", "Filtra mensajes leídos (true) o pendientes (false)."),
    ]),
    ("PUT /api/local", [
        ("nombre, direccion, horarioAtencion", "Body", "string", "No", "Longitudes de 2–100, 5–200 y 5–150 caracteres."),
        ("telefono / correo", "Body", "string", "No", "10 dígitos / formato de correo."),
        ("instagramUrl / mapaUrl", "Body", "string", "No", "URL válida."),
        ("diasVigenciaApartado", "Body", "integer", "No", "Entre 1 y 15 días."),
    ]),
]

TRANSICIONES = [
    ("PENDIENTE", "LISTO, CANCELADO, EXPIRADO", "No"),
    ("LISTO", "RECOGIDO, CANCELADO, EXPIRADO", "No"),
    ("RECOGIDO", "— (estado final)", "No"),
    ("CANCELADO", "— (estado final)", "Sí, regresan al inventario"),
    ("EXPIRADO", "— (estado final)", "Sí, regresan al inventario"),
]

CODIGOS = [
    ("200", "OK", "—", "Consulta o actualización correcta (GET, PUT, PATCH y login)."),
    ("201", "Created", "—", "Se creó un recurso: registro, categoría, emprendedor, producto, apartado o mensaje."),
    ("204", "No Content", "—", "Eliminación correcta (DELETE). La respuesta no lleva cuerpo."),
    ("400", "Bad Request", "SOLICITUD_INVALIDA", "JSON mal formado, categoría o emprendedor inexistente, o producto no disponible en un apartado."),
    ("401", "Unauthorized", "NO_AUTENTICADO", "Falta el token, el token es inválido o expiró, o las credenciales son incorrectas."),
    ("403", "Forbidden", "PROHIBIDO", "El usuario no tiene el rol necesario (un cliente en una ruta de administrador)."),
    ("404", "Not Found", "NO_ENCONTRADO / RUTA_NO_ENCONTRADA", "El recurso o la ruta no existen; también si el folio no coincide con el teléfono."),
    ("409", "Conflict", "CONFLICTO", "Valor único repetido, sin existencias, categoría con productos o cambio de estado no permitido."),
    ("422", "Unprocessable Entity", "VALIDACION", "Uno o más parámetros no cumplen las reglas; incluye el detalle por campo."),
    ("429", "Too Many Requests", "DEMASIADAS_PETICIONES", "Se superó el límite: 10 intentos de login/registro o 300 peticiones cada 15 minutos."),
    ("500", "Internal Server Error", "ERROR_INTERNO", "Error inesperado; se registra en el servidor sin mostrar detalles internos al cliente."),
]

# (nombre de la prueba, título del ejemplo)
EJEMPLOS = [
    ("login_admin", "Ejemplo 1 · Inicio de sesión correcto (200 OK)"),
    ("registro_invalido", "Ejemplo 2 · Registro con datos inválidos (422 Unprocessable Entity)"),
    ("productos_filtro", "Ejemplo 3 · Catálogo filtrado por categoría y ordenado por precio (200 OK)"),
    ("apartado_crear", "Ejemplo 4 · Crear un apartado con sesión iniciada (201 Created)"),
    ("apartado_sin_existencias", "Ejemplo 5 · Apartado sin existencias suficientes (409 Conflict)"),
    ("categoria_crear_cliente", "Ejemplo 6 · Un cliente intenta crear una categoría (403 Forbidden)"),
    ("perfil_sin_token", "Ejemplo 7 · Ruta protegida sin token (401 Unauthorized)"),
    ("producto_no_existe", "Ejemplo 8 · Producto inexistente (404 Not Found)"),
    ("apartado_estado_invalido", "Ejemplo 9 · Cambio de estado no permitido (409 Conflict)"),
    ("json_malo", "Ejemplo 10 · Cuerpo JSON mal formado (400 Bad Request)"),
    ("categoria_eliminar", "Ejemplo 11 · Eliminar una categoría (204 No Content)"),
]

EJEMPLO_429 = [
    "POST /api/auth/login   (11.º intento en menos de 15 minutos desde la misma IP)",
    "Content-Type: application/json",
    "",
    '{ "correo": "x@x.com", "contrasena": "a" }',
    "",
    "── Respuesta ─────────────────────────────",
    "HTTP/1.1 429 Too Many Requests",
    "RateLimit-Policy: 10;w=900",
    "RateLimit: limit=10, remaining=0, reset=886",
    "",
    "{",
    '  "ok": false,',
    '  "error": {',
    '    "codigo": "DEMASIADAS_PETICIONES",',
    '    "mensaje": "Demasiados intentos, espera 15 minutos"',
    "  }",
    "}",
]

AJUSTES_BD = [
    ("Tipos enumerados rol_usuario y estado_apartado", "PostgreSQL rechaza cualquier valor que no sea un rol o estado válido."),
    ("Campo actualizado_en en usuarios, productos, apartados e informacion_local", "Prisma lo actualiza solo (@updatedAt); sirve para auditoría."),
    ("apartados.correo_cliente y apartados.notas", "Datos opcionales del cliente invitado y comentarios para el local."),
    ("categorias.descripcion, emprendedores.instagram y datos de contacto en informacion_local", "Información pública que muestra el FrontEnd."),
    ("Índices en productos.categoria_id y apartados.estado", "Aceleran el filtro del catálogo y el panel de apartados."),
    ("ON DELETE CASCADE en detalle_apartado → apartados", "Al borrar un apartado se borran sus renglones."),
    ("Baja lógica de productos (activo = false)", "El producto deja de verse pero se conserva en el historial de apartados."),
]

DEPENDENCIAS = [
    ("express", "5.3.0", "Servidor HTTP y enrutamiento del API REST"),
    ("@prisma/client / prisma", "6.19.3", "ORM: modelo de datos, migraciones y consultas parametrizadas"),
    ("jsonwebtoken", "9.0.3", "Firma y verificación de tokens JWT"),
    ("bcryptjs", "3.0.3", "Cifrado (hash) de contraseñas"),
    ("express-validator", "7.3.2", "Validación y limpieza de parámetros"),
    ("helmet", "8.3.0", "Cabeceras de seguridad HTTP"),
    ("cors", "2.8.6", "Control de orígenes permitidos (FrontEnd)"),
    ("express-rate-limit", "8.7.4", "Límite de peticiones por IP"),
    ("dotenv", "18.0.10", "Variables de entorno (.env)"),
    ("typescript / tsx", "7.0.2 / 4.23.15", "Tipado estático y ejecución en desarrollo"),
]

ESTRUCTURA = """aquelarre-backend/
├── prisma/
│   ├── schema.prisma          # modelo de datos (8 tablas, 2 enums)
│   ├── migrations/            # migración SQL generada por Prisma
│   └── seed.ts                # datos iniciales (admin, categorías, productos)
├── src/
│   ├── server.ts              # arranque y cierre ordenado del servidor
│   ├── app.ts                 # helmet, cors, json, rate limit, rutas y errores
│   ├── config/                # env.ts (variables) y prisma.ts (cliente único)
│   ├── routes/index.ts        # las 28 rutas del API
│   ├── middlewares/           # auth.ts, validar.ts, errores.ts
│   ├── validators/            # reglas de express-validator por recurso
│   ├── controllers/           # reciben la petición y arman la respuesta
│   ├── services/              # reglas de negocio y acceso a datos
│   └── utils/                 # ApiError, formato de respuesta y folio
├── pruebas/                   # script de pruebas con curl y resultados
├── docker-compose.yml         # PostgreSQL 16 para desarrollo
├── .env.example               # variables de entorno de ejemplo
└── package.json"""

EJECUCION = """cp .env.example .env
docker compose up -d          # PostgreSQL 16 en el puerto 5434
npm install
npx prisma migrate dev        # crea las 8 tablas
npm run db:seed               # administrador, categorías y productos de ejemplo
npm run dev                   # API en http://localhost:4000/api
bash pruebas/pruebas_api.sh pruebas/resultados.txt   # ejecuta las 51 pruebas"""

SEGURIDAD = [
    ("Contraseñas cifradas:", " se guardan con bcrypt (10 rondas); nunca se devuelve el hash en las respuestas."),
    ("Autenticación con JWT:", " el token se firma con un secreto del archivo .env y expira en 8 horas."),
    ("Autorización por rol:", " el middleware autorizar(\"ADMIN\") protege todas las rutas de administración (403 si no cumple)."),
    ("Validación de entradas:", " cada ruta tiene reglas de express-validator y se usa matchedData(), así solo llegan al servicio los campos permitidos (un cliente no puede enviarse rol = ADMIN al registrarse)."),
    ("Consultas parametrizadas:", " Prisma arma las consultas SQL con parámetros, lo que evita la inyección SQL."),
    ("Cabeceras seguras y CORS:", " helmet agrega cabeceras de seguridad, se desactiva X-Powered-By y CORS solo acepta el origen del FrontEnd."),
    ("Límite de peticiones:", " 10 intentos de login/registro y 300 peticiones por IP cada 15 minutos; el cuerpo JSON se limita a 100 KB."),
    ("Mensajes de error controlados:", " el login responde lo mismo si falla el correo o la contraseña, y los errores 500 no muestran detalles internos."),
    ("Consistencia de datos:", " el apartado se crea en una transacción y las existencias se descuentan con una condición (existencias >= cantidad), así dos clientes no pueden apartar la misma última pieza."),
    ("Privacidad del folio:", " para consultar un apartado sin cuenta se pide el folio y el teléfono con el que se hizo."),
]

PANTALLAS_FE = [
    ("Inicio", "/", "GET /api/categorias · GET /api/productos?destacado=true", "Terminada"),
    ("Catálogo con filtros", "/catalogo", "GET /api/productos (categoria, q, orden, pagina, limite)", "Terminada"),
    ("Detalle de producto", "/producto/:id", "GET /api/productos/:id · GET /api/local", "Terminada"),
    ("Carrito y datos para recoger", "/carrito", "POST /api/apartados", "Terminada"),
    ("Confirmación con folio", "/confirmacion/:folio", "Respuesta 201 de POST /api/apartados", "Terminada"),
    ("Inicio de sesión y registro", "/entrar", "POST /api/auth/login · POST /api/auth/registro", "Terminada"),
    ("Mis apartados", "/mi-cuenta", "GET /api/auth/perfil · GET /api/apartados/mis-apartados", "Terminada"),
    ("Ubicación y contacto", "/contacto", "GET /api/local · POST /api/mensajes", "Pendiente"),
    ("Panel de administración", "/admin/*", "CRUD de productos, categorías, emprendedores; apartados y mensajes", "Pendiente"),
]

TECNOLOGIAS_FE = [
    ("react / react-dom", "19", "Componentes de la interfaz"),
    ("vite", "6.4", "Servidor de desarrollo con proxy a /api y compilación"),
    ("typescript", "5", "Tipos compartidos con las respuestas del API"),
    ("tailwindcss", "3", "Estilos con la paleta de los mockups (bruja, rosa, carmín)"),
    ("react-router-dom", "7", "Rutas de la SPA y filtros del catálogo en la URL"),
    ("@tanstack/react-query", "5", "Consumo del API con caché, estados de carga y error"),
]

CAPTURAS_FE = [
    ("fe_01_inicio.png", "Pantalla de inicio: categorías y destacados obtenidos del API."),
    ("fe_02_catalogo.png", "Catálogo filtrado por la categoría Accesorios y ordenado por precio."),
    ("fe_03_detalle.png", "Detalle de producto con disponibilidad y selector de cantidad."),
    ("fe_04_login_error.png", "Inicio de sesión: el error 401 del API se muestra al usuario."),
    ("fe_05_carrito_validacion.png", "Carrito de apartado: el error 422 del API aparece debajo del campo teléfono."),
    ("fe_06_confirmacion.png", "Confirmación del apartado con el folio generado por el BackEnd."),
    ("fe_07_mis_apartados.png", "Historial de apartados del cliente con su estado."),
    ("fe_08_movil.png", "Catálogo en un celular (390 px de ancho)."),
]

FUENTES_NUEVAS = [
    "OpenJS Foundation. (s.f.). Express 5.x – API Reference. Recuperado de: https://expressjs.com/en/5x/api.html",
    "express-validator. (s.f.). express-validator Documentation (v7). Recuperado de: https://express-validator.github.io/docs/",
    "Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT) (RFC 7519). Internet Engineering Task Force. Recuperado de: https://www.rfc-editor.org/rfc/rfc7519",
    "Fielding, R., Nottingham, M., & Reschke, J. (2022). HTTP Semantics (RFC 9110). Internet Engineering Task Force. Recuperado de: https://www.rfc-editor.org/rfc/rfc9110",
    "Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures [Tesis doctoral]. University of California, Irvine.",
    "OWASP Foundation. (2023). OWASP API Security Top 10 – 2023. Recuperado de: https://owasp.org/API-Security/editions/2023/en/0x11-t10/",
    "Mozilla. (s.f.). Códigos de estado de respuesta HTTP. MDN Web Docs. Recuperado de: https://developer.mozilla.org/es/docs/Web/HTTP/Status",
    "Helmet. (s.f.). Helmet.js Documentation. Recuperado de: https://helmetjs.github.io/",
    "Chen, P. P. (1976). The entity-relationship model—toward a unified view of data. ACM Transactions on Database Systems, 1(1), 9–36.",
    "Object Management Group. (2017). Unified Modeling Language (UML) Specification, versión 2.5.1. Recuperado de: https://www.omg.org/spec/UML/2.5.1",
    "TanStack. (s.f.). TanStack Query v5 Documentation. Recuperado de: https://tanstack.com/query/v5/docs",
    "Vite. (s.f.). Vite Documentation – Server Options (proxy). Recuperado de: https://vite.dev/config/server-options",
    "Remix Software. (s.f.). React Router Documentation. Recuperado de: https://reactrouter.com/",
]
