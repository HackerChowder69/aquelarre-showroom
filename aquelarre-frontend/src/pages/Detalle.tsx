// Detalle de un producto: GET /api/productos/:id
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError, InfoLocal, pesos, Producto } from "../api/cliente";
import { Cargando, MensajeError, Vacio } from "../components/Estados";
import { IconoBolsa } from "../components/Iconos";
import { Disponibilidad, ImagenProducto } from "../components/TarjetaProducto";
import { useCarrito } from "../context/Carrito";

export default function Detalle() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const navegar = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const { data, isLoading, error } = useQuery({ queryKey: ["producto", id], queryFn: () => api<Producto>(`/productos/${id}`) });
  const local = useQuery({ queryKey: ["local"], queryFn: () => api<InfoLocal>("/local"), staleTime: 5 * 60_000 });
  const dias = local.data?.data.diasVigenciaApartado ?? 3;

  if (isLoading) return <div className="mx-auto max-w-6xl px-4"><Cargando /></div>;
  if (error instanceof ApiError && error.status === 404)
    return <div className="mx-auto max-w-3xl px-4 py-10"><Vacio titulo="Producto no encontrado"><Link to="/catalogo" className="btn-bruja">Volver al catálogo</Link></Vacio></div>;
  if (error || !data) return <div className="mx-auto max-w-6xl px-4"><MensajeError error={error} /></div>;

  const p = data.data;
  const maximo = Math.min(10, p.existencias);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 text-[12px] text-plum/50">
        <Link to="/" className="hover:underline">Inicio</Link> / <Link to={`/catalogo?categoria=${p.categoria.slug}`} className="hover:underline">{p.categoria.nombre}</Link> / {p.nombre}
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="tarjeta overflow-hidden"><ImagenProducto p={p} alto="h-96" /></div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bruja">{p.categoria.nombre}</span>
          <h1 className="mt-2 font-display text-[34px] font-bold leading-tight">{p.nombre}</h1>
          <p className="mt-1 text-[14px] text-plum/60">por <span className="font-medium text-plum">{p.emprendedor.nombreMarca}</span>{p.emprendedor.instagram && ` · ${p.emprendedor.instagram}`}</p>
          <div className="mt-5 flex items-center gap-4">
            <span className="text-[30px] font-semibold">{pesos(p.precio)}</span>
            <Disponibilidad existencias={p.existencias} />
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-plum/75">{p.descripcion ?? "Producto elaborado por un emprendedor local del bazar Aquelarre."}</p>

          {p.existencias > 0 ? (
            <div className="mt-7 flex items-center gap-3">
              <label className="sr-only" htmlFor="cantidad">Cantidad</label>
              <select id="cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="campo w-24 rounded-full">
                {Array.from({ length: maximo }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
              </select>
              <button className="btn-carmin" onClick={() => { agregar(p, cantidad); navegar("/carrito"); }}>
                <IconoBolsa className="h-4 w-4" /> Agregar al apartado
              </button>
            </div>
          ) : (
            <p className="mt-7 text-[14px] font-medium text-plum/60">Este producto está agotado por ahora.</p>
          )}
          <div className="mt-8 rounded-xl bg-rosa-50 p-4 text-[13px] text-plum/70">
            Los apartados se recogen y se pagan en el local. Tu apartado se guarda durante {dias} días a partir de que lo confirmas.
          </div>
        </div>
      </div>
    </div>
  );
}
