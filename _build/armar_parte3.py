# Arma ProyectoFinal_ParteIII a partir del .docx de la Parte II conservando su formato.
# Uso: python -I armar_parte3.py <carpeta Doc-Aquelarre> <carpeta de trabajo>
import json, os, re, shutil, sys, zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contenido import *  # noqa

RAIZ, TRAB = sys.argv[1], sys.argv[2]
ORIG = os.path.join(RAIZ, "ProyectoFinal_ParteII_Aquelarre_corta.docx")
BACK = os.path.join(RAIZ, "aquelarre-backend")
DIAG = os.path.join(RAIZ, "diagramas")
SAL = os.path.join(TRAB, "doc")
shutil.rmtree(SAL, ignore_errors=True)
zipfile.ZipFile(ORIG).extractall(SAL)

MORADO, MORADO_OSC, LAVANDA, BORDE = "5D417C", "3E2453", "F4EFF9", "C9BED3"
TEXTO_ANCHO = 8838


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def run(t, rpr=""):
    return f'<w:r>{f"<w:rPr>{rpr}</w:rPr>" if rpr else ""}<w:t xml:space="preserve">{esc(t)}</w:t></w:r>'


CODE_RPR = f'<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:color w:val="{MORADO}"/><w:sz w:val="19"/><w:szCs w:val="19"/>'


def rich(t, base=""):
    """**negritas** y `código` dentro de un párrafo."""
    out = ""
    for parte in re.split(r"(\*\*[^*]+\*\*|`[^`]+`)", t):
        if not parte:
            continue
        if parte.startswith("**"):
            out += run(parte[2:-2], base + "<w:b/><w:bCs/>")
        elif parte.startswith("`"):
            out += run(parte[1:-1], CODE_RPR)
        else:
            out += run(parte, base)
    return out


def P(t):
    return f'<w:p><w:pPr><w:spacing w:after="120"/><w:jc w:val="both"/></w:pPr>{rich(t)}</w:p>'


def SUB(t):
    return f'<w:p><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="60"/></w:pPr>{run(t, f"<w:b/><w:bCs/><w:color w:val=\"{MORADO}\"/>")}</w:p>'


def BUL(t, ultimo=False):
    keep = "" if ultimo else "<w:keepNext/>"
    return f'<w:p><w:pPr>{keep}<w:numPr><w:ilvl w:val="0"/><w:numId w:val="18"/></w:numPr><w:spacing w:after="40"/><w:jc w:val="both"/></w:pPr>{rich(t)}</w:p>'


def BUL_NEG(neg, resto):
    return f'<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="18"/></w:numPr><w:spacing w:after="60"/><w:jc w:val="both"/></w:pPr>{run(neg, "<w:b/><w:bCs/>")}{rich(resto)}</w:p>'


VACIO = "<w:p/>"
_bm = [900]
TOC = []


def H1(t):
    _bm[0] += 1
    n = f"_Toc3{_bm[0]:06d}"
    TOC.append((1, t, n))
    return (f'<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:pageBreakBefore/><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="{MORADO}"/></w:pBdr>'
            f'<w:spacing w:after="200"/></w:pPr><w:bookmarkStart w:id="{_bm[0]}" w:name="{n}"/>{run(t)}<w:bookmarkEnd w:id="{_bm[0]}"/></w:p>')


def H2(t, salto=False):
    _bm[0] += 1
    n = f"_Toc3{_bm[0]:06d}"
    TOC.append((2, t, n))
    pb = "<w:pageBreakBefore/>" if salto else ""
    return (f'<w:p><w:pPr><w:pStyle w:val="Heading2"/>{pb}<w:spacing w:before="240" w:after="100"/></w:pPr>'
            f'<w:bookmarkStart w:id="{_bm[0]}" w:name="{n}"/>{run(t)}<w:bookmarkEnd w:id="{_bm[0]}"/></w:p>')


# ---------- imágenes ----------
RELS = []
_img = [2000]


