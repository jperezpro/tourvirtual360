"""Servidor para ver la web en la PC: http://127.0.0.1:8360

Uso: python -I scripts/servidor-local.py [puerto]

Diferencias con `python -m http.server`, a proposito:
- Saca Google Tag Manager de index.html. Las pruebas locales mandaban
  page_view a GA4 con hostname 127.0.0.1 y ensuciaban los datos de la campaña.
- Manda los headers del bloque `/*` de `_headers` (la CSP incluida): lo que la
  CSP bloquearia en Cloudflare tambien falla aca.
- Responde pedidos parciales (Range) como Cloudflare: Safari de iPhone no
  reproduce un video si el servidor no los acepta.
- No sirve archivos que empiezan con punto (.dev.vars, .git) ni responde a
  otro Host que 127.0.0.1 o localhost.
"""
import http.server
import io
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 else 8360
GTM = re.compile(r'<!-- Google Tag Manager( \(noscript\))? -->.*?<!-- End Google Tag Manager( \(noscript\))? -->', re.S)


def headers_globales():
    """Headers del bloque `/*` de _headers, menos los de cache y HSTS."""
    headers, dentro = [], False
    with open(os.path.join(RAIZ, '_headers'), encoding='utf-8') as f:
        for linea in f:
            if not linea.strip() or linea.lstrip().startswith('#'):
                continue
            if not linea[0].isspace():
                dentro = linea.strip() == '/*'
            elif dentro and ':' in linea:
                nombre, valor = linea.strip().split(':', 1)
                if nombre.lower() not in ('cache-control', 'strict-transport-security'):
                    headers.append((nombre, valor.strip()))
    return headers


class Manejador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RAIZ, **kwargs)

    def end_headers(self):
        for nombre, valor in headers_globales():
            self.send_header(nombre, valor)
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def responder(self, estado, tipo, datos, extra=()):
        self.send_response(estado)
        self.send_header('Content-Type', tipo)
        self.send_header('Content-Length', str(len(datos)))
        for nombre, valor in extra:
            self.send_header(nombre, valor)
        self.end_headers()
        return io.BytesIO(datos)

    def send_head(self):
        # Solo para quien entra por 127.0.0.1 o localhost: una pagina con DNS
        # rebinding podria pedir archivos del repo con otro Host.
        if self.headers.get('Host', '') not in (f'127.0.0.1:{PUERTO}', f'localhost:{PUERTO}'):
            self.send_error(403)
            return None
        # Nada que empiece con punto (.dev.vars tiene el token de Notion, .git).
        # Se mira la ruta real y no la pedida: Windows acepta nombres cortos
        # como /DEV~1.VAR.
        rel = os.path.relpath(os.path.realpath(self.translate_path(self.path)), RAIZ)
        if rel.startswith('..') or any(p.startswith('.') and p != '.' for p in rel.split(os.sep)):
            self.send_error(404)
            return None

        if self.path.split('?')[0] in ('/', '/index.html'):
            with open(os.path.join(RAIZ, 'index.html'), encoding='utf-8') as f:
                html = GTM.sub('', f.read())
            return self.responder(200, 'text/html; charset=utf-8', html.encode('utf-8'))

        ruta = self.translate_path(self.path)
        rango = re.fullmatch(r'bytes=(\d*)-(\d*)', self.headers.get('Range', ''))
        if rango and os.path.isfile(ruta) and rango.group(0) != 'bytes=-':
            total = os.path.getsize(ruta)
            desde, hasta = rango.groups()
            if desde == '':
                desde, hasta = max(total - int(hasta), 0), total - 1
            else:
                desde, hasta = int(desde), min(int(hasta or total - 1), total - 1)
            if desde > hasta:
                self.send_error(416)
                return None
            with open(ruta, 'rb') as f:
                f.seek(desde)
                datos = f.read(hasta - desde + 1)
            return self.responder(206, self.guess_type(ruta), datos, [
                ('Content-Range', f'bytes {desde}-{hasta}/{total}'),
                ('Accept-Ranges', 'bytes'),
            ])
        return super().send_head()


if __name__ == '__main__':
    servidor = http.server.ThreadingHTTPServer(('127.0.0.1', PUERTO), Manejador)
    print(f'Sirviendo {RAIZ} en http://127.0.0.1:{PUERTO} (sin GTM)', flush=True)
    servidor.serve_forever()
