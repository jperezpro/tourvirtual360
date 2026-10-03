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
// los links que abren WhatsApp (wa.me), incluidos los "Contratar" de los
// packs. Un link que no abre WhatsApp con esa clase infla la conversion que
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
// KUULA INTERSECTION OBSERVER (Carga cuando es visible)
// ============================================================================
const kuulaContainer = document.getElementById('kuula-container');

if (kuulaContainer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = document.createElement('iframe');
                iframe.style.cssText = 'width:100%; height:100%; border:0;';
                iframe.src = 'https://kuula.co/share/collection/n1/7PNXK?logo=0&info=0&fs=1&vr=0&zoom=1&autorotate=0';
                iframe.title = 'Tour Virtual 360 Pro - Demostración de Tour Inmersivo en Kuula';
                iframe.allow = 'gyroscope; accelerometer; autoplay; encrypted-media';
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

                kuulaContainer.appendChild(iframe);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });

    observer.observe(kuulaContainer);
} else if (kuulaContainer) {
    // Fallback para navegadores sin IntersectionObserver
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%; height:100%; border:0;';
    iframe.src = 'https://kuula.co/share/collection/n1/7PNXK?logo=0&info=0&fs=1&vr=0&zoom=1&autorotate=0';
    iframe.title = 'Tour Virtual 360 Pro - Demostración de Tour Inmersivo en Kuula';
    iframe.allow = 'gyroscope; accelerometer; autoplay; encrypted-media';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    kuulaContainer.appendChild(iframe);
}
