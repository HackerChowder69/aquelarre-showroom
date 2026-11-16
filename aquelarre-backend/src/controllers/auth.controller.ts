// Controladores: reciben la petición ya validada, llaman al servicio y arman la respuesta HTTP
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as authService from "../services/auth.service";
import { ok } from "../utils/respuesta";

export async function registro(req: Request, res: Response) {
  const datos = matchedData(req, { locations: ["body"] }) as Parameters<typeof authService.registrar>[0];
  ok(res, await authService.registrar(datos), 201);
}

export async function login(req: Request, res: Response) {
  const { correo, contrasena } = matchedData(req, { locations: ["body"] });
  ok(res, await authService.login(correo, contrasena));
}

export async function perfil(req: Request, res: Response) {
  ok(res, await authService.perfil(req.usuario!.id));
}
