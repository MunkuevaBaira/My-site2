// 1. ГОД
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2. ТЕМА
const themeBtn = document.querySelector('#theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    });
}

// 3. БУРГЕР
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        siteNav.classList.toggle('is-open');
    });
}

// 4. ОТПРАВКА ФОРМЫ
const form = document.querySelector('#contact-form');
const statusMsg = document.querySelector('#form-status');
if (form && statusMsg) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.querySelector('#name').value.trim();
        if (!name) {
            statusMsg.textContent = 'Пожалуйста, укажите имя.';
            statusMsg.style.color = '#e53e3e';
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
                statusMsg.style.color = '#2f855a';
                form.reset();
                setTimeout(() => statusMsg.textContent = '', 5000);
            } else throw new Error();
        } catch (error) {
            statusMsg.textContent = 'Ошибка при отправке.';
            statusMsg.style.color = '#e53e3e';
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// 5. КНОПКА НАВЕРХ
const upBtn = document.querySelector('#to-top');
if (upBtn) {
    window.addEventListener('scroll', () => {
        upBtn.classList.toggle('visible', window.scrollY > 400);
    });
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 6. СЛАБОВИДЯЩИЕ
const accToggle = document.querySelector('#accessibility-toggle');
const accPanel = document.querySelector('#accessibility-panel');
const accClose = document.querySelector('#acc-close');
const htmlEl = document.documentElement;

if (accToggle && accPanel && accClose) {
    accToggle.addEventListener('click', () => {
        accPanel.classList.add('open');
        accPanel.setAttribute('aria-hidden', 'false');
    });
    accClose.addEventListener('click', () => {
        accPanel.classList.remove('open');
        accPanel.setAttribute('aria-hidden', 'true');
    });
}

let currentFontSize = 16;
const btnFontUp = document.querySelector('#acc-font-up');
const btnFontDown = document.querySelector('#acc-font-down');
const btnFontReset = document.querySelector('#acc-font-reset');

if (btnFontUp) btnFontUp.addEventListener('click', () => {
    if (currentFontSize < 32) { currentFontSize += 2; htmlEl.style.setProperty('--base-font-size', `${currentFontSize}px`); }
});
if (btnFontDown) btnFontDown.addEventListener('click', () => {
    if (currentFontSize > 12) { currentFontSize -= 2; htmlEl.style.setProperty('--base-font-size', `${currentFontSize}px`); }
});
if (btnFontReset) btnFontReset.addEventListener('click', () => {
    currentFontSize = 16; htmlEl.style.setProperty('--base-font-size', `16px`);
});

document.querySelectorAll('.acc-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        htmlEl.classList.remove('theme-bw', 'theme-wb', 'theme-bb');
        const theme = btn.getAttribute('data-theme');
        if (theme === 'bw') htmlEl.classList.add('theme-bw');
        if (theme === 'wb') htmlEl.classList.add('theme-wb');
        if (theme === 'bb') htmlEl.classList.add('theme-bb');
    });
});

const imgToggle = document.querySelector('#acc-images');
if (imgToggle) {
    imgToggle.addEventListener('change', (e) => {
        if (e.target.checked) htmlEl.classList.add('hide-images');
        else htmlEl.classList.remove('hide-images');
    });
}

const speechToggle = document.querySelector('#acc-speech');
let isSpeechEnabled = false;
if (speechToggle) {
    speechToggle.addEventListener('change', (e) => { isSpeechEnabled = e.target.checked; });
}

function speakText(text) {
    if (!isSpeechEnabled || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
}

document.querySelectorAll('h1, h2, h3, p, li, a, button, label').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const textToSpeak = el.tagName === 'BUTTON' && el.title ? el.title : el.textContent;
        speakText(textToSpeak);
    });
});

const btnResetAll = document.querySelector('#acc-reset-all');
if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
        currentFontSize = 16; htmlEl.style.setProperty('--base-font-size', `16px`);
        htmlEl.classList.remove('theme-bw', 'theme-wb', 'theme-bb', 'hide-images');
        if (imgToggle) imgToggle.checked = false;
        if (speechToggle) speechToggle.checked = false;
        isSpeechEnabled = false;
        window.speechSynthesis.cancel();
    });
}

// === МОДАЛКА И СЛАЙДЕР ДЛЯ СТРАНИЦЫ КОМПОНЕНТОВ ===
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
if (openButtons.length > 0) {
    let lastFocused = null;
    const openModal = (modal) => {
        lastFocused = document.activeElement;
        modal.hidden = false;
        modal.querySelector('input, button')?.focus();
        document.body.style.overflow = 'hidden';
    };
    const closeModal = (modal) => {
        modal.hidden = true;
        document.body.style.overflow = '';
        lastFocused?.focus();
    };
    openButtons.forEach(btn => btn.addEventListener('click', () => {
        const modal = document.querySelector(btn.dataset.openModal);
        if (modal) openModal(modal);
    }));
    closeButtons.forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay'))));
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.querySelectorAll('.modal-overlay:not([hidden])').forEach(closeModal);
    });
}

const slider = document.querySelector('.slider');
if (slider) {
    const track = slider.querySelector('.slider__track');
    const slides = slider.querySelectorAll('.slider__slide');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    const dotsBox = slider.querySelector('.slider__dots');
    let currentIndex = 0;
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider__dot';
        dot.addEventListener('click', () => goTo(i));
        dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll('.slider__dot');
    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === slides.length - 1;
    }
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
    goTo(0);
}

const tabs = document.querySelectorAll('.tabs__tab');
const panels = document.querySelectorAll('.tabs__panel');
if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
            panels.forEach(p => p.hidden = true);
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            document.querySelector(tab.dataset.tab).hidden = false;
        });
    });
}