import { body, query } from "express-validator";

export const categoriaRules = (parcial = false) => [
  (parcial ? body("nombre").optional() : body("nombre")).trim().isLength({ min: 2, max: 60 }).withMessage("El nombre debe tener entre 2 y 60 caracteres"),
  body("descripcion").optional().isLength({ max: 255 }).withMessage("Máximo 255 caracteres"),
  body("activa").optional().isBoolean().withMessage("activa debe ser booleano").toBoolean(),
];

export const emprendedorRules = (parcial = false) => [
  (parcial ? body("nombreMarca").optional() : body("nombreMarca")).trim().isLength({ min: 2, max: 100 }).withMessage("La marca debe tener entre 2 y 100 caracteres"),
  body("responsable").optional().isLength({ max: 100 }),
  body("telefono").optional().matches(/^\d{10}$/).withMessage("El teléfono debe tener 10 dígitos"),
  body("instagram").optional().matches(/^@[\w.]{1,59}$/).withMessage("Instagram debe iniciar con @"),
  body("activo").optional().isBoolean().toBoolean(),
];

export const productoRules = (parcial = false) => {
  const req = (campo: string) => (parcial ? body(campo).optional() : body(campo));
  return [
    req("nombre").trim().isLength({ min: 2, max: 120 }).withMessage("El nombre debe tener entre 2 y 120 caracteres"),
    req("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0").toFloat(),
    req("categoriaId").isInt({ min: 1 }).withMessage("categoriaId debe ser un entero").toInt(),
    req("emprendedorId").isInt({ min: 1 }).withMessage("emprendedorId debe ser un entero").toInt(),
    body("existencias").optional().isInt({ min: 0 }).withMessage("Las existencias no pueden ser negativas").toInt(),
    body("descripcion").optional().isString(),
    body("imagenUrl").optional().isURL().withMessage("imagenUrl debe ser una URL válida"),
    body("destacado").optional().isBoolean().toBoolean(),
    body("activo").optional().isBoolean().toBoolean(),
  ];
};

export const listarProductosRules = [
  query("categoria").optional().isSlug().withMessage("categoria debe ser el slug de la categoría"),
  query("q").optional().trim().isLength({ max: 60 }),
  query("min").optional().isFloat({ min: 0 }).toFloat(),
  query("max").optional().isFloat({ min: 0 }).toFloat(),
  query("destacado").optional().isBoolean().toBoolean(),
  query("orden").optional().isIn(["recientes", "precio_asc", "precio_desc", "nombre"]).withMessage("orden no válido"),
  query("pagina").optional().isInt({ min: 1 }).toInt(),
  query("limite").optional().isInt({ min: 1, max: 50 }).withMessage("limite debe estar entre 1 y 50").toInt(),
];
