/**
 * POST /api/contacto
 *
 * Recibe el formulario de contacto de desktop y crea una fila en la base
 * "Tour Virtual (CRM)" de Notion con Estado "Lead" y Origen "Formulario web".
 *
 * Secrets requeridos en Cloudflare Pages (Settings > Environment variables):
 *   NOTION_TOKEN        token de la integracion interna de Notion
 *   NOTION_DATA_SOURCE  id del data source del CRM
 *
 * El token nunca viaja al browser: la landing hace fetch a este endpoint del
 * mismo origen y es la Function la que habla con la API de Notion.
 */

const NOTION_VERSION = '2022-06-28';

// Limites de largo. Notion corta el rich_text en 2000 caracteres por bloque,
// y un nombre o telefono mucho mas largo que esto es basura o abuso.
const MAX = { nombre: 200, whatsapp: 40, mensaje: 2000 };

const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });

/** Recorta, normaliza espacios y limita el largo de un campo de texto. */
function limpiar(valor, max) {
    if (typeof valor !== 'string') return '';
    return valor.replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Un numero uruguayo valido tiene 8 o 9 digitos (con o sin el 598). Se acepta
 * cualquier separador porque la gente escribe "099 123 456" o "+598 99 123 456";
 * lo que se valida es la cantidad de digitos, no el formato.
 */
function whatsappValido(valor) {
    const digitos = valor.replace(/\D/g, '');
    return digitos.length >= 8 && digitos.length <= 15;
}

export async function onRequestPost({ request, env }) {
    if (!env.NOTION_TOKEN || !env.NOTION_DATA_SOURCE) {
        console.error('Faltan NOTION_TOKEN o NOTION_DATA_SOURCE en el entorno');
        return json({ ok: false, error: 'config' }, 500);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return json({ ok: false, error: 'json' }, 400);
    }

    // Honeypot: campo oculto que una persona nunca completa. Si viene con algo,
    // es un bot. Se responde 200 para que no aprenda que fue detectado.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
        return json({ ok: true });
    }

    const nombre = limpiar(body.nombre, MAX.nombre);
    const whatsapp = limpiar(body.whatsapp, MAX.whatsapp);
    const mensaje = limpiar(body.mensaje, MAX.mensaje);

    const errores = {};
    if (nombre.length < 2) errores.nombre = 'Ingresá tu nombre.';
    if (!whatsappValido(whatsapp)) errores.whatsapp = 'Ingresá un WhatsApp válido.';
    if (mensaje.length < 10) errores.mensaje = 'Contame un poco más (mínimo 10 caracteres).';

    if (Object.keys(errores).length > 0) {
        return json({ ok: false, error: 'validacion', errores }, 400);
    }

    // El titulo de la fila es el nombre del lead; el resto va en las columnas
    // que usa el CRM. El telefono va solo en "WhatsApp" (tipo phone_number):
    // es el unico campo de contacto del CRM desde que se unifico.
    const propiedades = {
        Cliente: { title: [{ text: { content: nombre } }] },
        WhatsApp: { phone_number: whatsapp },
        Mensaje: { rich_text: [{ text: { content: mensaje } }] },
        Estado: { select: { name: 'Lead' } },
        Origen: { select: { name: 'Formulario web' } },
        Prioridad: { select: { name: 'Media' } },
    };

    try {
        const respuesta = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { type: 'data_source_id', data_source_id: env.NOTION_DATA_SOURCE },
                properties: propiedades,
            }),
        });

        if (!respuesta.ok) {
            // El detalle de Notion queda en el log de Cloudflare, no en la
            // respuesta: al visitante no le sirve y puede filtrar config.
            console.error('Notion respondio', respuesta.status, await respuesta.text());
            return json({ ok: false, error: 'notion' }, 502);
        }
    } catch (err) {
        console.error('Fallo la llamada a Notion:', err.message);
        return json({ ok: false, error: 'red' }, 502);
    }

    return json({ ok: true });
}

/** Cualquier metodo que no sea POST no tiene sentido en este endpoint. */
export async function onRequestGet() {
    return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'POST' },
    });
}
