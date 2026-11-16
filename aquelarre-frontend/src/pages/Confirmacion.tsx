// Confirmación del apartado: muestra el folio, el resumen y la fecha límite para recoger
import { Link, useLocation, useParams } from "react-router-dom";
import { Apartado, pesos } from "../api/cliente";
import { IconoCheck, IconoUbicacion } from "../components/Iconos";

export default function Confirmacion() {
  const { folio } = useParams();
  const apartado = useLocation().state as Apartado | null;
  const limite = apartado && new Date(apartado.fechaLimite).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="tarjeta overflow-hidden text-center">
        <div className="bg-gradient-to-br from-bruja to-bruja-700 px-6 py-10 text-white">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15"><IconoCheck className="h-7 w-7" /></span>
          <h1 className="mt-4 font-display text-[28px] font-bold">¡Apartado confirmado!</h1>
          <p className="mt-1 text-[14px] text-white/75">Muestra este folio en el local</p>
          <div className="mx-auto mt-5 inline-block rounded-2xl bg-white px-8 py-3 font-mono text-[32px] font-bold tracking-widest text-bruja">{folio}</div>
        </div>
        {apartado && (
          <div className="p-6 text-left">
            <div className="divide-y divide-bruja-100">
              {apartado.detalles.map((d) => (
                <div key={d.producto.id} className="flex justify-between py-2 text-[14px]">
                  <span>{d.cantidad} × {d.producto.nombre}</span><span className="font-medium">{pesos(d.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-bruja-200 pt-3 text-[16px] font-semibold">
              <span>Total a pagar en tienda</span><span>{pesos(apartado.total)}</span>
            </div>
            <div className="mt-5 flex gap-3 rounded-xl bg-rosa-50 p-4 text-[13px] text-plum/75">
              <IconoUbicacion className="mt-0.5 h-4 w-4 shrink-0 text-carmin" />
              <span>Recoge a más tardar el <b className="text-plum">{limite}</b> en Av. Preparatoria 208, Col. Hidráulica. Solo recolección en el local; pagas al recoger.</span>
            </div>
          </div>
        )}
        <div className="flex justify-center gap-3 pb-8">
          <Link to="/catalogo" className="btn-borde">Seguir viendo</Link>
          <Link to="/mi-cuenta" className="btn-bruja">Mis apartados</Link>
        </div>
      </div>
    </div>
  );
}
