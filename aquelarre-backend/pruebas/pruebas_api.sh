#!/bin/bash
# Ejecuta peticiones de ejemplo y guarda método, ruta, cuerpo, status y respuesta
U=http://localhost:4000/api
OUT="$1"; : > "$OUT"
req() { # nombre metodo ruta token body
  local n="$1" m="$2" r="$3" t="$4" b="$5"
  local args=(-s -o /tmp/aq_body -w "%{http_code}" -X "$m" "$U$r" -H "Content-Type: application/json")
  [ -n "$t" ] && args+=(-H "Authorization: Bearer $t")
  [ -n "$b" ] && { printf "%s" "$b" > /tmp/aq_req; args+=(--data-binary @/tmp/aq_req); }
  local code=$(curl "${args[@]}")
  printf '### %s\n%s %s\nTOKEN:%s\nBODY:%s\nSTATUS:%s\nRESP:%s\n\n' "$n" "$m" "$r" "${t:+si}" "$b" "$code" "$(cat /tmp/aq_body)" >> "$OUT"
  cat /tmp/aq_body
}
ADM=$(req login_admin POST /auth/login "" '{"correo":"admin@aquelarre.mx","contrasena":"Admin123*"}' | python -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
CLI=$(req registro POST /auth/registro "" '{"nombre":"Ana López","correo":"ana@correo.com","contrasena":"secreta123","telefono":"4921234567"}' | python -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
req registro_duplicado POST /auth/registro "" '{"nombre":"Ana López","correo":"ana@correo.com","contrasena":"secreta123"}' >/dev/null
req registro_invalido POST /auth/registro "" '{"nombre":"A","correo":"no-es-correo","contrasena":"abc"}' >/dev/null
req login_malo POST /auth/login "" '{"correo":"ana@correo.com","contrasena":"otra1234"}' >/dev/null
req perfil GET /auth/perfil "$CLI" >/dev/null
req perfil_sin_token GET /auth/perfil "" >/dev/null
req perfil_token_malo GET /auth/perfil "abc.def.ghi" >/dev/null
req categorias GET /categorias "" >/dev/null
req categoria_id GET /categorias/2 "" >/dev/null
req categoria_crear POST /categorias "$ADM" '{"nombre":"Artesanías","descripcion":"Barro, madera y textiles"}' >/dev/null
req categoria_crear_cliente POST /categorias "$CLI" '{"nombre":"Velas"}' >/dev/null
req categoria_actualizar PUT /categorias/4 "$ADM" '{"descripcion":"Barro, madera, textiles y velas"}' >/dev/null
req categoria_eliminar_con_productos DELETE /categorias/1 "$ADM" >/dev/null
req categoria_eliminar DELETE /categorias/4 "$ADM" >/dev/null
req emprendedores GET /emprendedores "" >/dev/null
req emprendedor_crear POST /emprendedores "$ADM" '{"nombreMarca":"Cera Lunar","responsable":"Paola M.","instagram":"@ceralunar"}' >/dev/null
req emprendedor_actualizar PUT /emprendedores/4 "$ADM" '{"telefono":"4929876543"}' >/dev/null
req emprendedor_eliminar DELETE /emprendedores/4 "$ADM" >/dev/null
req productos_filtro GET "/productos?categoria=accesorios&orden=precio_asc&limite=5" "" >/dev/null
req productos_busqueda GET "/productos?q=blusa" "" >/dev/null
req productos_query_mala GET "/productos?limite=500&orden=barato" "" >/dev/null
req producto_id GET /productos/3 "" >/dev/null
req producto_no_existe GET /productos/999 "" >/dev/null
req producto_id_malo GET /productos/abc "" >/dev/null
req producto_crear POST /productos "$ADM" '{"nombre":"Tote bag de bruja","descripcion":"Bolsa de manta serigrafiada","precio":180,"existencias":12,"categoriaId":3,"emprendedorId":2,"imagenUrl":"https://res.cloudinary.com/aquelarre/image/upload/tote.jpg"}' >/dev/null
req producto_crear_invalido POST /productos "$ADM" '{"nombre":"X","precio":-5,"categoriaId":3}' >/dev/null
req producto_crear_cat_inexistente POST /productos "$ADM" '{"nombre":"Taza","precio":120,"categoriaId":99,"emprendedorId":1}' >/dev/null
req producto_actualizar PUT /productos/7 "$ADM" '{"precio":199.5,"destacado":true}' >/dev/null
req producto_eliminar DELETE /productos/7 "$ADM" >/dev/null
req json_malo POST /productos "$ADM" '{"nombre": "x",' >/dev/null
req apartado_crear POST /apartados "$CLI" '{"nombreCliente":"Ana López","telefonoCliente":"4921234567","productos":[{"productoId":1,"cantidad":2},{"productoId":5,"cantidad":1}],"notas":"Paso el sábado en la tarde"}' >/dev/null
req apartado_invitado POST /apartados "" '{"nombreCliente":"Luis Pérez","telefonoCliente":"4927654321","productos":[{"productoId":3,"cantidad":1}]}' >/dev/null
req apartado_sin_existencias POST /apartados "" '{"nombreCliente":"Luis Pérez","telefonoCliente":"4927654321","productos":[{"productoId":6,"cantidad":5}]}' >/dev/null
req apartado_invalido POST /apartados "" '{"nombreCliente":"Luis","telefonoCliente":"123","productos":[]}' >/dev/null
req mis_apartados GET /apartados/mis-apartados "$CLI" >/dev/null
req apartado_folio GET "/apartados/folio/AQ-000002?telefono=4927654321" "" >/dev/null
req apartado_folio_tel_malo GET "/apartados/folio/AQ-000002?telefono=4920000000" "" >/dev/null
req apartados_admin GET "/apartados?estado=PENDIENTE" "$ADM" >/dev/null
req apartados_cliente GET /apartados "$CLI" >/dev/null
req apartado_estado_listo PATCH /apartados/1/estado "$ADM" '{"estado":"LISTO"}' >/dev/null
req apartado_estado_recogido PATCH /apartados/1/estado "$ADM" '{"estado":"RECOGIDO"}' >/dev/null
req apartado_estado_invalido PATCH /apartados/1/estado "$ADM" '{"estado":"CANCELADO"}' >/dev/null
req apartado_cancelar PATCH /apartados/2/estado "$ADM" '{"estado":"CANCELADO"}' >/dev/null
req existencias_regresan GET /productos/3 "" >/dev/null
req mensaje_crear POST /mensajes "" '{"nombre":"Sofía Ruiz","correo":"sofia@correo.com","asunto":"Quiero vender en el bazar","mensaje":"Hola, hago velas artesanales y me gustaría tener un espacio."}' >/dev/null
req mensajes_admin GET "/mensajes?leido=false" "$ADM" >/dev/null
req mensaje_leido PATCH /mensajes/1/leido "$ADM" >/dev/null
req local GET /local "" >/dev/null
req local_actualizar PUT /local "$ADM" '{"telefono":"4921112233","diasVigenciaApartado":4}' >/dev/null
req ruta_inexistente GET /ventas "" >/dev/null
echo HECHO
