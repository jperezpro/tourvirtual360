/**
 * Tour Virtual 360 Pro - Main JavaScript
 * Gestiona menú móvil, contacto WhatsApp y analytics
 */

// ============================================================================
// MOBILE MENU TOGGLE
// ============================================================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// ============================================================================
// MEDICION
// ============================================================================
// La medicion vive en GTM, no aca. La conversion contacto_whatsapp la dispara
// el activador de clics en links con la clase `gtm-cta`: solo deben llevarla
// los links que abren WhatsApp (wa.me), incluidos los "Pedir" de los
// servicios. Un link que no abre WhatsApp con esa clase infla la conversion que
// usa la campaña de Google Ads. (03/10/2026: se saco el evento generico
// "click" que se mandaba por gtag desde aca, resto de la medicion anterior.)

// ============================================================================
// FORMULARIO DE CONTACTO (solo desktop)
// ============================================================================
const formContacto = document.getElementById('form-contacto-desktop');

if (formContacto) {
    const btnEnviar = document.getElementById('btn-enviar-formulario');
    const estado = document.getElementById('form-contacto-estado');

    const limpiarErrores = () => {
        formContacto.querySelectorAll('[data-error]').forEach(p => {
            p.textContent = '';
            p.classList.add('hidden');
        });
    };

    const mostrarErrores = (errores = {}) => {
        Object.entries(errores).forEach(([campo, texto]) => {
            const p = formContacto.querySelector(`[data-error="${campo}"]`);
            if (p) {
                p.textContent = texto;
                p.classList.remove('hidden');
            }
        });
    };

    const setEstado = (texto, tipo) => {
        estado.textContent = texto;
        estado.className = `mt-4 text-center text-sm ${
            tipo === 'ok' ? 'text-green-400' : tipo === 'error' ? 'text-red-400' : 'text-gray-400'
        }`;
    };

    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErrores();

        const datos = {
            nombre: formContacto.nombre.value,
            whatsapp: formContacto.whatsapp.value,
            mensaje: formContacto.mensaje.value,
            website: formContacto.website.value
        };

        btnEnviar.disabled = true;
        setEstado('Enviando…', 'info');

        try {
            const respuesta = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok || !resultado.ok) {
                if (resultado.error === 'validacion') {
                    mostrarErrores(resultado.errores);
                    setEstado('Revisá los campos marcados.', 'error');
                } else {
                    setEstado(
                        'No pude recibir tu consulta. Probá de nuevo o escribime por WhatsApp.',
                        'error'
                    );
                }
                return;
            }

            // Evento para GA4 via GTM. Se dispara solo cuando el lead quedo
            // efectivamente guardado, para no contar envios fallidos como
            // conversion.
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'envio_formulario_desktop',
                form_id: 'form-contacto-desktop'
            });

            formContacto.reset();
            setEstado('Mensaje enviado', 'ok');
        } catch (err) {
            setEstado(
                'No pude recibir tu consulta. Probá de nuevo o escribime por WhatsApp.',
                'error'
            );
        } finally {
            btnEnviar.disabled = false;
        }
    });
}

// ============================================================================
// PORTAFOLIO: reel y tour 360 en un visor a pantalla completa
// ============================================================================
// Con la pagina solo bajan los posters. El video y el tour se cargan al tocar
// la tarjeta y se descartan al cerrar el visor, asi el portafolio no le suma
// peso a la carga. Sin <dialog> (navegadores viejos) no se intercepta nada:
// los links abren el video o el tour solos. Ninguno lleva `gtm-cta`: no son
// contactos y no deben contar como conversion de la campaña. Al abrir un tour
// aparecen encima las mismas indicaciones de gestos de la tarjeta.
const visor = document.getElementById('visor');

