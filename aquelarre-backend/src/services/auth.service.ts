// Registro, inicio de sesión y perfil de usuario
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const camposPublicos = { id: true, nombre: true, correo: true, telefono: true, rol: true, creadoEn: true };

function firmarToken(id: number, rol: string) {
  return jwt.sign({ rol }, env.jwtSecret, { subject: String(id), expiresIn: env.jwtExpiresIn } as SignOptions);
}

export async function registrar(datos: { nombre: string; correo: string; contrasena: string; telefono?: string }) {
  const existe = await prisma.usuario.findUnique({ where: { correo: datos.correo } });
  if (existe) throw ApiError.conflicto("El correo ya está registrado");

  // El rol siempre es CLIENTE: un administrador no se puede registrar desde el API público
  const usuario = await prisma.usuario.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      contrasenaHash: await bcrypt.hash(datos.contrasena, 10),
    },
    select: camposPublicos,
  });
  return { usuario, token: firmarToken(usuario.id, usuario.rol) };
}

export async function login(correo: string, contrasena: string) {
  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  // Mismo mensaje para correo o contraseña incorrectos (no revelar qué cuentas existen)
  if (!usuario || !usuario.activo || !(await bcrypt.compare(contrasena, usuario.contrasenaHash))) {
    throw ApiError.noAutenticado("Correo o contraseña incorrectos");
  }
  const { contrasenaHash: _hash, activo: _activo, actualizadoEn: _act, ...publico } = usuario;
  return { usuario: publico, token: firmarToken(usuario.id, usuario.rol) };
}

export async function perfil(id: number) {
  const usuario = await prisma.usuario.findUnique({ where: { id }, select: camposPublicos });
  if (!usuario) throw ApiError.noEncontrado("Usuario");
  return usuario;
}
