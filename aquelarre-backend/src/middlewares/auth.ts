// Verificación del token JWT y control de acceso por rol
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export interface UsuarioToken {
  id: number;
  rol: "CLIENTE" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

function leerToken(req: Request): UsuarioToken | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    return { id: Number(payload.sub), rol: payload.rol };
  } catch {
    throw ApiError.noAutenticado("Token inválido o expirado");
  }
}

// Exige un token válido
export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const usuario = leerToken(req);
  if (!usuario) throw ApiError.noAutenticado();
  req.usuario = usuario;
  next();
}

// Si viene token lo usa, si no continúa como invitado (apartados sin cuenta)
export function autenticacionOpcional(req: Request, _res: Response, next: NextFunction) {
  const usuario = leerToken(req);
  if (usuario) req.usuario = usuario;
  next();
}

// Exige uno de los roles indicados (se usa después de autenticar)
export function autorizar(...roles: UsuarioToken["rol"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) throw ApiError.prohibido();
    next();
  };
}
