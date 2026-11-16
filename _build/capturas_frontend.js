// Recorre el FrontEnd con Microsoft Edge (playwright-core) y guarda capturas para la documentación.
// Uso: node capturas_frontend.js <carpeta_playwright_core> <carpeta_salida> [url]
const { chromium } = require(require("path").join(process.argv[2], "node_modules", "playwright-core"));
const SAL = process.argv[3];
const URL = process.argv[4] || "http://localhost:5173";

(async () => {
  const navegador = await chromium.launch({ channel: "msedge", headless: true });
  const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  const errores = [];
  pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  pagina.on("pageerror", (e) => errores.push(e.message));
  const foto = async (nombre, opciones = {}) => {
    await pagina.waitForLoadState("networkidle");
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.screenshot({ path: `${SAL}/${nombre}.png`, ...opciones });
    console.log("captura", nombre);
  };

  await pagina.goto(URL + "/");
  await foto("fe_01_inicio", { fullPage: true });

  await pagina.goto(URL + "/catalogo?categoria=accesorios&orden=precio_asc");
  await foto("fe_02_catalogo", { fullPage: true });

  await pagina.goto(URL + "/producto/3");
  await foto("fe_03_detalle");

  // Inicio de sesión con contraseña incorrecta (401) y luego correcta
  await pagina.goto(URL + "/entrar");
  await pagina.fill("#correo", "ana@correo.com");
  await pagina.fill("#contrasena", "incorrecta1");
  await pagina.click("button:has-text('Entrar')");
  await pagina.waitForSelector("[role=alert]");
  await foto("fe_04_login_error");
  await pagina.fill("#contrasena", "secreta123");
  await pagina.click("button:has-text('Entrar')");
  await pagina.waitForURL("**/mi-cuenta");

  // Agrega productos al apartado desde el catálogo
  await pagina.goto(URL + "/catalogo?categoria=accesorios&orden=precio_asc");
  await pagina.waitForLoadState("networkidle");
  const botones = pagina.locator("article button:has-text('Apartar'):not([disabled])");
  await botones.nth(0).click();
  await botones.nth(1).click();
  await pagina.goto(URL + "/producto/7");
  await pagina.waitForSelector("#cantidad");
  await pagina.selectOption("#cantidad", "2");
  await pagina.click("button:has-text('Agregar al apartado')");
  await pagina.waitForURL("**/carrito");

  // Validación del BackEnd (422) mostrada debajo del campo
  await pagina.fill("#telefono", "492123");
  await pagina.click("button:has-text('Confirmar apartado')");
  await pagina.waitForSelector("text=El teléfono debe tener 10 dígitos");
  await foto("fe_05_carrito_validacion");

  await pagina.fill("#telefono", "4921234567");
  await pagina.fill("#notas", "Paso el sábado por la tarde");
  await pagina.click("button:has-text('Confirmar apartado')");
  await pagina.waitForURL("**/confirmacion/**");
  await foto("fe_06_confirmacion", { fullPage: true });

  await pagina.goto(URL + "/mi-cuenta");
  await pagina.waitForSelector("article");
  await foto("fe_07_mis_apartados");

  // Vista en celular
  const movil = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await movil.goto(URL + "/catalogo");
  await movil.waitForLoadState("networkidle");
  await movil.evaluate(() => document.fonts.ready);
  const desborde = await movil.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log("desplazamiento horizontal en celular (px):", desborde);
  await movil.screenshot({ path: `${SAL}/fe_08_movil.png` });
  console.log("captura fe_08_movil");

  console.log("errores de consola:", errores.length ? errores : "ninguno");
  await navegador.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
