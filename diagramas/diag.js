// Renderizador de diagramas (secuencia y E-R) en SVG con el estilo de la documentación Aquelarre
const C = {
  morado: "#5B3A82", moradoOsc: "#3E2760", lavanda: "#F4EFF9", lila: "#D9CBEA",
  rosa: "#C2185B", rosaClaro: "#FCE4EC", gris: "#6B6475", tinta: "#241B30", verde: "#2E7D32", rojo: "#C62828",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function ajustarPagina(w, h) {
  const st = document.createElement("style");
  st.textContent = `@page{size:${w}px ${h}px;margin:0}html,body{margin:0;padding:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff}`;
  document.head.appendChild(st);
}

function textoMultilinea(x, y, lineas, attrs, lh = 15) {
  return lineas.map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(l)}</text>`).join("");
}

// ---------------- Diagrama de secuencia ----------------
function secuencia(spec) {
  const anchoP = 168, sep = spec.sep || 205, margen = 40, topP = 78, altoP = 58;
  const xs = {};
  spec.participantes.forEach((p, i) => (xs[p.id] = margen + anchoP / 2 + i * sep));
  const ancho = margen * 2 + anchoP + (spec.participantes.length - 1) * sep;
  let y = topP + altoP + 34;
  let cuerpo = "";
  const marcos = [];

  function flecha(paso) {
    const x1 = xs[paso.de], x2 = xs[paso.a];
    const resp = paso.tipo === "res";
    const color = paso.color || (resp ? C.gris : C.tinta);
    const dash = resp ? 'stroke-dasharray="6 4"' : "";
    const lineas = Array.isArray(paso.texto) ? paso.texto : [paso.texto];
    if (x1 === x2) {
      const h = 26 + (lineas.length - 1) * 14;
      cuerpo += `<path d="M${x1} ${y} h44 v${h} h-38" fill="none" stroke="${color}" stroke-width="1.6" marker-end="url(#pf)"/>`;
      cuerpo += textoMultilinea(x1 + 52, y + 8, lineas, `font-size="12.5" fill="${C.tinta}"`, 14);
      y += h + 26;
      return;
    }
    const izq = Math.min(x1, x2), der = Math.max(x1, x2);
    const ty = y - 13 - (lineas.length - 1) * 14;
    cuerpo += textoMultilinea((izq + der) / 2, ty, lineas, `font-size="12.5" text-anchor="middle" fill="${resp ? C.gris : C.tinta}" ${paso.negrita ? 'font-weight="600"' : ""}`, 14);
    cuerpo += `<line x1="${x1}" y1="${y}" x2="${x2 + (x2 > x1 ? -3 : 3)}" y2="${y}" stroke="${color}" stroke-width="1.6" ${dash} marker-end="url(#${resp ? "pr" : "pf"})"/>`;
    if (paso.num) cuerpo += `<circle cx="${x1 + (x2 > x1 ? 14 : -14)}" cy="${y}" r="9" fill="${C.morado}"/><text x="${x1 + (x2 > x1 ? 14 : -14)}" y="${y + 4}" font-size="10.5" fill="#fff" text-anchor="middle" font-weight="700" style="stroke:none">${paso.num}</text>`;
    y += 40 + (lineas.length - 1) * 4;
  }

  function nota(paso) {
    const ids = paso.sobre;
    const x1 = Math.min(...ids.map((i) => xs[i])) - 70, x2 = Math.max(...ids.map((i) => xs[i])) + 70;
    const lineas = Array.isArray(paso.nota) ? paso.nota : [paso.nota];
    const h = 14 + lineas.length * 15;
    cuerpo += `<rect x="${x1}" y="${y - 12}" width="${x2 - x1}" height="${h}" rx="4" fill="#FFF8E1" stroke="#E0B84C"/>`;
    cuerpo += textoMultilinea((x1 + x2) / 2, y + 5, lineas, `font-size="12" text-anchor="middle" fill="#5D4A12"`);
    y += h + 18;
  }

  function procesar(pasos, nivel) {
    for (const paso of pasos) {
      if (paso.marco) {
        const inicio = y - 22;
        const ramas = [];
        y += 22;
        paso.ramas.forEach((r, i) => {
          if (i > 0) { ramas.push({ y: y - 16, guarda: r.guarda }); y += 16; }
          else ramas.push({ y: inicio, guarda: r.guarda, primera: true });
          procesar(r.pasos, nivel + 1);
        });
        marcos.push({ tipo: paso.marco, inicio, fin: y - 12, ramas, nivel });
        y += 14;
      } else if (paso.nota) nota(paso);
      else flecha(paso);
    }
  }
  procesar(spec.pasos, 0);
  const fin = y + 10;

  let svgMarcos = "";
  for (const m of marcos) {
    const x1 = 18 + m.nivel * 10, x2 = ancho - 18 - m.nivel * 10;
    svgMarcos += `<rect x="${x1}" y="${m.inicio}" width="${x2 - x1}" height="${m.fin - m.inicio}" fill="none" stroke="${C.morado}" stroke-width="1.2" rx="3"/>`;
    svgMarcos += `<path d="M${x1} ${m.inicio} h48 v14 l-8 8 h-40 z" fill="${C.morado}"/><text x="${x1 + 8}" y="${m.inicio + 15}" font-size="12" font-weight="700" fill="#fff" style="stroke:none">${m.tipo}</text>`;
    m.ramas.forEach((r) => {
      if (!r.primera) svgMarcos += `<line x1="${x1}" y1="${r.y}" x2="${x2}" y2="${r.y}" stroke="${C.morado}" stroke-dasharray="5 4"/>`;
      svgMarcos += `<text x="${x1 + 58}" y="${r.y + 16}" font-size="12" font-style="italic" font-weight="600" fill="${C.morado}">[${esc(r.guarda)}]</text>`;
    });
  }

  let svgP = "";
  for (const p of spec.participantes) {
    const x = xs[p.id];
    svgP += `<line x1="${x}" y1="${topP + altoP}" x2="${x}" y2="${fin}" stroke="${C.lila}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
    const relleno = p.tipo === "db" ? C.lavanda : p.tipo === "actor" ? C.rosaClaro : "#fff";
    const borde = p.tipo === "actor" ? C.rosa : C.morado;
    if (p.tipo === "db") {
      svgP += `<path d="M${x - 70} ${topP + 10} v${altoP - 18} a70 10 0 0 0 140 0 v-${altoP - 18}" fill="${relleno}" stroke="${borde}" stroke-width="1.6"/><ellipse cx="${x}" cy="${topP + 10}" rx="70" ry="10" fill="${C.lila}" stroke="${borde}" stroke-width="1.6"/>`;
    } else {
      svgP += `<rect x="${x - anchoP / 2}" y="${topP}" width="${anchoP}" height="${altoP}" rx="10" fill="${relleno}" stroke="${borde}" stroke-width="1.6"/>`;
    }
    const dy = p.tipo === "db" ? 10 : 0;
    svgP += `<text style="stroke:none" x="${x}" y="${topP + 27 + dy}" font-size="14" font-weight="700" text-anchor="middle" fill="${C.tinta}">${esc(p.nombre)}</text>`;
    if (p.sub) svgP += `<text style="stroke:none" x="${x}" y="${topP + 45 + dy}" font-size="11.5" text-anchor="middle" fill="${C.gris}">${esc(p.sub)}</text>`;
  }

  const titulo = `<text x="${margen - 18}" y="40" font-size="20" font-weight="700" fill="${C.tinta}">${esc(spec.titulo)}</text>` +
    (spec.subtitulo ? `<text x="${margen - 18}" y="60" font-size="13" fill="${C.gris}">${esc(spec.subtitulo)}</text>` : "");
  const defs = `<defs><marker id="pf" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.tinta}"/></marker><marker id="pr" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="none" stroke="${C.gris}" stroke-width="1.6"/></marker></defs>`;
  const alto = fin + 20;
  ajustarPagina(ancho, alto);
  document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" font-family="Poppins, 'Segoe UI', sans-serif"><style>text{paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}</style>${defs}<rect width="100%" height="100%" fill="#fff"/>${titulo}${svgMarcos}${svgP}${cuerpo}</svg>`;
}
