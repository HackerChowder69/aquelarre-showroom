// Página de inicio: presentación del bazar, categorías y productos destacados
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api, Categoria, Producto } from "../api/cliente";
import { IconoCategoria } from "../components/Iconos";
import TarjetaProducto from "../components/TarjetaProducto";
import { Cargando, MensajeError } from "../components/Estados";

export default function Inicio() {
  const destacados = useQuery({ queryKey: ["productos", "destacados"], queryFn: () => api<Producto[]>("/productos?destacado=true&limite=3") });
  const categorias = useQuery({ queryKey: ["categorias"], queryFn: () => api<Categoria[]>("/categorias") });

  return (
    <>
      <section className="bg-gradient-to-br from-bruja-100 via-rosa-50 to-rosa-100">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-carmin">Bazar de emprendedores zacatecanos</p>
            <h1 className="mt-3 font-display text-[44px] font-bold leading-[1.05]">Lo hecho a mano, apartado en un clic</h1>
            <p className="mt-4 max-w-md text-[15px] text-plum/70">
              Explora comida, ropa y accesorios de marcas locales. Aparta en línea, recibe tu folio y paga cuando pases por ellos al local.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/catalogo" className="btn-bruja">Ver catálogo</Link>
              <a href="#como-funciona" className="btn-borde">¿Cómo funciona?</a>
            </div>
          </div>
          <img src="/logo-circle.png" alt="Logotipo de Aquelarre Showroom" className="mx-auto w-64 rounded-full shadow-xl shadow-bruja/20" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-[26px] font-bold">Categorías</h2>
        {categorias.isLoading && <Cargando />}
        {categorias.error && <MensajeError error={categorias.error} />}
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {categorias.data?.data.map((c) => (
            <Link key={c.id} to={`/catalogo?categoria=${c.slug}`} className="tarjeta flex items-center gap-4 p-5 hover:border-bruja-300">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-bruja-50 text-bruja"><IconoCategoria slug={c.slug} className="h-7 w-7" /></span>
              <span>
                <span className="block font-semibold">{c.nombre}</span>
                <span className="text-[12px] text-plum/55">{c._count?.productos ?? 0} productos</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[26px] font-bold">Destacados del bazar</h2>
          <Link to="/catalogo" className="text-[13px] font-medium text-bruja hover:underline">Ver todo</Link>
        </div>
        {destacados.isLoading && <Cargando />}
        {destacados.error && <MensajeError error={destacados.error} />}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.data?.data.map((p) => <TarjetaProducto key={p.id} p={p} />)}
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-10">
        <div className="tarjeta grid gap-6 p-8 sm:grid-cols-3">
          {[
            ["1", "Elige", "Agrega productos a tu apartado desde el catálogo."],
            ["2", "Aparta", "Confirma con tu nombre y teléfono y recibe un folio."],
            ["3", "Recoge", "Pasa al local, muestra tu folio y paga ahí mismo."],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-carmin font-bold text-white">{n}</span>
              <div><div className="font-semibold">{t}</div><p className="text-[13px] text-plum/60">{d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
