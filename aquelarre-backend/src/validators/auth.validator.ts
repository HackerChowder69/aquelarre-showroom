import { body } from "express-validator";

export const registroRules = [
  body("nombre").trim().isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("correo").trim().isEmail().withMessage("Correo no válido").normalizeEmail(),
  body("contrasena")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/).withMessage("La contraseña debe incluir al menos un número"),
  body("telefono").optional().matches(/^\d{10}$/).withMessage("El teléfono debe tener 10 dígitos"),
];

export const loginRules = [
  body("correo").trim().isEmail().withMessage("Correo no válido").normalizeEmail(),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
];
