// Íconos de trazo (estilo Lucide) usados en la interfaz
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };
type P = { className?: string };

export const IconoBolsa = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
export const IconoBuscar = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IconoUsuario = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
export const IconoUbicacion = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const IconoCheck = ({ className = "w-6 h-6" }: P) => (
  <svg {...base} className={className}><path d="M20 6 9 17l-5-5" /></svg>
);
export const IconoBasura = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);

// Ícono por categoría para el marcador de imagen cuando el producto aún no tiene foto
export const IconoCategoria = ({ slug, className = "w-12 h-12" }: P & { slug: string }) => {
  if (slug === "comida")
    return <svg {...base} className={className}><path d="M2 12h20" /><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" /><path d="m4 8 16-4" /><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" /></svg>;
  if (slug === "ropa")
    return <svg {...base} className={className}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>;
  return <svg {...base} className={className}><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg>;
};
