// Estados de carga, error y vacío reutilizables
import { ApiError } from "../api/cliente";

export function Cargando({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <div className="flex items-center gap-3 py-8 text-[14px] text-plum/60" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-bruja-200 border-t-bruja" /> {texto}
    </div>
  );
}

export function MensajeError({ error }: { error: unknown }) {
  const mensaje = error instanceof ApiError ? error.message : "No se pudo conectar con el servidor. Intenta de nuevo.";
  return <div className="my-4 rounded-xl border border-carmin/20 bg-carmin-50 px-4 py-3 text-[14px] text-carmin-700" role="alert">{mensaje}</div>;
}

export function Vacio({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="tarjeta flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="font-display text-[22px] font-bold">{titulo}</div>
      {children}
    </div>
  );
}
