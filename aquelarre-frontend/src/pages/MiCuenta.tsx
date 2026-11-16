// Historial de apartados del cliente: GET /api/apartados/mis-apartados (requiere sesión)
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { Apartado, api, pesos } from "../api/cliente";
import { Cargando, MensajeError, Vacio } from "../components/Estados";
import { useSesion } from "../context/Sesion";

const estilos: Record<string, string> = {
  PENDIENTE: "bg-amber-50 text-amber-700",
  LISTO: "bg-emerald-50 text-emerald-700",
  RECOGIDO: "bg-bruja-100 text-bruja",
  CANCELADO: "bg-plum/5 text-plum/50",
  EXPIRADO: "bg-carmin-50 text-carmin",
};
const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

export default function MiCuenta() {
  const { usuario, cargando } = useSesion();
  const { data, isLoading, error } = useQuery({
    queryKey: ["mis-apartados", usuario?.id],
    queryFn: () => api<Apartado[]>("/apartados/mis-apartados"),
    enabled: !!usuario,
  });

  if (cargando) return <div className="mx-auto max-w-5xl px-4"><Cargando /></div>;
  if (!usuario) return <Navigate to="/entrar" replace />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-[32px] font-bold">Mis apartados</h1>
      <p className="mt-1 text-[14px] text-plum/55">{usuario.nombre} · {usuario.correo}</p>
      {isLoading && <Cargando />}
      {error && <MensajeError error={error} />}
      {data?.data.length === 0 && (
        <div className="mt-6"><Vacio titulo="Aún no tienes apartados"><Link to="/catalogo" className="btn-bruja">Ver catálogo</Link></Vacio></div>
      )}
      <div className="mt-6 flex flex-col gap-4">
        {data?.data.map((a) => (
          <article key={a.id} className="tarjeta p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[18px] font-bold tracking-wider text-bruja">{a.folio}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${estilos[a.estado]}`}>{a.estado}</span>
              </div>
              <div className="text-[13px] text-plum/55">Apartado el {fecha(a.creadoEn)} · Recoger antes del {fecha(a.fechaLimite)}</div>
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <ul className="text-[14px] text-plum/75">
                {a.detalles.map((d) => <li key={d.producto.id}>{d.cantidad} × {d.producto.nombre}</li>)}
              </ul>
              <div className="text-[18px] font-semibold">{pesos(a.total)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
