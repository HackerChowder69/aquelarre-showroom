// Genera el folio del apartado a partir de su id: 124 -> "AQ-000124"
export function generarFolio(id: number): string {
  return `AQ-${String(id).padStart(6, "0")}`;
}

// Suma días naturales a una fecha (vigencia del apartado)
export function sumarDias(fecha: Date, dias: number): Date {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}
