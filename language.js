(() => {
  const pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const pageTranslations = siteTranslations[pageName] || {};
  const languageStorageKey = 'portfolio-language';
  const originalText = new WeakMap();
  const pageTitles = {
    index: ['Portfolio', 'Portfolio'],
    chempunk: ['Chempunk - Portfolio', 'Chempunk — Portfolio'],
    windward: ['Windward - Games Portfolio', 'Windward — Portfolio'],
    performance: ['Unity Projects - Portfolio', 'Unity Projekt - Portfolio']
  };

  function setText(element, value) {
    if (!originalText.has(element)) {
      originalText.set(element, element.textContent);
    }
    element.textContent = value;
  }

  function applyEntry(selector, values, language) {
    const elements = document.querySelectorAll(selector);
    const english = values[0];
    const swedish = values[1];
    elements.forEach((element, index) => {
      const original = originalText.get(element) || element.textContent;
      const translated = language === 'sv'
        ? (Array.isArray(swedish) ? swedish[index] : swedish)
        : (Array.isArray(english) ? english[index] : original);
      if (translated !== undefined) {
        setText(element, translated);
      }
    });
  }

  function applyLanguage(language) {
    const entries = { ...siteTranslations.common, ...pageTranslations };
    Object.entries(entries).forEach(([selector, values]) => applyEntry(selector, values, language));
    document.documentElement.lang = language === 'sv' ? 'sv' : 'en';
    document.title = pageTitles[pageName]?.[language === 'sv' ? 1 : 0] || document.title;
    document.querySelectorAll('[data-language]').forEach((button) => {
      const isActive = button.dataset.language === language;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    localStorage.setItem(languageStorageKey, language);
  }

  function createLanguageSwitcher() {
    const header = document.querySelector('.header-inner');
    if (!header) return;
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language');
    switcher.innerHTML = '<button type="button" data-language="en" aria-label="English">EN</button><button type="button" data-language="sv" aria-label="Swedish">SV</button>';
    switcher.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language]');
      if (button) applyLanguage(button.dataset.language);
    });
    header.appendChild(switcher);
  }

  document.addEventListener('DOMContentLoaded', () => {
    createLanguageSwitcher();
    applyLanguage(localStorage.getItem(languageStorageKey) || 'en');
  });
})();
