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
// WHATSAPP CONTACT HANDLER
// ============================================================================
function contactarWhatsApp(paquete) {
    const mensajes = {
        'Pack Airbnb Standard': 'Hola, vengo de tourvirtual360.pro y quiero más información sobre el *Pack Airbnb Standard* (Tour 8K + fotos optimizadas) para mi alojamiento en [Barrio/Zona]. ¿Agenda disponible esta semana?',
        'Pack Plus & Casas de Campo': 'Hola, vengo de tourvirtual360.pro y quiero más información sobre el *Pack Plus & Casas de Campo* con vuelo de dron interior para mi alojamiento en [Barrio/Zona]. ¿Cuándo pueden venir?',
        'Independencia de Plataformas': 'Hola, vengo de tourvirtual360.pro y quiero más información sobre *Independencia de Plataformas* para vender directo sin comisiones con landing y pagos. ¿Cuál es el siguiente paso?',
        'Punta del Diablo': 'Hola! Soy de Punta del Diablo y vi que viajan desde Montevideo a fin de marzo. Me interesa reservar un cupo para un Tour 360 sin costo de traslado. ¿Tienen disponibilidad?'
    };

    const mensaje = mensajes[paquete] || 'Hola, quiero información sobre un Tour Virtual';
    const whatsappUrl = `https://wa.me/59891665895?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

// ============================================================================
// ANALYTICS - Link tracking for GTM
// ============================================================================
document.querySelectorAll('a[href*="wa.me"], button.gtm-cta').forEach(element => {
    element.addEventListener('click', (e) => {
        if (window.gtag) {
            gtag('event', 'click', {
                'event_category': 'engagement',
                'event_label': element.getAttribute('aria-label') || element.textContent.trim()
            });
        }
    });
});

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
// ============================================================================
// COUNTDOWN TIMER - Punta del Diablo Campaign
// ============================================================================
function initCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    // Fecha objetivo: 27 de marzo de 2026 a las 20:00 GMT-3 (Uruguay)
    const targetDate = new Date('2026-03-27T20:00:00-03:00');

    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;

        if (difference <= 0) {
            countdownElement.textContent = 'CERRADO';
            countdownElement.style.color = '#ef4444';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        if (days > 0) {
            countdownElement.textContent = `${days}D ${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            countdownElement.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
        }
    }

    // Actualizar inmediatamente
    updateCountdown();
    
    // Actualizar cada segundo
    setInterval(updateCountdown, 1000);
}

// Iniciar countdown cuando cargue el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
} else {
    initCountdown();
}