// Estado global de la sesión: usuario actual, login, registro y cierre de sesión
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api, guardarToken, Usuario } from "../api/cliente";

interface Sesion {
  usuario: Usuario | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  registro: (datos: { nombre: string; correo: string; contrasena: string; telefono?: string }) => Promise<void>;
  salir: () => void;
}

const Contexto = createContext<Sesion | null>(null);

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Si hay un token guardado, se recupera el perfil al recargar la página
  useEffect(() => {
    if (!sessionStorage.getItem("aq_token")) return setCargando(false);
    api<Usuario>("/auth/perfil")
      .then((r) => setUsuario(r.data))
      .catch(() => guardarToken(null))
      .finally(() => setCargando(false));
  }, []);

  async function entrar(ruta: string, cuerpo: unknown) {
    const { data } = await api<{ usuario: Usuario; token: string }>(ruta, { metodo: "POST", cuerpo });
    guardarToken(data.token);
    setUsuario(data.usuario);
  }

  const valor: Sesion = {
    usuario,
    cargando,
    login: (correo, contrasena) => entrar("/auth/login", { correo, contrasena }),
    registro: (datos) => entrar("/auth/registro", datos),
    salir: () => {
      guardarToken(null);
      setUsuario(null);
    },
  };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  return c;
}
