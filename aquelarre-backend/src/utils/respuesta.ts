// Formato uniforme de respuestas exitosas: { ok: true, data, meta? }
import { Response } from "express";
import { Prisma } from "@prisma/client";

// Convierte los Decimal de Prisma (precio, total, subtotal) a número para el JSON
function serializar(valor: unknown): unknown {
  if (Prisma.Decimal.isDecimal(valor)) return Number(valor);
  if (Array.isArray(valor)) return valor.map(serializar);
  if (valor && typeof valor === "object" && !(valor instanceof Date)) {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, serializar(v)]));
  }
  return valor;
}

export function ok(res: Response, data: unknown, status = 200, meta?: unknown) {
  const cuerpo: Record<string, unknown> = { ok: true, data: serializar(data) };
  if (meta) cuerpo.meta = meta;
  return res.status(status).json(cuerpo);
}
