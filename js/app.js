/**
 * Dr. Wilson Menezes Pathology Lab — Interactive Behavior
 */

(function () {
  'use strict';

  const DATA = window.CLINIC_DATA;
  if (!DATA) return;

  // Application State
  const state = {
    activeCategory: 'all',
    searchQuery: '',
  };

  // DOM References
  const els = {
    header: document.getElementById('site-header'),
    statusText: document.getElementById('live-status-text'),
    statusDot: document.getElementById('live-status-dot'),
    mobileOpenBtn: document.getElementById('mobile-menu-open'),
    mobileCloseBtn: document.getElementById('mobile-menu-close'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    searchInput: document.getElementById('test-search-input'),
    searchClear: document.getElementById('test-search-clear'),
    categoryTabs: document.getElementById('category-tabs'),
    testGrid: document.getElementById('test-grid'),
    testCountDisplay: document.getElementById('test-count-display'),
    packagesGrid: document.getElementById('packages-grid'),
    trustGrid: document.getElementById('trust-grid'),
    prepAccordion: document.getElementById('prep-accordion'),
    printPrepBtn: document.getElementById('print-prep-btn'),
    assistantLauncher: document.getElementById('assistant-launcher'),
    assistantPanel: document.getElementById('assistant-panel'),
    assistantClose: document.getElementById('assistant-close'),
    assistantMessages: document.getElementById('assistant-messages'),
    assistantChips: document.getElementById('assistant-chips'),
    assistantForm: document.getElementById('assistant-form'),
    assistantInput: document.getElementById('assistant-input'),
    copyAddressBtn: document.getElementById('copy-address-btn'),
    toast: document.getElementById('toast'),
    currentYear: document.getElementById('current-year'),
  };

  let toastTimer = null;

  /* --------------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('is-visible');
    }, 3000);
  }

  function syncPhoneLinks() {
    const telHref = `tel:${DATA.clinic.phoneHref}`;
    document.querySelectorAll('[data-call-link]').forEach((el) => {
      el.setAttribute('href', telHref);
    });
    document.querySelectorAll('[data-phone-text]').forEach((el) => {
      el.textContent = DATA.clinic.phoneDisplay;
    });
  }

  /* --------------------------------------------------------------------------
     Live Mumbai (IST) Clinic Open/Closed Status
     -------------------------------------------------------------------------- */

  function updateClinicStatus() {
    if (!els.statusText) return;
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(now);

      const map = {};
      parts.forEach((p) => {
        map[p.type] = p.value;
      });

      const weekday = map.weekday;
      const hour = parseInt(map.hour, 10);
      const isSunday = weekday === 'Sun';
      const isOpen =
        !isSunday &&
        hour >= DATA.clinic.hours.openHour &&
        hour < DATA.clinic.hours.closeHour;

      const labelSpan = els.statusText.querySelector('span:last-child');
      if (isOpen) {
        if (els.statusDot) els.statusDot.classList.remove('status-dot--closed');
        if (labelSpan) labelSpan.textContent = 'Open Now in Mahim · Closes 7:00 PM IST';
      } else {
        if (els.statusDot) els.statusDot.classList.add('status-dot--closed');
        const nextMsg = isSunday
          ? 'Closed Today (Sunday) · Opens Mon 8:00 AM'
          : hour < DATA.clinic.hours.openHour
          ? 'Opens Today at 8:00 AM IST'
          : weekday === 'Sat'
          ? 'Closed · Opens Monday 8:00 AM IST'
          : 'Closed · Opens Tomorrow 8:00 AM IST';
        if (labelSpan) labelSpan.textContent = nextMsg;
      }
    } catch (_err) {
      // Fallback text already present in HTML
    }
  }

  /* --------------------------------------------------------------------------
     Header Scroll State, Active Nav & Mobile Drawer
     -------------------------------------------------------------------------- */

  function initNavigation() {
    window.addEventListener(
      'scroll',
      () => {
        if (els.header) {
          els.header.classList.toggle('is-scrolled', window.scrollY > 12);
        }
      },
      { passive: true }
    );

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
        },
        { rootMargin: '-30% 0px -55% 0px' }
      );
      sections.forEach((sec) => observer.observe(sec));
    }

    function openDrawer() {
      if (!els.mobileDrawer) return;
      els.mobileDrawer.hidden = false;
      els.mobileDrawer.classList.add('is-open');
      els.mobileOpenBtn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      els.mobileCloseBtn?.focus();
    }

    function closeDrawer() {
      if (!els.mobileDrawer) return;
      els.mobileDrawer.classList.remove('is-open');
      els.mobileDrawer.hidden = true;
      els.mobileOpenBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    els.mobileOpenBtn?.addEventListener('click', openDrawer);
    els.mobileCloseBtn?.addEventListener('click', closeDrawer);
    els.mobileDrawer?.addEventListener('click', (e) => {
      if (e.target === els.mobileDrawer) closeDrawer();
    });
    els.mobileDrawer?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.mobileDrawer?.classList.contains('is-open')) {
        closeDrawer();
        els.mobileOpenBtn?.focus();
      }
    });

    // Footer specialty quick-jump links
    document.querySelectorAll('[data-filter-jump]').forEach((link) => {
      link.addEventListener('click', () => {
        const cat = link.getAttribute('data-filter-jump');
        if (cat) {
          state.activeCategory = cat;
          state.searchQuery = '';
          if (els.searchInput) els.searchInput.value = '';
          els.searchClear?.classList.remove('is-visible');
          renderCategoryTabs();
          renderTestGrid();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Test Directory: Categories & Instant Search
     -------------------------------------------------------------------------- */

  function getCategoryCount(catId) {
    if (catId === 'all') return DATA.tests.length;
    return DATA.tests.filter((t) => t.category === catId).length;
  }

  function renderCategoryTabs() {
    if (!els.categoryTabs) return;
    els.categoryTabs.innerHTML = DATA.categories
      .map((cat) => {
        const isActive = state.activeCategory === cat.id;
        const count = getCategoryCount(cat.id);
        return `
          <button
            type="button"
            role="tab"
            id="cat-tab-${escapeHtml(cat.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}"
            class="cat-tab ${isActive ? 'is-active' : ''}"
            aria-selected="${isActive}"
            data-category="${escapeHtml(cat.id)}"
          >
            <span>${escapeHtml(cat.label)}</span>
            <span class="cat-tab__count">${count}</span>
          </button>
        `;
      })
      .join('');
  }

  function getFilteredTests() {
    const q = state.searchQuery.trim().toLowerCase();
    return DATA.tests.filter((test) => {
      const matchesCat = state.activeCategory === 'all' || test.category === state.activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = `${test.name} ${test.code} ${test.category} ${test.description} ${test.keywords}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderTestGrid() {
    if (!els.testGrid) return;
    const filtered = getFilteredTests();
    const telHref = `tel:${DATA.clinic.phoneHref}`;

    if (els.testCountDisplay) {
      const total = DATA.tests.length;
      if (state.searchQuery.trim()) {
        els.testCountDisplay.textContent = `Showing ${filtered.length} matching investigation${filtered.length === 1 ? '' : 's'}`;
      } else if (state.activeCategory === 'all') {
        els.testCountDisplay.textContent = `Showing all ${total} core investigations`;
      } else {
        els.testCountDisplay.textContent = `${filtered.length} ${state.activeCategory} investigation${filtered.length === 1 ? '' : 's'}`;
      }
    }

    if (!filtered.length) {
      els.testGrid.innerHTML = `
        <div class="directory-empty" style="grid-column: 1 / -1;">
          <h3>No matching tests found for “${escapeHtml(state.searchQuery)}”</h3>
          <p>
            Our laboratory performs many additional specialised assays beyond this quick directory.
            Clear the filter or call our reception desk directly.
          </p>
          <button type="button" class="btn btn--secondary btn--sm" id="reset-directory-btn">
            Show All Investigations
          </button>
        </div>
      `;
      document.getElementById('reset-directory-btn')?.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        if (els.searchInput) els.searchInput.value = '';
        els.searchClear?.classList.remove('is-visible');
        renderCategoryTabs();
        renderTestGrid();
      });
      return;
    }

    els.testGrid.innerHTML = filtered
      .map(
        (test) => `
          <article class="test-card" data-test-id="${escapeHtml(test.id)}">
            <div>
              <div class="test-card__top">
                <span class="test-card__category">${escapeHtml(test.category)}</span>
                <span class="test-card__code">${escapeHtml(test.code)}</span>
              </div>
              <h3 class="test-card__name">${escapeHtml(test.name)}</h3>
              <p class="test-card__desc">${escapeHtml(test.description)}</p>
            </div>

            <div>
              <div class="test-card__meta">
                <div>
                  <span class="meta-pair__label">Sample</span>
                  <span class="meta-pair__val">${escapeHtml(test.sample)}</span>
                </div>
                <div>
                  <span class="meta-pair__label">Report Time</span>
                  <span class="meta-pair__val">${escapeHtml(test.turnaround)}</span>
                </div>
              </div>

              <div class="test-card__footer">
                <span class="fasting-tag ${test.fastingRequired ? 'fasting-tag--required' : ''}">
                  ${escapeHtml(test.fasting)}
                </span>
                <a
                  href="${escapeHtml(telHref)}"
                  id="book-test-${escapeHtml(test.id)}"
                  class="btn-select-test"
                  data-call-link
                >
                  Call to Book
                </a>
              </div>
            </div>
          </article>
        `
      )
      .join('');
  }

  function initTestDirectory() {
    renderCategoryTabs();
    renderTestGrid();

    els.categoryTabs?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category]');
      if (!btn) return;
      state.activeCategory = btn.getAttribute('data-category');
      renderCategoryTabs();
      renderTestGrid();
    });

    els.searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      els.searchClear?.classList.toggle('is-visible', state.searchQuery.length > 0);
      renderTestGrid();
    });

    els.searchClear?.addEventListener('click', () => {
      state.searchQuery = '';
      if (els.searchInput) {
        els.searchInput.value = '';
        els.searchInput.focus();
      }
      els.searchClear.classList.remove('is-visible');
      renderTestGrid();
    });
  }

  /* --------------------------------------------------------------------------
     Preventive Health Checkup Packages
     -------------------------------------------------------------------------- */

  function initPackages() {
    if (!els.packagesGrid) return;
    const telHref = `tel:${DATA.clinic.phoneHref}`;

    els.packagesGrid.innerHTML = DATA.packages
      .map(
        (pkg) => `
          <article class="package-card reveal">
            <div>
              <div class="package-card__head">
                <div>
                  <span class="package-card__audience">${escapeHtml(pkg.audience)}</span>
                  <h3 class="package-card__title">${escapeHtml(pkg.name)}</h3>
                </div>
                <span class="package-card__params">${escapeHtml(pkg.parameters)}</span>
              </div>
              <p class="package-card__summary">${escapeHtml(pkg.summary)}</p>
              <ul class="package-card__list">
                ${pkg.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </div>

            <div class="package-card__footer">
              <span class="package-card__prep">${escapeHtml(pkg.prep)}</span>
              <a
                href="${escapeHtml(telHref)}"
                id="book-pkg-${escapeHtml(pkg.id)}"
                class="btn btn--primary btn--sm"
                data-call-link
              >
                Call to Book Panel
              </a>
            </div>
          </article>
        `
      )
      .join('');
  }

  /* --------------------------------------------------------------------------
     Why Families Stay & Patient Preparation Accordion
     -------------------------------------------------------------------------- */

  function initWhyTrust() {
    if (!els.trustGrid || !Array.isArray(DATA.whyTrust)) return;
    els.trustGrid.innerHTML = DATA.whyTrust
      .map(
        (item) => `
          <div class="trust-item">
            <h3 class="trust-item__title">${escapeHtml(item.title)}</h3>
            <p class="trust-item__body">${escapeHtml(item.body)}</p>
          </div>
        `
      )
      .join('');
  }

  function initPrepGuide() {
    if (!els.prepAccordion) return;

    els.prepAccordion.innerHTML = DATA.prepGuides
      .map((guide, idx) => {
        const expanded = idx === 0;
        return `
          <div class="accordion-item">
            <h3>
              <button
                type="button"
                class="accordion-trigger"
                id="prep-trigger-${escapeHtml(guide.id)}"
                aria-expanded="${expanded}"
                aria-controls="prep-panel-${escapeHtml(guide.id)}"
              >
                <span>
                  ${escapeHtml(guide.title)}
                  <span class="accordion-trigger__meta">${escapeHtml(guide.meta)}</span>
                </span>
                <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </h3>
            <div
              id="prep-panel-${escapeHtml(guide.id)}"
              class="accordion-panel ${expanded ? 'is-open' : ''}"
              role="region"
              aria-labelledby="prep-trigger-${escapeHtml(guide.id)}"
            >
              <ul class="prep-list">
                ${guide.points.map((pt) => `<li>${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      })
      .join('');

    els.prepAccordion.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      panel?.classList.toggle('is-open', !isExpanded);
    });

    els.printPrepBtn?.addEventListener('click', () => {
      window.print();
    });
  }

  /* --------------------------------------------------------------------------
     On-Site Lab Desk Assistant
     -------------------------------------------------------------------------- */

  function answerLabQuery(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return null;

    if (/(sunday|open|hour|timing|time|close|schedule)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-hours')?.answer;
    }
    if (/(book|appointment|home|collect|visit|dadar|bandra|matunga|mahim east)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-home')?.answer;
    }
    if (/(address|where|location|map|canossa|garden colony|soonawala|direction)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-location')?.answer;
    }
    if (/(report|turnaround|ready|pdf|result)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-reports')?.answer;
    }

    const matchedTests = DATA.tests.filter((t) => {
      const hay = `${t.name} ${t.code} ${t.category} ${t.keywords}`.toLowerCase();
      return q
        .split(/\s+/)
        .filter(
          (word) =>
            word.length >= 2 &&
            !['for', 'test', 'tests', 'need', 'fasting', 'fast', 'what', 'how', 'do', 'does', 'is', 'the', 'can', 'you'].includes(word)
        )
        .some((word) => hay.includes(word));
    });

    if (matchedTests.length > 0) {
      const top = matchedTests.slice(0, 2);
      const details = top
        .map(
          (t) =>
            `${t.name} (${t.category}): Fasting — ${t.fasting}; Sample — ${t.sample}; Report time — ${t.turnaround}.`
        )
        .join(' ');
      return `${details} To book this test, please call ${DATA.clinic.phoneDisplay}.`;
    }

    if (/(fast|empty stomach|water|tea|coffee|medicine|tablet)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-fasting')?.answer;
    }

    if (/(doctor|wilson|menezes|qualification|experience|mmc|tnmc|rank)/.test(q)) {
      return `Dr. Wilson Menezes completed his M.D. (Pathology) from Topiwala National Medical College, Mumbai in 1985 (Ranked 1st in Mumbai University; MMC Reg. No. 49541) and has practised in Mahim West for over 40 years.`;
    }

    return `I answer based on our clinic information here, and may not have details for every specialised query. Please call ${DATA.clinic.phoneDisplay} (Mon – Sat, 8:00 AM – 7:00 PM) and our reception desk will help right away.`;
  }

  function initLabAssistant() {
    if (!els.assistantLauncher || !els.assistantPanel) return;

    function appendMessage(text, role) {
      if (!els.assistantMessages) return;
      const div = document.createElement('div');
      div.className = `assistant-msg assistant-msg--${role}`;
      div.textContent = text;
      els.assistantMessages.appendChild(div);
      els.assistantMessages.scrollTop = els.assistantMessages.scrollHeight;
    }

    if (els.assistantChips && Array.isArray(DATA.assistantQuickQuestions)) {
      els.assistantChips.innerHTML = DATA.assistantQuickQuestions
        .map(
          (item) => `
            <button
              type="button"
              class="assistant-chip"
              id="assistant-${escapeHtml(item.id)}"
              data-faq-id="${escapeHtml(item.id)}"
            >
              ${escapeHtml(item.label)}
            </button>
          `
        )
        .join('');
    }

    function toggleAssistant(forceState) {
      const willOpen =
        typeof forceState === 'boolean'
          ? forceState
          : !els.assistantPanel.classList.contains('is-open');
      els.assistantPanel.hidden = !willOpen;
      els.assistantPanel.classList.toggle('is-open', willOpen);
      els.assistantLauncher.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        els.assistantInput?.focus();
      }
    }

    els.assistantLauncher.addEventListener('click', () => toggleAssistant());
    els.assistantClose?.addEventListener('click', () => {
      toggleAssistant(false);
      els.assistantLauncher.focus();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.assistantPanel.classList.contains('is-open')) {
        toggleAssistant(false);
        els.assistantLauncher.focus();
      }
    });

    els.assistantChips?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-faq-id]');
      if (!btn) return;
      const faq = DATA.assistantQuickQuestions.find((f) => f.id === btn.getAttribute('data-faq-id'));
      if (!faq) return;
      appendMessage(faq.label, 'user');
      appendMessage(faq.answer, 'bot');
    });

    els.assistantForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = els.assistantInput?.value.trim();
      if (!val) return;
      appendMessage(val, 'user');
      const reply = answerLabQuery(val);
      if (reply) appendMessage(reply, 'bot');
      els.assistantInput.value = '';
    });
  }

  /* --------------------------------------------------------------------------
     Location Copy Address & Scroll Reveal
     -------------------------------------------------------------------------- */

  function initLocationHelpers() {
    els.copyAddressBtn?.addEventListener('click', async () => {
      const addr = `${DATA.clinic.name}, ${DATA.clinic.fullAddress}`;
      try {
        await navigator.clipboard.writeText(addr);
        showToast('Mahim West clinic address copied to clipboard');
      } catch (_err) {
        showToast('Address: Shop No. C/1, Garden Colony, Mahim West 400016');
      }
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     Bootstrap
     -------------------------------------------------------------------------- */

  function init() {
    if (els.currentYear) {
      els.currentYear.textContent = String(new Date().getFullYear());
    }
    syncPhoneLinks();
    updateClinicStatus();
    setInterval(updateClinicStatus, 60000);

    initNavigation();
    initTestDirectory();
    initPackages();
    initWhyTrust();
    initPrepGuide();
    initLocationHelpers();
    initLabAssistant();
    initScrollReveal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
