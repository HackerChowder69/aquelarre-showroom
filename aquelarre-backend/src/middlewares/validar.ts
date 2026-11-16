// Ejecuta las reglas de express-validator y responde 422 con el detalle de cada campo
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

export function validar(req: Request, _res: Response, next: NextFunction) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const detalles = errores.array().map((e) => ({
      campo: e.type === "field" ? e.path : e.type,
      mensaje: e.msg,
    }));
    throw new ApiError(422, "VALIDACION", "Los datos enviados no son válidos", detalles);
  }
  next();
}
