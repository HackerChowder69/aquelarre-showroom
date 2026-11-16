// Categorías y emprendedores (catálogos administrables)
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export function crearSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- Categorías ----------
export function listarCategorias(incluirInactivas: boolean) {
  return prisma.categoria.findMany({
    where: incluirInactivas ? {} : { activa: true },
    orderBy: { nombre: "asc" },
    include: { _count: { select: { productos: { where: { activo: true } } } } },
  });
}

export async function obtenerCategoria(id: number) {
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) throw ApiError.noEncontrado("Categoría");
  return categoria;
}

export function crearCategoria(datos: { nombre: string; descripcion?: string; activa?: boolean }) {
  return prisma.categoria.create({ data: { ...datos, slug: crearSlug(datos.nombre) } });
}

export async function actualizarCategoria(id: number, datos: { nombre?: string; descripcion?: string; activa?: boolean }) {
  await obtenerCategoria(id);
  return prisma.categoria.update({
    where: { id },
    data: { ...datos, ...(datos.nombre ? { slug: crearSlug(datos.nombre) } : {}) },
  });
}

export async function eliminarCategoria(id: number) {
  await obtenerCategoria(id);
  const productos = await prisma.producto.count({ where: { categoriaId: id } });
  if (productos > 0) throw ApiError.conflicto(`La categoría tiene ${productos} producto(s); muévelos o desactívala`);
  await prisma.categoria.delete({ where: { id } });
}

// ---------- Emprendedores ----------
export function listarEmprendedores() {
  return prisma.emprendedor.findMany({
    orderBy: { nombreMarca: "asc" },
    include: { _count: { select: { productos: true } } },
  });
}

async function obtenerEmprendedor(id: number) {
  const emprendedor = await prisma.emprendedor.findUnique({ where: { id } });
  if (!emprendedor) throw ApiError.noEncontrado("Emprendedor");
  return emprendedor;
}

export function crearEmprendedor(datos: { nombreMarca: string; responsable?: string; telefono?: string; instagram?: string }) {
  return prisma.emprendedor.create({ data: datos });
}

export async function actualizarEmprendedor(id: number, datos: Record<string, unknown>) {
  await obtenerEmprendedor(id);
  return prisma.emprendedor.update({ where: { id }, data: datos });
}

export async function eliminarEmprendedor(id: number) {
  await obtenerEmprendedor(id);
  const productos = await prisma.producto.count({ where: { emprendedorId: id } });
  if (productos > 0) throw ApiError.conflicto(`El emprendedor tiene ${productos} producto(s); desactívalo en su lugar`);
  await prisma.emprendedor.delete({ where: { id } });
}