if (visor && typeof visor.showModal === 'function') {
    const contenido = document.getElementById('visor-contenido');

    // Indicaciones de gestos: el <figure class="gestos"> de #demo, copiado
    // encima del tour (sale de cache, 0 bytes). No tapa toques (CSS) y se va
    // 3 s despues de que carga el tour, al primer toque adentro (la ventana
    // pierde el foco) o a los 10 s. En iPhone el blur no siempre llega: para
    // eso estan los tiempos.
    const gestosTarjeta = document.querySelector('#demo .gestos');
    let soltarGestos = () => {};
    let abiertoEn = 0;
    let entradaPropia = false;

    const mostrarGestos = (iframe) => {
        if (!gestosTarjeta) return;
        const aviso = gestosTarjeta.cloneNode(true);
        aviso.setAttribute('aria-hidden', 'true');
        contenido.append(aviso);

        const timers = [];
        let hecho = false;
        const ocultar = () => {
            if (hecho) return;
            hecho = true;
            aviso.classList.add('sale');
            timers.forEach(clearTimeout);
            window.removeEventListener('blur', ocultar);
        };
        timers.push(setTimeout(ocultar, 10000));
        iframe.addEventListener('load', () => {
            if (!hecho) timers.push(setTimeout(ocultar, 3000));
        }, { once: true });
        window.addEventListener('blur', ocultar);
        soltarGestos = ocultar;
    };

    const abrir = (link) => {
        const esVideo = link.dataset.visor === 'video';
        const el = document.createElement(esVideo ? 'video' : 'iframe');
        if (esVideo) {
            el.controls = true;
            el.playsInline = true;
            el.autoplay = true;
            const poster = link.querySelector('img');
            if (poster) el.poster = poster.currentSrc || poster.src;
        } else {
            el.title = link.dataset.titulo;
            el.allow = 'fullscreen; gyroscope; accelerometer';
        }
        el.src = link.href;
        contenido.replaceChildren(el);
        if (!esVideo) mostrarGestos(el);
        visor.setAttribute('aria-label', link.dataset.titulo);
        visor.showModal();
        abiertoEn = performance.now();
        // Una entrada en el historial para que "atras" en el celular cierre el
        // visor en vez de sacar a la persona de la pagina. La marca va en
        // memoria y no en history.state, que sobrevive a una recarga: con el
        // state, un "atras" despues de recargar retrocedia una entrada de mas.
        history.pushState({ visor: true }, '');
        entradaPropia = true;

        // Para GA4 cuando se cree la etiqueta en GTM (hoy no hay ninguna).
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: esVideo ? 'ver_reel' : 'abrir_tour',
            trabajo: link.dataset.titulo
        });
    };

    document.querySelectorAll('[data-visor]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            abrir(link);
        });
    });

    // Corta el video y libera el tour. Se puede llamar mas de una vez.
    const vaciar = () => {
        soltarGestos();
        contenido.replaceChildren();
    };

    visor.addEventListener('close', () => {
        vaciar();
        if (entradaPropia) {
            entradaPropia = false;
            history.back();
        }
    });

    window.addEventListener('popstate', () => {
        entradaPropia = false;
        if (visor.open) visor.close();
        // Respaldo por si el evento close no llega: que nunca quede un video
        // sonando con el visor cerrado.
        vaciar();
    });

    // Cerrar con un clic (la X o el fondo). Durante medio segundo la pagina no
    // recibe clics: el segundo clic de un doble clic caia en lo que quedaba
    // debajo, y debajo de la X esta "Contactar" (gtm-cta), que contaba una
    // conversion de la campaña que nadie quiso hacer.
    const cerrarPorClic = () => {
        document.body.style.pointerEvents = 'none';
        setTimeout(() => { document.body.style.pointerEvents = ''; }, 500);
        visor.close();
    };

    document.getElementById('visor-cerrar').addEventListener('click', cerrarPorClic);

    // Tocar el fondo oscuro, fuera del video o del tour, tambien cierra. No en
    // el primer medio segundo: si no, el segundo clic de un doble clic sobre
    // el poster cerraba el visor apenas se abria.
    visor.addEventListener('click', (e) => {
        if (performance.now() - abiertoEn < 500) return;
        if (e.target === visor || e.target === contenido) cerrarPorClic();
    });
}
