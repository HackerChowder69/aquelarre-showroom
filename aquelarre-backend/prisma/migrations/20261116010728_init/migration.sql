-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('CLIENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "estado_apartado" AS ENUM ('PENDIENTE', 'LISTO', 'RECOGIDO', 'CANCELADO', 'EXPIRADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(120) NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(15),
    "rol" "rol_usuario" NOT NULL DEFAULT 'CLIENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "slug" VARCHAR(70) NOT NULL,
    "descripcion" VARCHAR(255),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprendedores" (
    "id" SERIAL NOT NULL,
    "nombre_marca" VARCHAR(100) NOT NULL,
    "responsable" VARCHAR(100),
    "telefono" VARCHAR(15),
    "instagram" VARCHAR(60),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emprendedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "emprendedor_id" INTEGER NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "existencias" INTEGER NOT NULL DEFAULT 0,
    "imagen_url" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartados" (
    "id" SERIAL NOT NULL,
    "folio" VARCHAR(12) NOT NULL,
    "usuario_id" INTEGER,
    "nombre_cliente" VARCHAR(100) NOT NULL,
    "telefono_cliente" VARCHAR(15) NOT NULL,
    "correo_cliente" VARCHAR(120),
    "estado" "estado_apartado" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(10,2) NOT NULL,
    "notas" VARCHAR(255),
    "fecha_limite" TIMESTAMP(3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apartados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_apartado" (
    "id" SERIAL NOT NULL,
    "apartado_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_apartado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informacion_local" (
    "id" SMALLINT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(15),
    "correo" VARCHAR(120),
    "instagram_url" VARCHAR(200),
    "horario_atencion" VARCHAR(150) NOT NULL,
    "dias_vigencia_apartado" SMALLINT NOT NULL DEFAULT 3,
    "mapa_url" VARCHAR(500),
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "informacion_local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes_contacto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(120) NOT NULL,
    "telefono" VARCHAR(15),
    "asunto" VARCHAR(120) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "emprendedores_nombre_marca_key" ON "emprendedores"("nombre_marca");

-- CreateIndex
CREATE INDEX "productos_categoria_id_idx" ON "productos"("categoria_id");

-- CreateIndex
CREATE UNIQUE INDEX "apartados_folio_key" ON "apartados"("folio");

-- CreateIndex
CREATE INDEX "apartados_estado_idx" ON "apartados"("estado");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_emprendedor_id_fkey" FOREIGN KEY ("emprendedor_id") REFERENCES "emprendedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartados" ADD CONSTRAINT "apartados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_apartado" ADD CONSTRAINT "detalle_apartado_apartado_id_fkey" FOREIGN KEY ("apartado_id") REFERENCES "apartados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_apartado" ADD CONSTRAINT "detalle_apartado_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
