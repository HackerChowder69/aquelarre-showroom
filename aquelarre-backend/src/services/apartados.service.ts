// Reglas de negocio de los apartados: existencias, folio, vigencia y cambios de estado
import { EstadoApartado, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { generarFolio, sumarDias } from "../utils/folio";

export interface NuevoApartado {
  nombreCliente: string;
  telefonoCliente: string;
  correoCliente?: string;
  notas?: string;
  productos: { productoId: number; cantidad: number }[];
}

const detalleCompleto = {
  detalles: {
    select: {
      cantidad: true,
      precioUnitario: true,
      subtotal: true,
      producto: { select: { id: true, nombre: true, imagenUrl: true } },
    },
  },
};

// Transiciones permitidas: un apartado recogido, cancelado o expirado ya no cambia
const transiciones: Record<EstadoApartado, EstadoApartado[]> = {
  PENDIENTE: ["LISTO", "CANCELADO", "EXPIRADO"],
  LISTO: ["RECOGIDO", "CANCELADO", "EXPIRADO"],
  RECOGIDO: [],
  CANCELADO: [],
  EXPIRADO: [],
};

export async function crear(datos: NuevoApartado, usuarioId?: number) {
  // Si el mismo producto viene repetido en el carrito, se suman las cantidades
  const cantidades = new Map<number, number>();
  for (const p of datos.productos) cantidades.set(p.productoId, (cantidades.get(p.productoId) ?? 0) + p.cantidad);

  return prisma.$transaction(async (tx) => {
    const ids = [...cantidades.keys()];
    const productos = await tx.producto.findMany({ where: { id: { in: ids }, activo: true } });
    const faltantes = ids.filter((id) => !productos.some((p) => p.id === id));
    if (faltantes.length) throw ApiError.badRequest("Algunos productos no existen o ya no están disponibles", { productos: faltantes });

    // Descuenta existencias de forma condicional para evitar apartar más piezas de las que hay
    const sinExistencias: { productoId: number; disponibles: number; solicitadas: number }[] = [];
    for (const producto of productos) {
      const solicitadas = cantidades.get(producto.id)!;
      const { count } = await tx.producto.updateMany({
        where: { id: producto.id, existencias: { gte: solicitadas } },
        data: { existencias: { decrement: solicitadas } },
      });
      if (count === 0) sinExistencias.push({ productoId: producto.id, disponibles: producto.existencias, solicitadas });
    }
    if (sinExistencias.length) throw ApiError.conflicto("No hay existencias suficientes", sinExistencias);

    const detalles = productos.map((p) => {
      const cantidad = cantidades.get(p.id)!;
      return { productoId: p.id, cantidad, precioUnitario: p.precio, subtotal: p.precio.mul(cantidad) };
    });
    const total = detalles.reduce((suma, d) => suma.add(d.subtotal), new Prisma.Decimal(0));
    const local = await tx.informacionLocal.findUnique({ where: { id: 1 } });

    const apartado = await tx.apartado.create({
      data: {
        folio: `TMP-${Date.now().toString(36).slice(-8)}`,
        usuarioId,
        nombreCliente: datos.nombreCliente,
        telefonoCliente: datos.telefonoCliente,
        correoCliente: datos.correoCliente,
        notas: datos.notas,
        total,
        fechaLimite: sumarDias(new Date(), local?.diasVigenciaApartado ?? 3),
        detalles: { create: detalles },
      },
    });

    // El folio definitivo se arma con el id generado: AQ-000001
    return tx.apartado.update({
      where: { id: apartado.id },
      data: { folio: generarFolio(apartado.id) },
      include: detalleCompleto,
    });
  });
}

export function misApartados(usuarioId: number) {
  return prisma.apartado.findMany({
    where: { usuarioId },
    orderBy: { creadoEn: "desc" },
    include: detalleCompleto,
  });
}

// Consulta pública por folio: se pide el teléfono para que nadie vea apartados ajenos
export async function porFolio(folio: string, telefono: string) {
  const apartado = await prisma.apartado.findUnique({ where: { folio }, include: detalleCompleto });
  if (!apartado || apartado.telefonoCliente !== telefono) throw ApiError.noEncontrado("Apartado");
  return apartado;
}

export async function listar(estado?: EstadoApartado, pagina = 1, limite = 20) {
  const where = estado ? { estado } : {};
  const [total, apartados] = await prisma.$transaction([
    prisma.apartado.count({ where }),
    prisma.apartado.findMany({
      where,
      orderBy: { creadoEn: "desc" },
      skip: (pagina - 1) * limite,
      take: limite,
      include: { ...detalleCompleto, usuario: { select: { id: true, nombre: true, correo: true } } },
    }),
  ]);
  return { apartados, meta: { total, pagina, limite, paginas: Math.ceil(total / limite) } };
}

export async function cambiarEstado(id: number, nuevo: EstadoApartado) {
  return prisma.$transaction(async (tx) => {
    const apartado = await tx.apartado.findUnique({ where: { id }, include: { detalles: true } });
    if (!apartado) throw ApiError.noEncontrado("Apartado");
    if (!transiciones[apartado.estado].includes(nuevo)) {
      throw ApiError.conflicto(`No se puede cambiar de ${apartado.estado} a ${nuevo}`);
    }

    // Si el apartado se cancela o expira, las piezas regresan al inventario
    if (nuevo === "CANCELADO" || nuevo === "EXPIRADO") {
      for (const d of apartado.detalles) {
        await tx.producto.update({ where: { id: d.productoId }, data: { existencias: { increment: d.cantidad } } });
      }
    }
    return tx.apartado.update({ where: { id }, data: { estado: nuevo }, include: detalleCompleto });
  });
}
