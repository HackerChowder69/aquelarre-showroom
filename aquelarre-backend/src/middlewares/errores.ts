// Manejo centralizado de errores: convierte cualquier error en una respuesta JSON uniforme
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export function rutaNoEncontrada(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, "RUTA_NO_ENCONTRADA", `No existe la ruta ${req.method} ${req.originalUrl}`));
}

export function manejadorErrores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    error = ApiError.conflicto("Ya existe un registro con ese valor único", { campos: err.meta?.target });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    error = ApiError.noEncontrado("Registro");
  } else if (err instanceof SyntaxError && "body" in err) {
    error = ApiError.badRequest("El cuerpo de la petición no es un JSON válido");
  } else {
    console.error(err);
    error = new ApiError(500, "ERROR_INTERNO", "Ocurrió un error inesperado en el servidor");
  }

  res.status(error.status).json({
    ok: false,
    error: { codigo: error.codigo, mensaje: error.message, ...(error.detalles ? { detalles: error.detalles } : {}) },
  });
}
