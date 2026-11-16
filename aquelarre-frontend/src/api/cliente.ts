// Cliente HTTP del API REST de Aquelarre: agrega el token y convierte los errores en ApiError
export interface Categoria { id: number; nombre: string; slug: string; descripcion: string | null; _count?: { productos: number } }
export interface Producto {
  id: number; nombre: string; descripcion: string | null; precio: number; existencias: number; imagenUrl: string | null;
  destacado: boolean; categoria: { id: number; nombre: string; slug: string }; emprendedor: { id: number; nombreMarca: string; instagram: string | null };
}
export interface Meta { total: number; pagina: number; limite: number; paginas: number }
export interface Usuario { id: number; nombre: string; correo: string; telefono: string | null; rol: "CLIENTE" | "ADMIN" }
export interface DetalleApartado { cantidad: number; precioUnitario: number; subtotal: number; producto: { id: number; nombre: string; imagenUrl: string | null } }
export interface Apartado {
  id: number; folio: string; nombreCliente: string; telefonoCliente: string; estado: string; total: number;
  notas: string | null; fechaLimite: string; creadoEn: string; detalles: DetalleApartado[];
}
export interface InfoLocal { nombre: string; direccion: string; telefono: string | null; horarioAtencion: string; diasVigenciaApartado: number }

export class ApiError extends Error {
  constructor(public status: number, public codigo: string, mensaje: string, public detalles?: { campo: string; mensaje: string }[] | unknown) {
    super(mensaje);
  }
  // Errores de validación agrupados por campo para mostrarlos debajo de cada input
  porCampo(): Record<string, string> {
    if (!Array.isArray(this.detalles)) return {};
    return Object.fromEntries(this.detalles.filter((d) => d?.campo).map((d) => [d.campo.replace(/^productos\[\d+\]\./, ""), d.mensaje]));
  }
}

const BASE = import.meta.env.VITE_API_URL ?? "/api";
let token: string | null = sessionStorage.getItem("aq_token");

export function guardarToken(nuevo: string | null) {
  token = nuevo;
  if (nuevo) sessionStorage.setItem("aq_token", nuevo);
  else sessionStorage.removeItem("aq_token");
}

export async function api<T>(ruta: string, opciones: { metodo?: string; cuerpo?: unknown } = {}): Promise<{ data: T; meta?: Meta }> {
  const res = await fetch(BASE + ruta, {
    method: opciones.metodo ?? "GET",
    headers: {
      ...(opciones.cuerpo !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
  });
  if (res.status === 204) return { data: undefined as T };
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    const e = json?.error;
    throw new ApiError(res.status, e?.codigo ?? "ERROR", e?.mensaje ?? "No se pudo conectar con el servidor", e?.detalles);
  }
  return json;
}

export const pesos = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
