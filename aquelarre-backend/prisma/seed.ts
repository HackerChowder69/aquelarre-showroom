// Datos iniciales: administrador, categorías, emprendedores, productos e información del local
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { correo: "admin@aquelarre.mx" },
    update: {},
    create: {
      nombre: "Administrador Aquelarre",
      correo: "admin@aquelarre.mx",
      contrasenaHash: await bcrypt.hash("Admin123*", 10),
      rol: "ADMIN",
    },
  });

  const categorias = [
    { nombre: "Comida", slug: "comida", descripcion: "Postres, botanas y antojitos de emprendedores locales" },
    { nombre: "Ropa", slug: "ropa", descripcion: "Prendas de diseño independiente" },
    { nombre: "Accesorios", slug: "accesorios", descripcion: "Joyería, bolsas y complementos" },
  ];
  for (const c of categorias) {
    await prisma.categoria.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const emprendedores = [
    { nombreMarca: "Luna Bruja Repostería", responsable: "Daniela R.", instagram: "@lunabruja.zac" },
    { nombreMarca: "Hilo Negro", responsable: "Mariana T.", instagram: "@hilonegro.mx" },
    { nombreMarca: "Plata Salvaje", responsable: "Fernanda G.", instagram: "@platasalvaje" },
  ];
  for (const e of emprendedores) {
    await prisma.emprendedor.upsert({ where: { nombreMarca: e.nombreMarca }, update: {}, create: e });
  }

  const cat = Object.fromEntries((await prisma.categoria.findMany()).map((c) => [c.slug, c.id]));
  const emp = Object.fromEntries((await prisma.emprendedor.findMany()).map((e) => [e.nombreMarca, e.id]));

  if ((await prisma.producto.count()) === 0) {
    await prisma.producto.createMany({
      data: [
        { nombre: "Galletas de calabaza (6 pzas)", precio: 85, existencias: 20, destacado: true, categoriaId: cat.comida, emprendedorId: emp["Luna Bruja Repostería"] },
        { nombre: "Brownie de chocolate amargo", precio: 45, existencias: 30, categoriaId: cat.comida, emprendedorId: emp["Luna Bruja Repostería"] },
        { nombre: "Blusa bordada a mano", precio: 420, existencias: 6, destacado: true, categoriaId: cat.ropa, emprendedorId: emp["Hilo Negro"] },
        { nombre: "Falda midi negra", precio: 380, existencias: 4, categoriaId: cat.ropa, emprendedorId: emp["Hilo Negro"] },
        { nombre: "Aretes de luna en plata", precio: 290, existencias: 10, destacado: true, categoriaId: cat.accesorios, emprendedorId: emp["Plata Salvaje"] },
        { nombre: "Collar de cuarzo", precio: 350, existencias: 2, categoriaId: cat.accesorios, emprendedorId: emp["Plata Salvaje"] },
      ],
    });
  }

  await prisma.informacionLocal.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: "Aquelarre Showroom",
      direccion: "Av. Preparatoria 208, Col. Hidráulica, Zacatecas, Zac.",
      horarioAtencion: "Martes a domingo de 11:00 a 20:00",
      instagramUrl: "https://www.instagram.com/aquelarre_showroom/",
      diasVigenciaApartado: 3,
    },
  });
  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
