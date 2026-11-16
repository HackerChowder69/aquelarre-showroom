// Configuración de la aplicación Express: seguridad, CORS, JSON, rutas y errores
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import rutas from "./routes";
import { manejadorErrores, rutaNoEncontrada } from "./middlewares/errores";

export const app = express();

app.disable("x-powered-by");
app.use(helmet()); // Cabeceras de seguridad HTTP
app.use(cors({ origin: env.corsOrigin, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json({ limit: "100kb" })); // Evita cuerpos demasiado grandes

// Límite general: 300 peticiones cada 15 minutos por IP
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { ok: false, error: { codigo: "DEMASIADAS_PETICIONES", mensaje: "Demasiadas peticiones, intenta más tarde" } },
  }),
);

app.use("/api", rutas);
app.use(rutaNoEncontrada);
app.use(manejadorErrores);
