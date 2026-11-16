import { body, query } from "express-validator";

export const mensajeRules = [
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("El nombre es obligatorio"),
  body("correo").isEmail().withMessage("Correo no válido").normalizeEmail(),
  body("telefono").optional().matches(/^\d{10}$/).withMessage("El teléfono debe tener 10 dígitos"),
  body("asunto").trim().isLength({ min: 3, max: 120 }).withMessage("El asunto debe tener entre 3 y 120 caracteres"),
  body("mensaje").trim().isLength({ min: 10, max: 2000 }).withMessage("El mensaje debe tener entre 10 y 2000 caracteres"),
];

export const listarMensajesRules = [query("leido").optional().isBoolean().toBoolean()];

export const localRules = [
  body("nombre").optional().isLength({ min: 2, max: 100 }),
  body("direccion").optional().isLength({ min: 5, max: 200 }),
  body("telefono").optional().matches(/^\d{10}$/).withMessage("El teléfono debe tener 10 dígitos"),
  body("correo").optional().isEmail(),
  body("instagramUrl").optional().isURL(),
  body("horarioAtencion").optional().isLength({ min: 5, max: 150 }),
  body("diasVigenciaApartado").optional().isInt({ min: 1, max: 15 }).withMessage("La vigencia debe estar entre 1 y 15 días").toInt(),
  body("mapaUrl").optional().isURL(),
];