def IMG(ruta_o_rid, ancho_in, alto_in=None, px=None):
    _img[0] += 1
    if ruta_o_rid.startswith("rId"):
        rid = ruta_o_rid
    else:
        nombre = f"p3_{os.path.basename(ruta_o_rid)}"
        shutil.copy(ruta_o_rid, os.path.join(SAL, "word", "media", nombre))
        rid = f"rId{_img[0]}"
        RELS.append(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{nombre}"/>')
    if px:
        alto_in = ancho_in * px[1] / px[0]
    cx, cy = int(ancho_in * 914400), int(alto_in * 914400)
    i = _img[0]
    return (f'<w:p><w:pPr><w:keepNext/><w:spacing w:before="100" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>'
            f'<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="{cx}" cy="{cy}"/>'
            f'<wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="{i}" name="Imagen {i}"/><wp:cNvGraphicFramePr>'
            f'<a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
            f'<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
            f'<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="{i}" name="img{i}.png"/><pic:cNvPicPr/></pic:nvPicPr>'
            f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
            f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>')


def CAP(t):
    return (f'<w:p><w:pPr><w:spacing w:before="40" w:after="200"/><w:jc w:val="center"/></w:pPr>'
            f'{run(t, "<w:i/><w:iCs/><w:color w:val=\"595959\"/><w:sz w:val=\"18\"/><w:szCs w:val=\"18\"/>")}</w:p>')


def png_px(ruta):
    with open(ruta, "rb") as f:
        d = f.read(24)
    return int.from_bytes(d[16:20], "big"), int.from_bytes(d[20:24], "big")


# ---------- tablas con el formato de la Parte II ----------
def _celda(texto, ancho, encabezado=False, relleno=None, span=1, negrita=False, codigo=False):
    shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{relleno}"/>' if relleno else ""
    gs = f'<w:gridSpan w:val="{span}"/>' if span > 1 else ""
    keep = "<w:keepNext/>" if encabezado or negrita else ""
    if encabezado:
        rpr = '<w:b/><w:bCs/><w:color w:val="FFFFFF"/><w:sz w:val="19"/><w:szCs w:val="19"/>'
    elif codigo:
        rpr = CODE_RPR.replace('w:val="19"', 'w:val="18"')
    else:
        rpr = ("<w:b/><w:bCs/>" if negrita else "") + (f'<w:color w:val="{MORADO_OSC}"/>' if negrita else "") + '<w:sz w:val="19"/><w:szCs w:val="19"/>'
    return (f'<w:tc><w:tcPr><w:tcW w:w="{ancho}" w:type="dxa"/>{gs}{shd}<w:vAlign w:val="center"/></w:tcPr>'
            f'<w:p><w:pPr>{keep}<w:spacing w:before="30" w:after="30" w:line="245" w:lineRule="auto"/></w:pPr>{run(texto, rpr)}</w:p></w:tc>')


def TABLA(encabezados, anchos, filas, codigo_col=None):
    """filas: lista de tuplas; una fila ('#GRUPO', texto) se pinta como renglón de grupo."""
    assert sum(anchos) == TEXTO_ANCHO, sum(anchos)
    bordes = "".join(f'<w:{b} w:val="single" w:sz="4" w:space="0" w:color="{BORDE}"/>' for b in ["top", "left", "bottom", "right", "insideH", "insideV"])
    x = (f'<w:tbl><w:tblPr><w:tblW w:w="{TEXTO_ANCHO}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>{bordes}</w:tblBorders><w:tblLayout w:type="fixed"/>'
         f'<w:tblCellMar><w:top w:w="20" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="20" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar>'
         f'<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>'
         + "".join(f'<w:gridCol w:w="{a}"/>' for a in anchos) + "</w:tblGrid>")
    x += '<w:tr><w:trPr><w:cantSplit/><w:tblHeader/><w:jc w:val="center"/></w:trPr>' + "".join(_celda(h, a, True, MORADO) for h, a in zip(encabezados, anchos)) + "</w:tr>"
    for f in filas:
        x += '<w:tr><w:trPr><w:cantSplit/><w:jc w:val="center"/></w:trPr>'
        if f[0] == "#GRUPO":
            x += _celda(f[1], TEXTO_ANCHO, relleno=LAVANDA, span=len(anchos), negrita=True)
        else:
            x += "".join(_celda(str(c), a, codigo=(i in (codigo_col or []))) for i, (c, a) in enumerate(zip(f, anchos)))
        x += "</w:tr>"
    return x + "</w:tbl>" + VACIO


def CODIGO(lineas, titulo=None):
    """Bloque de código: tabla de una celda con fondo lavanda y borde izquierdo morado."""
    if isinstance(lineas, str):
        lineas = lineas.split("\n")
    x = SUB(titulo) if titulo else ""
    x += (f'<w:tbl><w:tblPr><w:tblW w:w="{TEXTO_ANCHO}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>'
          f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{BORDE}"/><w:left w:val="single" w:sz="24" w:space="0" w:color="{MORADO}"/>'
          f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{BORDE}"/><w:right w:val="single" w:sz="4" w:space="0" w:color="{BORDE}"/></w:tblBorders>'
          f'<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr>'
          f'<w:tblGrid><w:gridCol w:w="{TEXTO_ANCHO}"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="{TEXTO_ANCHO}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="{LAVANDA}"/></w:tcPr>')
    rpr = '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/><w:color w:val="241B30"/><w:sz w:val="16"/><w:szCs w:val="16"/>'
    for l in lineas:
        color = rpr.replace("241B30", "7A7287") if l.strip().startswith(("//", "#")) or l.strip().startswith("── ") else rpr
        x += f'<w:p><w:pPr><w:spacing w:after="0" w:line="228" w:lineRule="auto"/></w:pPr>{run(l, color) if l else ""}</w:p>'
    return x + "</w:tc></w:tr></w:tbl>" + VACIO


def leer(rel):
    with open(os.path.join(BACK, rel), encoding="utf-8") as f:
        return f.read().rstrip("\n")


def fragmento(rel, desde, hasta=None):
    t = leer(rel)
    i = t.index(desde)
    j = t.index(hasta, i) if hasta else len(t)
    return t[i:j].rstrip("\n")


# ---------- ejemplos reales de las pruebas ----------
def cargar_pruebas():
    t = open(os.path.join(BACK, "pruebas", "resultados_pruebas.txt"), encoding="utf-8").read()
    pruebas = {}
    for bloque in t.split("### ")[1:]:
        lineas = bloque.split("\n")
        nombre = lineas[0].strip()
        metodo, ruta = lineas[1].split(" ", 1)
        campos = {l.split(":", 1)[0]: l.split(":", 1)[1] for l in lineas[2:] if ":" in l}
        pruebas[nombre] = dict(metodo=metodo, ruta=ruta, token=campos.get("TOKEN") == "si", body=campos.get("BODY", ""),
                               status=campos["STATUS"], resp=campos.get("RESP", ""))
    return pruebas


ESTADOS = {"200": "OK", "201": "Created", "204": "No Content", "400": "Bad Request", "401": "Unauthorized", "403": "Forbidden",
           "404": "Not Found", "409": "Conflict", "422": "Unprocessable Entity"}


def recortar(obj):
    """Deja un solo elemento en las listas largas y acorta el token."""
    if isinstance(obj, dict):
        return {k: (v[:24] + "..." if k == "token" else recortar(v)) for k, v in obj.items()}
    if isinstance(obj, list) and len(obj) > 1 and isinstance(obj[0], dict) and "categoria" in obj[0]:
        return [recortar(obj[0]), "... (más productos)"]
    if isinstance(obj, list):
        return [recortar(v) for v in obj]
    return obj


def ejemplo(p):
    lineas = [f"{p['metodo']} /api{p['ruta']}"]
    if p["body"]:
        lineas.append("Content-Type: application/json")
    if p["token"]:
        lineas.append("Authorization: Bearer eyJhbGciOiJIUzI1NiIs...")
    if p["body"]:
        lineas.append("")
        try:
            lineas += json.dumps(json.loads(p["body"]), ensure_ascii=False, indent=2).split("\n")
        except json.JSONDecodeError:
            lineas.append(p["body"] + "      ← JSON incompleto")
    lineas += ["", "── Respuesta ─────────────────────────────", f"HTTP/1.1 {p['status']} {ESTADOS[p['status']]}"]
    if p["resp"]:
        lineas.append("")
        lineas += json.dumps(recortar(json.loads(p["resp"])), ensure_ascii=False, indent=2).split("\n")
    else:
        lineas.append("(sin cuerpo)")
    return lineas


# =====================================================================
#  SECCIÓN 3
# =====================================================================
def seccion3():
    pruebas = cargar_pruebas()
    x = H1("3. CODIFICACIÓN DEL BACKEND")
    x += P("En esta parte se programó el BackEnd de Aquelarre siguiendo la arquitectura de tres capas definida en la sección 2.4. "
           "El API REST está hecho con Node.js, Express 5 y TypeScript, guarda la información en PostgreSQL 16 por medio de Prisma "
           "y protege las rutas con JWT. El código está organizado en rutas, middlewares, controladores y servicios, y se probó con "
           "51 peticiones reales cuyos resultados se muestran en la sección 3.5. En la sección 3.7 se presentan los avances del "
           "FrontEnd, que ya consume este API.")

    # 3.1
    x += H2("3.1 Diseño final de la base de datos")
    x += P("El diseño final conserva las ocho tablas de la Parte II y se implementó con una migración de Prisma "
           "(`prisma/migrations/…_init/migration.sql`). Las entidades principales son usuarios, apartados, productos, categorías y "
           "emprendedores. La relación muchos a muchos entre apartados y productos se resuelve con la tabla detalle_apartado, que "
           "guarda la cantidad, el precio al momento de apartar y el subtotal. Las tablas informacion_local y mensajes_contacto no se "
           "relacionan con las demás.")
    x += SUB("Modelo entidad-relación")
    er = os.path.join(DIAG, "er.png")
    x += IMG(er, 6.1, px=png_px(er))
    x += CAP("Modelo entidad-relación conceptual (notación de Chen) — aquelarre_db.")
    x += SUB("Modelo relacional implementado")
    x += P("El siguiente diagrama muestra las tablas tal como quedaron en PostgreSQL, con sus llaves primarias (PK), foráneas (FK), "
           "campos únicos (UQ) y la cardinalidad de cada relación.")
    x += IMG("rId11", 6.1, 6.1 * 1920 / 3360)
    x += CAP("Modelo relacional final implementado con Prisma (PostgreSQL 16, 8 tablas).")
    x += SUB("Ajustes del diseño final")
    x += TABLA(["Ajuste", "Motivo"], [4200, 4638], AJUSTES_BD)
    x += CODIGO(fragmento("prisma/schema.prisma", "enum EstadoApartado", "model DetalleApartado"),
                "Fragmento de prisma/schema.prisma (enum de estados y modelo Apartado)")

    # 3.2
    x += H2("3.2 Diagrama de secuencia de las peticiones api/rest", salto=True)
    x += P("Todas las peticiones siguen el mismo recorrido: el FrontEnd envía la petición HTTPS con JSON; los middlewares aplican "
           "seguridad, autenticación y validación; el controlador llama al servicio, que contiene las reglas de negocio y consulta "
           "PostgreSQL por medio de Prisma. Cualquier error se convierte en una respuesta JSON uniforme en el manejador de errores. "
           "A continuación se muestran las tres secuencias más representativas del sistema.")
    for archivo, cap in [("seq_login.png", "Diagrama de secuencia 1 — Inicio de sesión y consulta de una ruta protegida."),
                         ("seq_apartado.png", "Diagrama de secuencia 2 — Creación de un apartado con control de existencias."),
                         ("seq_admin.png", "Diagrama de secuencia 3 — Cambio de estado de un apartado por el administrador.")]:
        ruta = os.path.join(DIAG, archivo)
        w, h = png_px(ruta)
        ancho = min(6.1, 7.6 * w / h)
        x += IMG(ruta, ancho, px=(w, h)) + CAP(cap)

    # 3.3
    x += H2("3.3 Listado de rutas del api/rest", salto=True)
    x += P("El API tiene 28 rutas bajo el prefijo `/api`. En desarrollo la URL base es `http://localhost:4000/api` y en producción "
           "será el Web Service de Render. La columna «Acceso» indica quién puede usar la ruta: **Público** (sin sesión), "
           "**Cliente** (token JWT de un usuario registrado) o **Admin** (token JWT con rol ADMIN).")
    filas = []
    grupo = None
    nombres = {"salud": "Estado del servicio", "auth": "Autenticación", "categorias": "Categorías", "emprendedores": "Emprendedores",
               "productos": "Productos", "apartados": "Apartados", "mensajes": "Mensajes de contacto", "local": "Información del local"}
    for i, (m, r, d, a) in enumerate(RUTAS, 1):
        g = r.split("/")[2]
        if g != grupo:
            grupo = g
            filas.append(("#GRUPO", nombres[g]))
        filas.append((i, m, r, d, a))
    x += TABLA(["#", "Método", "Ruta", "Descripción", "Acceso"], [450, 950, 2700, 3238, 1500], filas, codigo_col=[2])

    # 3.4
    x += H2("3.4 Parámetros de solicitud para cada ruta", salto=True)
    x += P("Los parámetros pueden ir en la ruta (**Path**), en la cadena de consulta (**Query**), en el cuerpo JSON (**Body**) o en "
           "las cabeceras (**Header**). Todos se validan con express-validator antes de llegar al controlador; si alguno no cumple, "
           "el API responde 422 con el detalle de cada campo. Las rutas que no aparecen en la tabla (`GET /api/salud`, "
           "`GET /api/emprendedores`, `GET /api/local` y `GET /api/apartados/mis-apartados`) no reciben parámetros, salvo el token "
           "en las rutas protegidas.")
    filas = []
    for g, params in PARAMETROS:
        filas.append(("#GRUPO", g))
        filas += params
    x += TABLA(["Parámetro", "Ubicación", "Tipo", "Oblig.", "Validación / descripción"], [2250, 1000, 950, 1000, 3638], filas, codigo_col=[0])
    x += SUB("Cambios de estado permitidos para un apartado")
    x += TABLA(["Estado actual", "Puede cambiar a", "¿Regresan las existencias?"], [2200, 3638, 3000], TRANSICIONES)

    # 3.5
    x += H2("3.5 Códigos de respuesta y error del api/rest y ejemplos de peticiones", salto=True)
    x += P("Todas las respuestas usan el mismo formato JSON. Si la petición tuvo éxito se regresa `ok: true` con los datos en `data` "
           "(y `meta` cuando hay paginación). Si hubo un error se regresa `ok: false` con un código interno legible, un mensaje en "
           "español y, en los errores de validación, el detalle por campo.")
    x += CODIGO(['// Respuesta correcta', '{ "ok": true, "data": { ... }, "meta": { "total": 3, "pagina": 1, "limite": 12, "paginas": 1 } }', "",
                 '// Respuesta con error', '{ "ok": false, "error": { "codigo": "VALIDACION", "mensaje": "Los datos enviados no son válidos",',
                 '                         "detalles": [ { "campo": "telefonoCliente", "mensaje": "El teléfono debe tener 10 dígitos" } ] } }'],
                "Formato de las respuestas")
    x += SUB("Códigos de respuesta y error")
    x += TABLA(["HTTP", "Nombre", "codigo (JSON)", "Cuándo se devuelve"], [700, 1700, 2300, 4138], CODIGOS, codigo_col=[2])
    x += SUB("Ejemplos de peticiones")
    x += P("Los siguientes ejemplos se obtuvieron ejecutando el script `pruebas/pruebas_api.sh` contra el API corriendo con una base "
           "de datos PostgreSQL de prueba. Se ejecutaron 51 peticiones y todas regresaron el código esperado; los resultados completos "
           "están en `pruebas/resultados_pruebas.txt`. Los tokens se acortaron y en las listas se deja un solo elemento.")
    for nombre, titulo in EJEMPLOS:
        x += CODIGO(ejemplo(pruebas[nombre]), titulo)
    x += CODIGO(EJEMPLO_429, "Ejemplo 12 · Límite de intentos de inicio de sesión (429 Too Many Requests)")

    # 3.6
    x += H2("3.6 Codificación del BackEnd", salto=True)
    x += P("El BackEnd se encuentra en la carpeta `aquelarre-backend`. Se programó en TypeScript en modo estricto y se divide en capas "
           "para que cada archivo tenga una sola responsabilidad: las **rutas** definen qué middlewares y qué controlador atienden cada "
           "petición; los **middlewares** revisan seguridad, sesión, rol y validación; los **controladores** solo reciben los datos ya "
           "validados y arman la respuesta; y los **servicios** contienen las reglas de negocio y el acceso a la base de datos con Prisma.")
    x += SUB("Tecnologías y dependencias")
    x += TABLA(["Paquete", "Versión", "Uso"], [2900, 1700, 4238], DEPENDENCIAS, codigo_col=[0])
    x += CODIGO(ESTRUCTURA, "Estructura del proyecto")
    x += SUB("Medidas de seguridad aplicadas")
    for neg, resto in SEGURIDAD:
        x += BUL_NEG(neg, resto)
    x += VACIO
    x += P("A continuación se presenta el código principal del BackEnd.")
    listados = [
        ("src/app.ts — configuración de Express", leer("src/app.ts")),
        ("src/routes/index.ts — definición de rutas (fragmento: productos y apartados)",
         fragmento("src/routes/index.ts", "const router = Router();", "// ---------- Autenticación") + "\n\n// ...\n" +
         fragmento("src/routes/index.ts", "// ---------- Productos", "// ---------- Contacto")),
        ("src/middlewares/auth.ts — autenticación JWT y autorización por rol", fragmento("src/middlewares/auth.ts", "// Verificación")),
        ("src/middlewares/validar.ts — respuesta 422 con detalle por campo", leer("src/middlewares/validar.ts")),
        ("src/middlewares/errores.ts — manejo centralizado de errores", leer("src/middlewares/errores.ts")),
        ("src/utils/ApiError.ts — errores controlados del API", leer("src/utils/ApiError.ts")),
        ("src/validators/apartados.validator.ts — reglas de validación de apartados", leer("src/validators/apartados.validator.ts")),
        ("src/controllers/apartados.controller.ts — controlador de apartados", leer("src/controllers/apartados.controller.ts")),
        ("src/services/apartados.service.ts — reglas de negocio de los apartados (crear y cambiar estado)",
         fragmento("src/services/apartados.service.ts", "// Transiciones", "export function misApartados") + "\n// ...\n" +
         fragmento("src/services/apartados.service.ts", "export async function cambiarEstado")),
        ("src/services/auth.service.ts — registro e inicio de sesión", fragmento("src/services/auth.service.ts", "const camposPublicos", "export async function perfil")),
        ("src/services/productos.service.ts — catálogo con filtros y paginación", fragmento("src/services/productos.service.ts", "export async function listar", "export async function obtener")),
    ]
    for i, (titulo, codigo) in enumerate(listados, 1):
        x += CODIGO(codigo, f"Listado {i}. {titulo}")
    x += CODIGO(EJECUCION, "Ejecución del proyecto en local")
    x += seccion37()
    return x


def leer_fe(rel):
    with open(os.path.join(RAIZ, "aquelarre-frontend", rel), encoding="utf-8") as f:
        return f.read().rstrip("\n")


def seccion37():
    x = H2("3.7 Avances del FrontEnd", salto=True)
    x += P("El FrontEnd está en la carpeta `aquelarre-frontend`. Es una aplicación de una sola página (SPA) hecha con React, Vite, "
           "TypeScript y Tailwind CSS, con los colores y tipografías de los mockups de la sección 2.3 (morado bruja, rosa y carmín; "
           "Cinzel para títulos y Poppins para el texto). Ya consume el API REST real: en desarrollo Vite redirige las peticiones de "
           "`/api` al BackEnd, y el token JWT se envía en la cabecera Authorization después de iniciar sesión.")
    x += SUB("Tecnologías del FrontEnd")
    x += TABLA(["Paquete", "Versión", "Uso"], [2900, 1200, 4738], TECNOLOGIAS_FE, codigo_col=[0])
    x += SUB("Avance por pantalla")
    x += P("Ya está terminado el flujo completo del cliente: ver el catálogo, apartar productos, recibir el folio y consultar el "
           "historial. Para la siguiente entrega quedan la página de ubicación y contacto y el panel de administración, cuyas rutas del "
           "API ya están programadas y probadas.")
    x += TABLA(["Pantalla", "Ruta", "Endpoints que consume", "Estado"], [2300, 1700, 3638, 1200], PANTALLAS_FE, codigo_col=[1])
    x += SUB("Capturas de pantalla")
    x += P("Las capturas se tomaron con Microsoft Edge usando el FrontEnd conectado al BackEnd y a PostgreSQL. Los productos aún no "
           "tienen fotografía, por eso se muestra un ícono por categoría mientras se suben las imágenes a Cloudinary.")
    carpeta = os.path.join(DIAG, "frontend")
    for archivo, cap in CAPTURAS_FE:
        ruta = os.path.join(carpeta, archivo)
        w, h = png_px(ruta)
        ancho = 2.6 if "movil" in archivo else min(6.1, 7.4 * w / h)
        x += IMG(ruta, ancho, px=(w, h)) + CAP(cap)
    x += SUB("Código principal del FrontEnd")
    x += CODIGO(fragmento_fe("src/api/cliente.ts", "export class ApiError", "export const pesos"),
                "Listado 12. src/api/cliente.ts — cliente HTTP que agrega el token y convierte los errores del API")
    x += CODIGO(fragmento_fe("src/pages/Carrito.tsx", "  const crear = useMutation({", "  function enviar"),
                "Listado 13. src/pages/Carrito.tsx — creación del apartado con TanStack Query (fragmento)")
    x += CODIGO("cd aquelarre-frontend\nnpm install\nnpm run dev      # http://localhost:5173 (el BackEnd debe estar corriendo en el puerto 4000)\nnpm run build    # revisa los tipos con tsc y genera la carpeta dist/",
                "Ejecución del FrontEnd en local")
    return x


def fragmento_fe(rel, desde, hasta):
    t = leer_fe(rel)
    i = t.index(desde)
    return t[i:t.index(hasta, i)].rstrip("\n")


# =====================================================================
#  ENSAMBLE
# =====================================================================
ruta_doc = os.path.join(SAL, "word", "document.xml")
d = open(ruta_doc, encoding="utf-8").read()

# Portada
for a, b in [(">Proyecto final – Parte II<", ">Proyecto final – Parte III<"),
             (">Análisis de Requerimientos<", ">Codificación – BackEnd y avances del FrontEnd<"),
             (">04 de octubre de 2026<", ">15 de noviembre de 2026<")]:
    assert d.count(a) == 1, a
    d = d.replace(a, b)

# Sección 3 antes de FUENTES BIBLIOGRÁFICAS
pos_fuentes = d.rfind("<w:p ", 0, d.index('>FUENTES BIBLIOGRÁFICAS</w:t></w:r><w:bookmarkEnd'))
d = d[:pos_fuentes] + seccion3() + d[pos_fuentes:]

# Nuevas fuentes al final de la lista
ult = d.index("Perfil de Instagram. Recuperado de: https://www.instagram.com/aquelarre_showroom/")
fin_p = d.index("</w:p>", ult) + 6
nuevas = "".join(f'<w:p><w:pPr><w:spacing w:after="120"/></w:pPr>{run(f"{i} {t}", "<w:sz w:val=\"22\"/><w:szCs w:val=\"22\"/>")}</w:p>'
                 for i, t in enumerate(FUENTES_NUEVAS, 9))
d = d[:fin_p] + nuevas + d[fin_p:]

# Entradas nuevas del índice (Word recalcula las páginas al actualizar el TOC)
def toc_entrada(nivel, texto, bm):
    rpr_p = ('<w:rPr><w:rFonts w:eastAsiaTheme="minorEastAsia"/><w:b w:val="0"/><w:bCs w:val="0"/><w:noProof/><w:color w:val="auto"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US"/></w:rPr>'
             if nivel == 1 else '<w:rPr><w:rFonts w:eastAsiaTheme="minorEastAsia"/><w:noProof/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US"/></w:rPr>')
    w = '<w:rPr><w:noProof/><w:webHidden/></w:rPr>'
    return (f'<w:p><w:pPr><w:pStyle w:val="TOC{nivel}"/>{rpr_p}</w:pPr><w:hyperlink w:anchor="{bm}" w:history="1">'
            f'<w:r><w:rPr><w:rStyle w:val="Hyperlink"/><w:noProof/></w:rPr><w:t>{esc(texto)}</w:t></w:r><w:r>{w}<w:tab/></w:r>'
            f'<w:r>{w}<w:fldChar w:fldCharType="begin"/></w:r><w:r>{w}<w:instrText xml:space="preserve"> PAGEREF {bm} \\h </w:instrText></w:r>'
            f'<w:r>{w}<w:fldChar w:fldCharType="separate"/></w:r><w:r>{w}<w:t>0</w:t></w:r><w:r>{w}<w:fldChar w:fldCharType="end"/></w:r></w:hyperlink></w:p>')

i_toc_fuentes = d.rfind("<w:p ", 0, d.index("<w:t>FUENTES BIBLIOGRÁFICAS</w:t>"))
d = d[:i_toc_fuentes] + "".join(toc_entrada(*e) for e in TOC) + d[i_toc_fuentes:]
open(ruta_doc, "w", encoding="utf-8").write(d)

# Relaciones de las imágenes nuevas
ruta_rels = os.path.join(SAL, "word", "_rels", "document.xml.rels")
r = open(ruta_rels, encoding="utf-8").read()
r = r.replace("</Relationships>", "".join(RELS) + "</Relationships>")
open(ruta_rels, "w", encoding="utf-8").write(r)

# Encabezado: documento, versión y fecha
ruta_h = os.path.join(SAL, "word", "header2.xml")
h = open(ruta_h, encoding="utf-8").read()
for a, b in [(">Análisis de Requerimientos<", ">Codificación del BackEnd<"), (">2.0<", ">3.0<"), (">04/10/2026<", ">15/11/2026<")]:
    assert h.count(a) == 1, a
    h = h.replace(a, b)
open(ruta_h, "w", encoding="utf-8").write(h)

# Que Word actualice el índice y los campos al abrir el documento
ruta_s = os.path.join(SAL, "word", "settings.xml")
st = open(ruta_s, encoding="utf-8").read()
if "w:updateFields" not in st:
    # En CT_Settings, updateFields va justo antes de hdrShapeDefaults
    assert "<w:hdrShapeDefaults" in st
    st = st.replace("<w:hdrShapeDefaults", '<w:updateFields w:val="true"/><w:hdrShapeDefaults', 1)
open(ruta_s, "w", encoding="utf-8").write(st)

# Validar que los XML modificados estén bien formados
import xml.dom.minidom
for parte in ["document.xml", "header2.xml", "settings.xml", "_rels/document.xml.rels"]:
    xml.dom.minidom.parse(os.path.join(SAL, "word", parte))

# Empaquetar
salida = os.path.join(TRAB, "ParteIII_sin_actualizar.docx")
if os.path.exists(salida):
    os.remove(salida)
with zipfile.ZipFile(salida, "w", zipfile.ZIP_DEFLATED) as z:
    for base, _, archivos in os.walk(SAL):
        for a in archivos:
            completo = os.path.join(base, a)
            z.write(completo, os.path.relpath(completo, SAL).replace(os.sep, "/"))
print("OK", salida, "| entradas TOC:", len(TOC), "| imágenes nuevas:", len(RELS))
