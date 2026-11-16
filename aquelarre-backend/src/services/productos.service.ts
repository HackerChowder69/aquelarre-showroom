// Catálogo de productos: búsqueda con filtros y CRUD del administrador
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export interface FiltrosProducto {
  categoria?: string;
  q?: string;
  min?: number;
  max?: number;
  destacado?: boolean;
  orden?: "recientes" | "precio_asc" | "precio_desc" | "nombre";
  pagina?: number;
  limite?: number;
}

const ordenes: Record<string, Prisma.ProductoOrderByWithRelationInput> = {
  recientes: { creadoEn: "desc" },
  precio_asc: { precio: "asc" },
  precio_desc: { precio: "desc" },
  nombre: { nombre: "asc" },
};

const relaciones = {
  categoria: { select: { id: true, nombre: true, slug: true } },
  emprendedor: { select: { id: true, nombreMarca: true, instagram: true } },
};

export async function listar(f: FiltrosProducto) {
  const pagina = f.pagina ?? 1;
  const limite = f.limite ?? 12;
  const where: Prisma.ProductoWhereInput = {
    activo: true,
    ...(f.categoria && { categoria: { slug: f.categoria } }),
    ...(f.q && { nombre: { contains: f.q, mode: "insensitive" } }),
    ...(f.destacado !== undefined && { destacado: f.destacado }),
    ...((f.min !== undefined || f.max !== undefined) && { precio: { gte: f.min, lte: f.max } }),
  };

  const [total, productos] = await prisma.$transaction([
    prisma.producto.count({ where }),
    prisma.producto.findMany({
      where,
      include: relaciones,
      orderBy: ordenes[f.orden ?? "recientes"],
      skip: (pagina - 1) * limite,
      take: limite,
    }),
  ]);
  return { productos, meta: { total, pagina, limite, paginas: Math.ceil(total / limite) } };
}

export async function obtener(id: number) {
  const producto = await prisma.producto.findFirst({ where: { id, activo: true }, include: relaciones });
  if (!producto) throw ApiError.noEncontrado("Producto");
  return producto;
}

async function validarRelaciones(categoriaId?: number, emprendedorId?: number) {
  if (categoriaId && !(await prisma.categoria.findUnique({ where: { id: categoriaId } }))) {
    throw ApiError.badRequest("La categoría indicada no existe");
  }
  if (emprendedorId && !(await prisma.emprendedor.findUnique({ where: { id: emprendedorId } }))) {
    throw ApiError.badRequest("El emprendedor indicado no existe");
  }
}

export async function crear(datos: Prisma.ProductoUncheckedCreateInput) {
  await validarRelaciones(datos.categoriaId, datos.emprendedorId);
  return prisma.producto.create({ data: datos, include: relaciones });
}

export async function actualizar(id: number, datos: Prisma.ProductoUncheckedUpdateInput) {
  if (!(await prisma.producto.findUnique({ where: { id } }))) throw ApiError.noEncontrado("Producto");
  await validarRelaciones(datos.categoriaId as number | undefined, datos.emprendedorId as number | undefined);
  return prisma.producto.update({ where: { id }, data: datos, include: relaciones });
}

// Baja lógica: el producto deja de verse pero se conserva en el historial de apartados
export async function eliminar(id: number) {
  if (!(await prisma.producto.findUnique({ where: { id } }))) throw ApiError.noEncontrado("Producto");
  await prisma.producto.update({ where: { id }, data: { activo: false } });
}
