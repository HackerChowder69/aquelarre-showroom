// Punto de entrada: levanta el servidor HTTP
import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const servidor = app.listen(env.port, () => {
  console.log(`API Aquelarre escuchando en http://localhost:${env.port}/api`);
});

// Cierre ordenado: termina las peticiones en curso y libera la conexión a la base de datos
async function cerrar() {
  servidor.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", cerrar);
process.on("SIGTERM", cerrar);
