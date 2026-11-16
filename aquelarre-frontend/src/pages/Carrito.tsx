// Carrito de apartado + formulario de confirmación: POST /api/apartados
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Apartado, api, ApiError, pesos } from "../api/cliente";
import { MensajeError, Vacio } from "../components/Estados";
import { IconoBasura } from "../components/Iconos";
import { ImagenProducto } from "../components/TarjetaProducto";
import { useCarrito } from "../context/Carrito";
import { useSesion } from "../context/Sesion";

export default function Carrito() {
  const { renglones, total, cambiar, quitar, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [form, setForm] = useState({ nombreCliente: usuario?.nombre ?? "", telefonoCliente: usuario?.telefono ?? "", notas: "" });

  const crear = useMutation({
    mutationFn: () =>
      api<Apartado>("/apartados", {
        metodo: "POST",
        cuerpo: {
          nombreCliente: form.nombreCliente.trim(),
          telefonoCliente: form.telefonoCliente.trim(),
          ...(form.notas.trim() && { notas: form.notas.trim() }),
          productos: renglones.map((r) => ({ productoId: r.producto.id, cantidad: r.cantidad })),
        },
      }),
    onSuccess: ({ data }) => {
      vaciar();
      navegar(`/confirmacion/${data.folio}`, { state: data });
    },
  });

  const errores = crear.error instanceof ApiError ? crear.error.porCampo() : {};

  function enviar(e: FormEvent) {
    e.preventDefault();
    crear.mutate();
  }

  if (renglones.length === 0)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Vacio titulo="Tu apartado está vacío">
          <p className="text-[14px] text-plum/60">Agrega productos desde el catálogo para apartarlos.</p>
          <Link to="/catalogo" className="btn-bruja mt-2">Ir al catálogo</Link>
        </Vacio>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-[32px] font-bold">Mi apartado</h1>
      <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_380px]">
        <div className="tarjeta divide-y divide-bruja-100">
          {renglones.map(({ producto: p, cantidad }) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-20 shrink-0 overflow-hidden rounded-xl"><ImagenProducto p={p} alto="h-20" /></div>
              <div className="min-w-0 flex-1">
                <Link to={`/producto/${p.id}`} className="font-medium hover:text-bruja">{p.nombre}</Link>
                <div className="text-[12px] text-plum/50">{p.emprendedor.nombreMarca} · {pesos(p.precio)} c/u</div>
              </div>
              <select value={cantidad} onChange={(e) => cambiar(p.id, Number(e.target.value))} className="campo w-20" aria-label={`Cantidad de ${p.nombre}`}>
                {Array.from({ length: Math.min(10, p.existencias) }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
              </select>
              <div className="w-24 text-right font-semibold">{pesos(p.precio * cantidad)}</div>
              <button onClick={() => quitar(p.id)} className="text-plum/40 hover:text-carmin" aria-label={`Quitar ${p.nombre}`}><IconoBasura /></button>
            </div>
          ))}
        </div>

        <form onSubmit={enviar} className="tarjeta flex flex-col gap-4 self-start p-6" noValidate>
          <h2 className="text-[17px] font-semibold">Datos para recoger</h2>
          <div>
            <label className="etiqueta" htmlFor="nombre">Nombre de quien recoge</label>
            <input id="nombre" className="campo" value={form.nombreCliente} onChange={(e) => setForm({ ...form, nombreCliente: e.target.value })} />
            {errores.nombreCliente && <p className="mt-1 text-[12px] text-carmin">{errores.nombreCliente}</p>}
          </div>
          <div>
            <label className="etiqueta" htmlFor="telefono">Teléfono (10 dígitos)</label>
            <input id="telefono" inputMode="numeric" className="campo" value={form.telefonoCliente} onChange={(e) => setForm({ ...form, telefonoCliente: e.target.value })} />
            {errores.telefonoCliente && <p className="mt-1 text-[12px] text-carmin">{errores.telefonoCliente}</p>}
          </div>
          <div>
            <label className="etiqueta" htmlFor="notas">Notas (opcional)</label>
            <textarea id="notas" rows={2} maxLength={255} className="campo h-auto py-2" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
          </div>
          <div className="flex items-center justify-between border-t border-bruja-100 pt-4">
            <span className="text-[14px] text-plum/60">Total a pagar en tienda</span>
            <span className="text-[22px] font-semibold">{pesos(total)}</span>
          </div>
          {crear.error && !Object.keys(errores).length && <MensajeError error={crear.error} />}
          {crear.error instanceof ApiError && crear.error.status === 409 && Array.isArray(crear.error.detalles) && (
            <p className="text-[12px] text-carmin">Ajusta las cantidades: alguien apartó piezas antes que tú.</p>
          )}
          <button className="btn-carmin h-11" disabled={crear.isPending}>{crear.isPending ? "Apartando…" : "Confirmar apartado"}</button>
          <p className="text-[12px] text-plum/50">{usuario ? `El apartado quedará en tu historial, ${usuario.nombre.split(" ")[0]}.` : "Puedes apartar sin cuenta; inicia sesión para guardar tu historial."}</p>
        </form>
      </div>
    </div>
  );
}
