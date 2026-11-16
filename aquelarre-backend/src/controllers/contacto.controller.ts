// Controladores de mensajes de contacto e información del local
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as contacto from "../services/contacto.service";
import { ok } from "../utils/respuesta";

export async function crearMensaje(req: Request, res: Response) {
  const datos = matchedData(req, { locations: ["body"] }) as Parameters<typeof contacto.crearMensaje>[0];
  ok(res, await contacto.crearMensaje(datos), 201);
}

export async function listarMensajes(req: Request, res: Response) {
  ok(res, await contacto.listarMensajes(matchedData(req, { locations: ["query"] }).leido));
}

export async function marcarLeido(req: Request, res: Response) {
  ok(res, await contacto.marcarLeido(matchedData(req, { locations: ["params"] }).id));
}

export async function obtenerLocal(_req: Request, res: Response) {
  ok(res, await contacto.obtenerLocal());
}

export async function actualizarLocal(req: Request, res: Response) {
  ok(res, await contacto.actualizarLocal(matchedData(req, { locations: ["body"] })));
}
