// Inicio de sesión y registro: POST /api/auth/login y POST /api/auth/registro
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "../api/cliente";
import { MensajeError } from "../components/Estados";
import { useSesion } from "../context/Sesion";

export default function Entrar() {
  const { usuario, login, registro } = useSesion();
  const navegar = useNavigate();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "", telefono: "" });
  const [error, setError] = useState<unknown>(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/mi-cuenta" replace />;
  const errores = error instanceof ApiError ? error.porCampo() : {};
  const campo = (k: keyof typeof form) => ({ id: k, value: form[k], className: "campo", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }) });
  const aviso = (k: string) => errores[k] && <p className="mt-1 text-[12px] text-carmin">{errores[k]}</p>;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      if (modo === "login") await login(form.correo, form.contrasena);
      else await registro({ nombre: form.nombre, correo: form.correo, contrasena: form.contrasena, ...(form.telefono && { telefono: form.telefono }) });
      navegar("/mi-cuenta");
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div className="hidden flex-col justify-center md:flex">
        <img src="/logo-circle.png" alt="" className="w-40 rounded-full" />
        <h1 className="mt-6 font-display text-[34px] font-bold leading-tight">Bienvenida al aquelarre</h1>
        <p className="mt-3 text-[15px] text-plum/65">Con tu cuenta tus apartados quedan guardados y puedes revisar su estado cuando quieras.</p>
      </div>
      <form onSubmit={enviar} className="tarjeta flex flex-col gap-4 p-7" noValidate>
        <div className="grid grid-cols-2 rounded-full bg-bruja-50 p-1 text-[13px] font-semibold">
          {(["login", "registro"] as const).map((m) => (
            <button type="button" key={m} onClick={() => { setModo(m); setError(null); }}
              className={`h-9 rounded-full ${modo === m ? "bg-white text-bruja shadow-sm" : "text-plum/55"}`}>
              {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>
        {modo === "registro" && <div><label className="etiqueta" htmlFor="nombre">Nombre</label><input {...campo("nombre")} />{aviso("nombre")}</div>}
        <div><label className="etiqueta" htmlFor="correo">Correo</label><input type="email" autoComplete="email" {...campo("correo")} />{aviso("correo")}</div>
        <div>
          <label className="etiqueta" htmlFor="contrasena">Contraseña</label>
          <input type="password" autoComplete={modo === "login" ? "current-password" : "new-password"} {...campo("contrasena")} />
          {aviso("contrasena")}
          {modo === "registro" && !errores.contrasena && <p className="mt-1 text-[12px] text-plum/45">Mínimo 8 caracteres y al menos un número.</p>}
        </div>
        {modo === "registro" && <div><label className="etiqueta" htmlFor="telefono">Teléfono (opcional)</label><input inputMode="numeric" {...campo("telefono")} />{aviso("telefono")}</div>}
        {error !== null && !Object.keys(errores).length && <MensajeError error={error} />}
        <button className="btn-bruja h-11" disabled={enviando}>{enviando ? "Un momento…" : modo === "login" ? "Entrar" : "Crear cuenta"}</button>
      </form>
    </div>
  );
}
