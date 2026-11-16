// Mensajes del formulario de contacto e información del local
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export function crearMensaje(datos: { nombre: string; correo: string; telefono?: string; asunto: string; mensaje: string }) {
  return prisma.mensajeContacto.create({ data: datos, select: { id: true, creadoEn: true } });
}

export function listarMensajes(leido?: boolean) {
  return prisma.mensajeContacto.findMany({
    where: leido === undefined ? {} : { leido },
    orderBy: { creadoEn: "desc" },
  });
}

export async function marcarLeido(id: number) {
  if (!(await prisma.mensajeContacto.findUnique({ where: { id } }))) throw ApiError.noEncontrado("Mensaje");
  return prisma.mensajeContacto.update({ where: { id }, data: { leido: true } });
}

export async function obtenerLocal() {
  const local = await prisma.informacionLocal.findUnique({ where: { id: 1 } });
  if (!local) throw ApiError.noEncontrado("Información del local");
  return local;
}

export async function actualizarLocal(datos: Record<string, unknown>) {
  await obtenerLocal();
  return prisma.informacionLocal.update({ where: { id: 1 }, data: datos });
}
