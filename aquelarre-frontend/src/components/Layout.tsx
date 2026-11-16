// Estructura común: aviso superior, encabezado con navegación y pie de página
import { FormEvent, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/Carrito";
import { useSesion } from "../context/Sesion";
import { IconoBolsa, IconoBuscar, IconoUbicacion, IconoUsuario } from "./Iconos";

const enlace = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 ${isActive ? "border-bruja font-semibold text-bruja" : "border-transparent text-plum/70 hover:text-plum"}`;

export default function Layout() {
  const { piezas } = useCarrito();
  const { usuario, salir } = useSesion();
  const [busqueda, setBusqueda] = useState("");
  const navegar = useNavigate();

  function buscar(e: FormEvent) {
    e.preventDefault();
    navegar(`/catalogo?q=${encodeURIComponent(busqueda.trim())}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-8 items-center justify-center gap-2 bg-plum px-4 text-[12px] text-rosa-200">
        <IconoUbicacion className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Aparta en línea y recoge en Av. Preparatoria 208, Zacatecas · Pagas al recoger</span>
        <span className="sm:hidden">Aparta en línea · Pagas al recoger</span>
      </div>
      <header className="sticky top-0 z-10 border-b border-bruja-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src="/logo-circle.png" alt="" className="h-10 w-10 rounded-full" />
            <div className="leading-none">
              <div className="font-display text-[22px] font-bold tracking-wide">Aquelarre</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-plum/50">Showroom</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-[14px] md:flex">
            <NavLink to="/" end className={enlace}>Inicio</NavLink>
            <NavLink to="/catalogo" className={enlace}>Catálogo</NavLink>
            {usuario && <NavLink to="/mi-cuenta" className={enlace}>Mis apartados</NavLink>}
          </nav>
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <form onSubmit={buscar} className="hidden h-9 w-56 items-center gap-2 rounded-full border border-bruja-100 bg-bruja-50 px-4 lg:flex">
              <IconoBuscar className="h-4 w-4 text-plum/40" />
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar productos" aria-label="Buscar productos"
                className="w-full bg-transparent text-[13px] outline-none placeholder:text-plum/45" />
            </form>
            {usuario ? (
              <div className="flex items-center gap-2 text-[13px]">
                <IconoUsuario className="h-5 w-5 text-bruja" />
                <span className="hidden sm:inline">{usuario.nombre.split(" ")[0]}</span>
                <button onClick={salir} className="text-plum/50 underline-offset-2 hover:underline">Salir</button>
              </div>
            ) : (
              <Link to="/entrar" className="flex items-center gap-2 text-[14px] text-plum/80 hover:text-plum">
                <IconoUsuario /> <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
            <Link to="/carrito" className="flex h-9 items-center gap-2 rounded-full bg-bruja pl-4 pr-1.5 text-[13px] font-medium text-white hover:bg-bruja-700">
              <IconoBolsa className="h-4 w-4" /> <span className="hidden sm:inline">Apartado</span>
              <span aria-label="piezas en el apartado" className="grid h-6 min-w-6 place-items-center rounded-full bg-rosa px-1.5 text-[12px] font-bold text-plum">{piezas}</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-12 bg-plum py-8 text-[13px] text-rosa-100/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="font-display text-[18px] text-rosa-100">Aquelarre Showroom</div>
          <div>Av. Preparatoria 208, Col. Hidráulica, Zacatecas · Martes a domingo de 11:00 a 20:00</div>
        </div>
      </footer>
    </div>
  );
}
