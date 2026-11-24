#!/usr/bin/env python3
"""Genera la copia de index.html para publicar como Artifact.

El Artifact agrega su propio <!doctype>, <html>, <head> y <body>, así que se quitan del archivo.
Uso: python3 duelo-elemental/tools/build_artifact.py salida.html
"""
import os
import sys

src = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html')
out = sys.argv[1] if len(sys.argv) > 1 else 'duelo-elemental-artifact.html'
s = open(src, encoding='utf-8').read()
for tag in ['<!doctype html>\n', '<html lang="es">\n', '<head>\n', '</head>\n', '<body>\n', '</body>\n', '</html>\n']:
    if tag not in s:
        sys.exit(f'No encontré {tag.strip()} en index.html')
    s = s.replace(tag, '', 1)
open(out, 'w', encoding='utf-8').write(s)
print(f'Listo: {out}')
