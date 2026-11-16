// Tarjeta de producto del catálogo (imagen o marcador por categoría, precio y botón de apartar)
import { Link } from "react-router-dom";
import { pesos, Producto } from "../api/cliente";
import { useCarrito } from "../context/Carrito";
import { IconoBolsa, IconoCategoria } from "./Iconos";

const tonos: Record<string, string> = {
  comida: "bg-amber-50 text-amber-600/40",
  ropa: "bg-bruja-50 text-bruja/30",
  accesorios: "bg-rosa-100 text-carmin/30",
};

export function ImagenProducto({ p, alto = "h-44" }: { p: Producto; alto?: string }) {
  return p.imagenUrl ? (
    <img src={p.imagenUrl} alt={p.nombre} className={`${alto} w-full object-cover`} />
  ) : (
    <div className={`${alto} flex w-full items-center justify-center ${tonos[p.categoria.slug] ?? "bg-bruja-50 text-bruja/30"}`}>
      <IconoCategoria slug={p.categoria.slug} />
    </div>
  );
}

export function Disponibilidad({ existencias }: { existencias: number }) {
  if (existencias === 0) return <span className="rounded-full bg-plum/5 px-2.5 py-0.5 text-[11px] font-medium text-plum/50">Agotado</span>;
  if (existencias <= 3) return <span className="rounded-full bg-carmin-50 px-2.5 py-0.5 text-[11px] font-medium text-carmin">Últimas {existencias}</span>;
  return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">Disponible</span>;
}

export default function TarjetaProducto({ p }: { p: Producto }) {
  const { agregar } = useCarrito();
  return (
    <article className="tarjeta overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/producto/${p.id}`}><ImagenProducto p={p} /></Link>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-bruja">{p.categoria.nombre}</span>
          <Disponibilidad existencias={p.existencias} />
        </div>
        <Link to={`/producto/${p.id}`} className="mt-1.5 block text-[14px] font-medium leading-snug hover:text-bruja">{p.nombre}</Link>
        <p className="text-[12px] text-plum/50">por {p.emprendedor.nombreMarca}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[17px] font-semibold">{pesos(p.precio)}</span>
          <button onClick={() => agregar(p)} disabled={p.existencias === 0}
            className="flex h-8 items-center gap-1 rounded-full bg-carmin px-3.5 text-[12px] font-semibold text-white hover:bg-carmin-700 disabled:opacity-40">
            <IconoBolsa className="h-3.5 w-3.5" /> Apartar
          </button>
        </div>
      </div>
    </article>
  );
}
