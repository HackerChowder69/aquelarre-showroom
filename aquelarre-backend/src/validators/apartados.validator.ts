import { body, param, query } from "express-validator";

export const crearApartadoRules = [
  body("nombreCliente").trim().isLength({ min: 2, max: 100 }).withMessage("El nombre es obligatorio"),
  body("telefonoCliente").matches(/^\d{10}$/).withMessage("El teléfono debe tener 10 dígitos"),
  body("correoCliente").optional().isEmail().withMessage("Correo no válido").normalizeEmail(),
  body("notas").optional().isLength({ max: 255 }),
  body("productos").isArray({ min: 1, max: 20 }).withMessage("Debes apartar entre 1 y 20 productos"),
  body("productos.*.productoId").isInt({ min: 1 }).withMessage("productoId no válido").toInt(),
  body("productos.*.cantidad").isInt({ min: 1, max: 10 }).withMessage("La cantidad debe estar entre 1 y 10").toInt(),
];

export const folioRules = [
  param("folio").matches(/^AQ-\d{6}$/).withMessage("Formato de folio: AQ-000000"),
  query("telefono").matches(/^\d{10}$/).withMessage("Envía el teléfono con el que se hizo el apartado"),
];

export const listarApartadosRules = [
  query("estado").optional().isIn(["PENDIENTE", "LISTO", "RECOGIDO", "CANCELADO", "EXPIRADO"]).withMessage("Estado no válido"),
  query("pagina").optional().isInt({ min: 1 }).toInt(),
  query("limite").optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const cambiarEstadoRules = [
  body("estado").isIn(["LISTO", "RECOGIDO", "CANCELADO", "EXPIRADO"]).withMessage("Estado no válido"),
];
