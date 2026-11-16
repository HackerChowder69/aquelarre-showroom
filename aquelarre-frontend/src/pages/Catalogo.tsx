// Catálogo: los filtros viven en la URL y se envían al API como parámetros de consulta
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api, Categoria, Producto } from "../api/cliente";
import { Cargando, MensajeError, Vacio } from "../components/Estados";
import TarjetaProducto from "../components/TarjetaProducto";

const ORDENES = [
  ["recientes", "Más recientes"],
  ["precio_asc", "Precio: menor a mayor"],
  ["precio_desc", "Precio: mayor a menor"],
  ["nombre", "Nombre (A–Z)"],
];

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const categoria = params.get("categoria") ?? "";
  const q = params.get("q") ?? "";
  const orden = params.get("orden") ?? "recientes";
  const pagina = Number(params.get("pagina") ?? 1);

  const consulta = new URLSearchParams({ orden, pagina: String(pagina), limite: "9" });
  if (categoria) consulta.set("categoria", categoria);
  if (q) consulta.set("q", q);

  const productos = useQuery({
    queryKey: ["productos", consulta.toString()],
    queryFn: () => api<Producto[]>(`/productos?${consulta}`),
    placeholderData: keepPreviousData,
  });
  const categorias = useQuery({ queryKey: ["categorias"], queryFn: () => api<Categoria[]>("/categorias") });

  function cambiar(clave: string, valor: string) {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    if (clave !== "pagina") nuevos.delete("pagina");
    setParams(nuevos);
  }

  const meta = productos.data?.meta;
  const nombreCategoria = categorias.data?.data.find((c) => c.slug === categoria)?.nombre;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-none">Catálogo</h1>
          <p className="mt-2 text-[13px] text-plum/55">
            {meta ? `${meta.total} producto${meta.total === 1 ? "" : "s"} encontrado${meta.total === 1 ? "" : "s"}` : " "}
            {nombreCategoria && ` · ${nombreCategoria}`}
            {q && ` · «${q}»`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <input defaultValue={q} key={q} placeholder="Buscar por nombre" aria-label="Buscar por nombre" className="campo rounded-full sm:w-60"
            onKeyDown={(e) => e.key === "Enter" && cambiar("q", e.currentTarget.value.trim())} />
          <select value={orden} onChange={(e) => cambiar("orden", e.target.value)} className="campo rounded-full sm:w-auto" aria-label="Ordenar">
            {ORDENES.map(([v, t]) => <option key={v} value={v}>Ordenar: {t}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-7 md:flex-row">
        <aside className="tarjeta flex w-full shrink-0 flex-col gap-2 self-start p-5 md:w-56">
          <div className="etiqueta">Categoría</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:flex-col">
            {[{ slug: "", nombre: "Todas", id: 0 }, ...(categorias.data?.data ?? [])].map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-[14px] text-plum/80">
                <input type="radio" name="categoria" checked={categoria === c.slug} onChange={() => cambiar("categoria", c.slug)} className="accent-bruja" />
                {c.nombre}
              </label>
            ))}
          </div>
          {(categoria || q) && (
            <button onClick={() => setParams({})} className="mt-3 text-left text-[13px] font-medium text-carmin hover:underline">Limpiar filtros</button>
          )}
        </aside>

        <div className="flex-1">
          {productos.isLoading && <Cargando texto="Cargando productos…" />}
          {productos.error && <MensajeError error={productos.error} />}
          {productos.data?.data.length === 0 && (
            <Vacio titulo="Sin resultados"><p className="text-[14px] text-plum/60">Prueba con otra búsqueda o categoría.</p></Vacio>
          )}
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${productos.isPlaceholderData ? "opacity-60" : ""}`}>
            {productos.data?.data.map((p) => <TarjetaProducto key={p.id} p={p} />)}
          </div>
          {meta && meta.paginas > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: meta.paginas }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => cambiar("pagina", String(n))}
                  className={`h-9 w-9 rounded-full text-[13px] font-semibold ${n === pagina ? "bg-bruja text-white" : "border border-bruja-200 bg-white"}`}>{n}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
