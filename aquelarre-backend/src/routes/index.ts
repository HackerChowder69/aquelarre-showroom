// Definición de todas las rutas del API REST (prefijo /api)
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { autenticar, autenticacionOpcional, autorizar } from "../middlewares/auth";
import { validar } from "../middlewares/validar";
import { idParam } from "../validators/comunes";
import { loginRules, registroRules } from "../validators/auth.validator";
import { categoriaRules, emprendedorRules, listarProductosRules, productoRules } from "../validators/catalogo.validator";
import { cambiarEstadoRules, crearApartadoRules, folioRules, listarApartadosRules } from "../validators/apartados.validator";
import { listarMensajesRules, localRules, mensajeRules } from "../validators/contacto.validator";
import * as auth from "../controllers/auth.controller";
import * as catalogo from "../controllers/catalogo.controller";
import * as productos from "../controllers/productos.controller";
import * as apartados from "../controllers/apartados.controller";
import * as contacto from "../controllers/contacto.controller";

const router = Router();
const soloAdmin = [autenticar, autorizar("ADMIN")];

// Máximo 10 intentos de inicio de sesión / registro cada 15 minutos por IP
const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { ok: false, error: { codigo: "DEMASIADAS_PETICIONES", mensaje: "Demasiados intentos, espera 15 minutos" } },
});

router.get("/salud", (_req, res) => {
  res.json({ ok: true, data: { estado: "en línea", fecha: new Date().toISOString() } });
});

// ---------- Autenticación ----------
router.post("/auth/registro", limiteAuth, registroRules, validar, auth.registro);
router.post("/auth/login", limiteAuth, loginRules, validar, auth.login);
router.get("/auth/perfil", autenticar, auth.perfil);

// ---------- Categorías ----------
router.get("/categorias", autenticacionOpcional, catalogo.listarCategorias);
router.get("/categorias/:id", idParam, validar, catalogo.obtenerCategoria);
router.post("/categorias", soloAdmin, categoriaRules(), validar, catalogo.crearCategoria);
router.put("/categorias/:id", soloAdmin, idParam, categoriaRules(true), validar, catalogo.actualizarCategoria);
router.delete("/categorias/:id", soloAdmin, idParam, validar, catalogo.eliminarCategoria);

// ---------- Emprendedores ----------
router.get("/emprendedores", catalogo.listarEmprendedores);
router.post("/emprendedores", soloAdmin, emprendedorRules(), validar, catalogo.crearEmprendedor);
router.put("/emprendedores/:id", soloAdmin, idParam, emprendedorRules(true), validar, catalogo.actualizarEmprendedor);
router.delete("/emprendedores/:id", soloAdmin, idParam, validar, catalogo.eliminarEmprendedor);

// ---------- Productos ----------
router.get("/productos", listarProductosRules, validar, productos.listar);
router.get("/productos/:id", idParam, validar, productos.obtener);
router.post("/productos", soloAdmin, productoRules(), validar, productos.crear);
router.put("/productos/:id", soloAdmin, idParam, productoRules(true), validar, productos.actualizar);
router.delete("/productos/:id", soloAdmin, idParam, validar, productos.eliminar);

// ---------- Apartados ----------
router.post("/apartados", autenticacionOpcional, crearApartadoRules, validar, apartados.crear);
router.get("/apartados/mis-apartados", autenticar, apartados.misApartados);
router.get("/apartados/folio/:folio", folioRules, validar, apartados.porFolio);
router.get("/apartados", soloAdmin, listarApartadosRules, validar, apartados.listar);
router.patch("/apartados/:id/estado", soloAdmin, idParam, cambiarEstadoRules, validar, apartados.cambiarEstado);

// ---------- Contacto y local ----------
router.post("/mensajes", mensajeRules, validar, contacto.crearMensaje);
router.get("/mensajes", soloAdmin, listarMensajesRules, validar, contacto.listarMensajes);
router.patch("/mensajes/:id/leido", soloAdmin, idParam, validar, contacto.marcarLeido);
router.get("/local", contacto.obtenerLocal);
router.put("/local", soloAdmin, localRules, validar, contacto.actualizarLocal);

export default router;
