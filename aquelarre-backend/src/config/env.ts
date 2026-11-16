// Carga y valida las variables de entorno
import "dotenv/config";

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: requerida("DATABASE_URL"),
  jwtSecret: requerida("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
};
