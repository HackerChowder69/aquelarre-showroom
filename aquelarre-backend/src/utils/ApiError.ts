// Error controlado del API: lleva el código HTTP y un código interno legible
export class ApiError extends Error {
  constructor(
    public status: number,
    public codigo: string,
    mensaje: string,
    public detalles?: unknown,
  ) {
    super(mensaje);
  }

  static badRequest(mensaje: string, detalles?: unknown) {
    return new ApiError(400, "SOLICITUD_INVALIDA", mensaje, detalles);
  }
  static noAutenticado(mensaje = "Se requiere iniciar sesión") {
    return new ApiError(401, "NO_AUTENTICADO", mensaje);
  }
  static prohibido(mensaje = "No tienes permiso para esta acción") {
    return new ApiError(403, "PROHIBIDO", mensaje);
  }
  static noEncontrado(recurso: string) {
    return new ApiError(404, "NO_ENCONTRADO", `${recurso} no encontrado`);
  }
  static conflicto(mensaje: string, detalles?: unknown) {
    return new ApiError(409, "CONFLICTO", mensaje, detalles);
  }
}
