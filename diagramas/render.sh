#!/bin/bash
# Uso: render.sh <archivo.html> <salida.png> <dir_pymupdf>
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
PDF="${2%.png}.pdf"
"$EDGE" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$(cygpath -w "$PDF")" "file:///$(cygpath -m "$1")" >/dev/null 2>&1
python -I -c "
import sys; sys.path.insert(0, sys.argv[3]); import pymupdf
d=pymupdf.open(sys.argv[1]); print(len(d), d[0].rect); d[0].get_pixmap(dpi=200).save(sys.argv[2])" "$PDF" "$2" "$3"
rm -f "$PDF"
