// Controladores de categorías y emprendedores
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import * as catalogo from "../services/catalogo.service";
import { ok } from "../utils/respuesta";

const cuerpo = (req: Request) => matchedData(req, { locations: ["body"] });
const id = (req: Request) => matchedData(req, { locations: ["params"] }).id as number;

// Categorías
export async function listarCategorias(req: Request, res: Response) {
  // El administrador puede ver también las categorías desactivadas con ?todas=true
  ok(res, await catalogo.listarCategorias(req.usuario?.rol === "ADMIN" && req.query.todas === "true"));
}
export async function obtenerCategoria(req: Request, res: Response) {
  ok(res, await catalogo.obtenerCategoria(id(req)));
}
export async function crearCategoria(req: Request, res: Response) {
  ok(res, await catalogo.crearCategoria(cuerpo(req) as { nombre: string }), 201);
}
export async function actualizarCategoria(req: Request, res: Response) {
  ok(res, await catalogo.actualizarCategoria(id(req), cuerpo(req)));
}
export async function eliminarCategoria(req: Request, res: Response) {
  await catalogo.eliminarCategoria(id(req));
  res.status(204).end();
}

// Emprendedores
export async function listarEmprendedores(_req: Request, res: Response) {
  ok(res, await catalogo.listarEmprendedores());
}
export async function crearEmprendedor(req: Request, res: Response) {
  ok(res, await catalogo.crearEmprendedor(cuerpo(req) as { nombreMarca: string }), 201);
}
export async function actualizarEmprendedor(req: Request, res: Response) {
  ok(res, await catalogo.actualizarEmprendedor(id(req), cuerpo(req)));
}
export async function eliminarEmprendedor(req: Request, res: Response) {
  await catalogo.eliminarEmprendedor(id(req));
  res.status(204).end();
}
