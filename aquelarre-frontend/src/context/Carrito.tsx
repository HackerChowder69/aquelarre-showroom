// Carrito de apartado: vive en el navegador (localStorage) hasta que se confirma el apartado
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Producto } from "../api/cliente";

export interface Renglon { producto: Producto; cantidad: number }

interface Carrito {
  renglones: Renglon[];
  piezas: number;
  total: number;
  agregar: (p: Producto, cantidad?: number) => void;
  cambiar: (id: number, cantidad: number) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
}

const Contexto = createContext<Carrito | null>(null);
const CLAVE = "aq_carrito";

function leer(): Renglon[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
  } catch {
    return [];
  }
}

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [renglones, setRenglones] = useState<Renglon[]>(leer);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(renglones));
    } catch {
      /* almacenamiento no disponible: el carrito sigue funcionando en memoria */
    }
  }, [renglones]);

  // Máximo 10 piezas por producto y nunca más de las existencias (misma regla que el BackEnd)
  const tope = (p: Producto, n: number) => Math.max(1, Math.min(n, 10, p.existencias));

  const valor: Carrito = {
    renglones,
    piezas: renglones.reduce((s, r) => s + r.cantidad, 0),
    total: renglones.reduce((s, r) => s + r.cantidad * r.producto.precio, 0),
    agregar: (p, cantidad = 1) =>
      setRenglones((rs) => {
        const existe = rs.find((r) => r.producto.id === p.id);
        if (existe) return rs.map((r) => (r.producto.id === p.id ? { ...r, cantidad: tope(p, r.cantidad + cantidad) } : r));
        return [...rs, { producto: p, cantidad: tope(p, cantidad) }];
      }),
    cambiar: (id, cantidad) => setRenglones((rs) => rs.map((r) => (r.producto.id === id ? { ...r, cantidad: tope(r.producto, cantidad) } : r))),
    quitar: (id) => setRenglones((rs) => rs.filter((r) => r.producto.id !== id)),
    vaciar: () => setRenglones([]),
  };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrito() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useCarrito debe usarse dentro de ProveedorCarrito");
  return c;
}
