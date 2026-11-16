// Controladores de apartados (carrito -> folio para recoger en tienda)
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as apartados from "../services/apartados.service";
import { ok } from "../utils/respuesta";

export async function crear(req: Request, res: Response) {
  const datos = matchedData(req, { locations: ["body"] }) as apartados.NuevoApartado;
  // Si el cliente inició sesión el apartado queda ligado a su cuenta; si no, es de invitado
  ok(res, await apartados.crear(datos, req.usuario?.id), 201);
}

export async function misApartados(req: Request, res: Response) {
  ok(res, await apartados.misApartados(req.usuario!.id));
}

export async function porFolio(req: Request, res: Response) {
  const { folio, telefono } = matchedData(req);
  ok(res, await apartados.porFolio(folio, telefono));
}

export async function listar(req: Request, res: Response) {
  const { estado, pagina, limite } = matchedData(req, { locations: ["query"] });
  const resultado = await apartados.listar(estado, pagina, limite);
  ok(res, resultado.apartados, 200, resultado.meta);
}

export async function cambiarEstado(req: Request, res: Response) {
  const { id, estado } = matchedData(req);
  ok(res, await apartados.cambiarEstado(id, estado));
}
