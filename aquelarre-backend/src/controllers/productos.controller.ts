// Controladores del catálogo de productos
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as productos from "../services/productos.service";
import { ok } from "../utils/respuesta";

const id = (req: Request) => matchedData(req, { locations: ["params"] }).id as number;

export async function listar(req: Request, res: Response) {
  const filtros = matchedData(req, { locations: ["query"] }) as productos.FiltrosProducto;
  const { productos: lista, meta } = await productos.listar(filtros);
  ok(res, lista, 200, meta);
}

export async function obtener(req: Request, res: Response) {
  ok(res, await productos.obtener(id(req)));
}

export async function crear(req: Request, res: Response) {
  const datos = matchedData(req, { locations: ["body"] }) as Parameters<typeof productos.crear>[0];
  ok(res, await productos.crear(datos), 201);
}

export async function actualizar(req: Request, res: Response) {
  ok(res, await productos.actualizar(id(req), matchedData(req, { locations: ["body"] })));
}

export async function eliminar(req: Request, res: Response) {
  await productos.eliminar(id(req));
  res.status(204).end();
}
