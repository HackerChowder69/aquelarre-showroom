// Punto de entrada del FrontEnd: proveedores globales y rutas de la aplicación
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { ProveedorCarrito } from "./context/Carrito";
import { ProveedorSesion } from "./context/Sesion";
import Carrito from "./pages/Carrito";
import Catalogo from "./pages/Catalogo";
import Confirmacion from "./pages/Confirmacion";
import Detalle from "./pages/Detalle";
import Entrar from "./pages/Entrar";
import Inicio from "./pages/Inicio";
import MiCuenta from "./pages/MiCuenta";
import "./index.css";

const clienteConsultas = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/catalogo", element: <Catalogo /> },
      { path: "/producto/:id", element: <Detalle /> },
      { path: "/carrito", element: <Carrito /> },
      { path: "/confirmacion/:folio", element: <Confirmacion /> },
      { path: "/entrar", element: <Entrar /> },
      { path: "/mi-cuenta", element: <MiCuenta /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={clienteConsultas}>
      <ProveedorSesion>
        <ProveedorCarrito>
          <RouterProvider router={router} />
        </ProveedorCarrito>
      </ProveedorSesion>
    </QueryClientProvider>
  </StrictMode>,
);
