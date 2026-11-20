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
    selectedItems: new Map(), // id -> { id, label, type }
    bookingInView: false,
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
    notesGrid: document.getElementById('notes-grid'),
    articleModalBackdrop: document.getElementById('article-modal-backdrop'),
    articleModalClose: document.getElementById('article-modal-close'),
    articleModalMeta: document.getElementById('article-modal-meta'),
    articleModalTitle: document.getElementById('article-modal-title'),
    articleModalBody: document.getElementById('article-modal-body'),
    articleModalBookBtn: document.getElementById('article-modal-book-btn'),
    assistantLauncher: document.getElementById('assistant-launcher'),
    assistantPanel: document.getElementById('assistant-panel'),
    assistantClose: document.getElementById('assistant-close'),
    assistantMessages: document.getElementById('assistant-messages'),
    assistantChips: document.getElementById('assistant-chips'),
    assistantForm: document.getElementById('assistant-form'),
    assistantInput: document.getElementById('assistant-input'),
    bookingForm: document.getElementById('booking-form'),
    addressFieldGroup: document.getElementById('address-field-group'),
    preferredDateInput: document.getElementById('preferred-date'),
    formSelectedCount: document.getElementById('form-selected-count'),
    formSelectedChips: document.getElementById('form-selected-chips'),
    submitSummaryBtn: document.getElementById('submit-summary-btn'),
    bookingConfirmation: document.getElementById('booking-confirmation'),
    confirmationSummaryText: document.getElementById('confirmation-summary-text'),
    confirmationWhatsappLink: document.getElementById('confirmation-whatsapp-link'),
    copyAddressBtn: document.getElementById('copy-address-btn'),
    tray: document.getElementById('selection-tray'),
    trayCount: document.getElementById('tray-count'),
    trayPreview: document.getElementById('tray-preview'),
    trayClearBtn: document.getElementById('tray-clear-btn'),
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

  function formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatReadableDate(isoStr) {
    if (!isoStr) return '';
    const parts = isoStr.split('-').map(Number);
    const dt = new Date(parts[0], parts[1] - 1, parts[2]);
    return dt.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

      const weekday = map.weekday; // Sun, Mon, ...
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

    // Highlight active section in desktop nav
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

    // Mobile drawer
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
     Test Directory: Categories, Instant Search & Selection
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
            Clear the filter or send your doctor’s prescription directly on WhatsApp.
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
      .map((test) => {
        const isSelected = state.selectedItems.has(test.id);
        return `
          <article class="test-card ${isSelected ? 'is-selected' : ''}" data-test-id="${escapeHtml(test.id)}">
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
                <button
                  type="button"
                  id="select-test-${escapeHtml(test.id)}"
                  class="btn-select-test ${isSelected ? 'is-selected' : ''}"
                  data-toggle-item="${escapeHtml(test.id)}"
                  data-item-label="${escapeHtml(test.name)}"
                  data-item-type="test"
                  aria-pressed="${isSelected}"
                >
                  ${isSelected ? '&#10003; Added' : '+ Add to Inquiry'}
                </button>
              </div>
            </div>
          </article>
        `;
      })
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

    els.testGrid?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle-item]');
      if (!btn) return;
      const id = btn.getAttribute('data-toggle-item');
      const label = btn.getAttribute('data-item-label');
      toggleSelectedItem(id, label, 'test');
    });
  }

  /* --------------------------------------------------------------------------
     Preventive Health Checkup Packages
     -------------------------------------------------------------------------- */

  function renderPackages() {
    if (!els.packagesGrid) return;
    els.packagesGrid.innerHTML = DATA.packages
      .map((pkg) => {
        const isSelected = state.selectedItems.has(pkg.id);
        return `
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
              <button
                type="button"
                id="book-pkg-${escapeHtml(pkg.id)}"
                class="btn ${isSelected ? 'btn--secondary' : 'btn--primary'} btn--sm"
                data-select-package="${escapeHtml(pkg.id)}"
                data-package-name="${escapeHtml(pkg.name)}"
              >
                ${isSelected ? '&#10003; Selected for Booking' : 'Select & Book Panel'}
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function initPackages() {
    renderPackages();

    els.packagesGrid?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-select-package]');
      if (!btn) return;
      const id = btn.getAttribute('data-select-package');
      const name = btn.getAttribute('data-package-name');

      if (!state.selectedItems.has(id)) {
        state.selectedItems.set(id, { id, label: name, type: 'package' });
        syncSelectionUI();
        showToast(`Added “${name}” to your booking inquiry`);
      }

      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     Shared Selected Tests & Packages Tray + Form Sync
     -------------------------------------------------------------------------- */

  function toggleSelectedItem(id, label, type) {
    if (state.selectedItems.has(id)) {
      state.selectedItems.delete(id);
    } else {
      state.selectedItems.set(id, { id, label, type });
      showToast(`Added “${label}”`);
    }
    syncSelectionUI();
  }

  function syncSelectionUI() {
    renderTestGrid();
    renderPackages();
    // Re-reveal any newly re-rendered package cards immediately
    els.packagesGrid?.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));

    const items = Array.from(state.selectedItems.values());
    const count = items.length;

    // Update form chip list
    if (els.formSelectedCount) {
      els.formSelectedCount.textContent = String(count);
    }
    if (els.formSelectedChips) {
      if (!count) {
        els.formSelectedChips.innerHTML = `
          <span class="selected-tests-empty">
            No tests selected from the directory yet — you can pick tests above or type them below.
          </span>
        `;
      } else {
        els.formSelectedChips.innerHTML = items
          .map(
            (item) => `
              <span class="selected-chip">
                <span>${escapeHtml(item.label)}</span>
                <button
                  type="button"
                  data-remove-chip="${escapeHtml(item.id)}"
                  aria-label="Remove ${escapeHtml(item.label)}"
                >&times;</button>
              </span>
            `
          )
          .join('');
      }
    }

    // Update floating bottom tray (hide while user is already in #booking)
    if (els.tray && els.trayCount && els.trayPreview) {
      if (count > 0 && !state.bookingInView) {
        els.trayCount.textContent = `${count} investigation${count === 1 ? '' : 's'} selected`;
        els.trayPreview.textContent = items.map((i) => i.label).join(' · ');
        els.tray.classList.add('is-visible');
      } else {
        els.tray.classList.remove('is-visible');
      }
    }
  }

  function initSelectionSync() {
    els.formSelectedChips?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-chip]');
      if (!btn) return;
      const id = btn.getAttribute('data-remove-chip');
      state.selectedItems.delete(id);
      syncSelectionUI();
    });

    els.trayClearBtn?.addEventListener('click', () => {
      state.selectedItems.clear();
      syncSelectionUI();
      showToast('Cleared selected investigations');
    });

    // Hide floating tray automatically when #booking section is visible
    const bookingEl = document.getElementById('booking');
    if (bookingEl && 'IntersectionObserver' in window) {
      const bookingObserver = new IntersectionObserver(
        (entries) => {
          state.bookingInView = entries[0]?.isIntersecting || false;
          if (els.tray) {
            els.tray.classList.toggle(
              'is-visible',
              state.selectedItems.size > 0 && !state.bookingInView
            );
          }
        },
        { threshold: 0.15 }
      );
      bookingObserver.observe(bookingEl);
    }
  }

  /* --------------------------------------------------------------------------
     Patient Preparation & Fasting Guide Accordion
     -------------------------------------------------------------------------- */

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
     Booking Form: Validation, WhatsApp Builder & Summary Confirmation
     -------------------------------------------------------------------------- */

  function getNextWorkingDay() {
    const dt = new Date();
    dt.setDate(dt.getDate() + 1);
    if (dt.getDay() === 0) {
      // Skip Sunday
      dt.setDate(dt.getDate() + 1);
    }
    return dt;
  }

  function clearFormErrors() {
    ['error-patient-name', 'error-patient-phone', 'error-preferred-date', 'error-patient-address'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function collectAndValidateBooking() {
    clearFormErrors();
    const form = els.bookingForm;
    if (!form) return null;

    const visitType = form.querySelector('input[name="visitType"]:checked')?.value || 'Home Sample Collection';
    const name = form.patientName.value.trim();
    const phone = form.patientPhone.value.trim();
    const dateVal = form.preferredDate.value;
    const slot = form.preferredSlot.value;
    const address = form.patientAddress.value.trim();
    const notes = form.notes.value.trim();

    let valid = true;

    if (name.length < 2) {
      document.getElementById('error-patient-name').textContent = 'Please enter the patient’s full name.';
      valid = false;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      document.getElementById('error-patient-phone').textContent = 'Please enter a valid 10-digit mobile number.';
      valid = false;
    }

    if (!dateVal) {
      document.getElementById('error-preferred-date').textContent = 'Please choose a preferred date.';
      valid = false;
    } else {
      const [y, m, d] = dateVal.split('-').map(Number);
      const chosen = new Date(y, m - 1, d);
      if (chosen.getDay() === 0) {
        document.getElementById('error-preferred-date').textContent =
          'The laboratory is closed on Sundays. Please pick Monday – Saturday.';
        valid = false;
      }
    }

    if (visitType === 'Home Sample Collection' && address.length < 6) {
      document.getElementById('error-patient-address').textContent =
        'Please share your building name and Mahim / nearby Mumbai address for home collection.';
      valid = false;
    }

    if (!valid) return null;

    const selectedList = Array.from(state.selectedItems.values()).map((i) => i.label);

    return {
      visitType,
      name,
      phone,
      dateFormatted: formatReadableDate(dateVal),
      slot,
      address,
      selectedList,
      notes,
    };
  }

  function buildBookingMessage(booking) {
    const lines = [
      `Hello Dr. Wilson Menezes Pathology Lab,`,
      `I would like to request a *${booking.visitType}*.`,
      ``,
      `*Patient:* ${booking.name}`,
      `*Contact:* ${booking.phone}`,
      `*Preferred Date:* ${booking.dateFormatted}`,
      `*Time Slot:* ${booking.slot}`,
    ];

    if (booking.visitType === 'Home Sample Collection' && booking.address) {
      lines.push(`*Address:* ${booking.address}`);
    }

    if (booking.selectedList.length) {
      lines.push(`*Requested Tests:* ${booking.selectedList.join(', ')}`);
    }

    if (booking.notes) {
      lines.push(`*Notes:* ${booking.notes}`);
    }

    return lines.join('\n');
  }

  function showBookingSummary(booking, waUrl) {
    if (!els.bookingConfirmation || !els.confirmationSummaryText) return;
    const summaryLines = [
      `Service: ${booking.visitType}`,
      `Patient: ${booking.name} (${booking.phone})`,
      `Preferred Slot: ${booking.dateFormatted} · ${booking.slot}`,
    ];
    if (booking.visitType === 'Home Sample Collection' && booking.address) {
      summaryLines.push(`Address: ${booking.address}`);
    }
    if (booking.selectedList.length) {
      summaryLines.push(`Tests: ${booking.selectedList.join(', ')}`);
    }
    if (booking.notes) {
      summaryLines.push(`Notes: ${booking.notes}`);
    }

    els.confirmationSummaryText.textContent = summaryLines.join('\n');
    if (els.confirmationWhatsappLink) {
      els.confirmationWhatsappLink.href = waUrl;
    }
    els.bookingConfirmation.classList.add('is-visible');
    els.bookingConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function initBookingForm() {
    if (!els.bookingForm) return;

    // Set sensible minimum & default date (next working day)
    const today = new Date();
    const nextWork = getNextWorkingDay();
    if (els.preferredDateInput) {
      els.preferredDateInput.min = formatDateISO(today);
      els.preferredDateInput.value = formatDateISO(nextWork);
    }

    // Show/hide address field based on Visit Type
    const visitRadios = els.bookingForm.querySelectorAll('input[name="visitType"]');
    function updateAddressVisibility() {
      const selected = els.bookingForm.querySelector('input[name="visitType"]:checked')?.value;
      const isHome = selected === 'Home Sample Collection';
      if (els.addressFieldGroup) {
        els.addressFieldGroup.style.display = isHome ? 'flex' : 'none';
      }
    }
    visitRadios.forEach((r) => r.addEventListener('change', updateAddressVisibility));
    updateAddressVisibility();

    // Primary submit -> WhatsApp + summary card
    els.bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const booking = collectAndValidateBooking();
      if (!booking) return;

      const msg = buildBookingMessage(booking);
      const waUrl = `https://wa.me/${DATA.clinic.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      showBookingSummary(booking, waUrl);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp with your booking details…');
    });

    // Secondary action -> Generate on-page summary without leaving page
    els.submitSummaryBtn?.addEventListener('click', () => {
      const booking = collectAndValidateBooking();
      if (!booking) return;

      const msg = buildBookingMessage(booking);
      const waUrl = `https://wa.me/${DATA.clinic.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      showBookingSummary(booking, waUrl);
      showToast('Booking summary generated below');
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
     Why Families Stay, Patient Notes + Reader Modal & Lab Desk Assistant
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

  function initPatientNotes() {
    if (!els.notesGrid || !Array.isArray(DATA.patientNotes)) return;

    els.notesGrid.innerHTML = DATA.patientNotes
      .map(
        (note) => `
          <article class="note-card">
            <div>
              <div class="note-card__meta">
                <span>${escapeHtml(note.date)}</span>
                <span>${escapeHtml(note.readTime)}</span>
              </div>
              <h3 class="note-card__title">${escapeHtml(note.title)}</h3>
              <p class="note-card__summary">${escapeHtml(note.summary)}</p>
            </div>
            <button
              type="button"
              class="note-card__trigger"
              id="read-${escapeHtml(note.id)}"
              data-open-note="${escapeHtml(note.id)}"
            >
              Read the note <span aria-hidden="true">&rarr;</span>
            </button>
          </article>
        `
      )
      .join('');

    let lastFocusedTrigger = null;

    function openArticleModal(noteId, triggerEl) {
      const note = DATA.patientNotes.find((n) => n.id === noteId);
      if (!note || !els.articleModalBackdrop) return;

      lastFocusedTrigger = triggerEl || null;
      if (els.articleModalMeta) {
        els.articleModalMeta.textContent = `${note.date} · ${note.readTime}`;
      }
      if (els.articleModalTitle) {
        els.articleModalTitle.textContent = note.title;
      }
      if (els.articleModalBody) {
        els.articleModalBody.innerHTML = note.paragraphs
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join('');
      }

      els.articleModalBackdrop.hidden = false;
      els.articleModalBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      els.articleModalClose?.focus();
    }

    function closeArticleModal() {
      if (!els.articleModalBackdrop) return;
      els.articleModalBackdrop.classList.remove('is-open');
      els.articleModalBackdrop.hidden = true;
      document.body.style.overflow = '';
      lastFocusedTrigger?.focus();
    }

    els.notesGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-note]');
      if (!btn) return;
      openArticleModal(btn.getAttribute('data-open-note'), btn);
    });

    els.articleModalClose?.addEventListener('click', closeArticleModal);
    els.articleModalBookBtn?.addEventListener('click', closeArticleModal);
    els.articleModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === els.articleModalBackdrop) closeArticleModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.articleModalBackdrop?.classList.contains('is-open')) {
        closeArticleModal();
      }
    });
  }

  function answerLabQuery(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return null;

    // 1. Check direct clinic logistics
    if (/(sunday|open|hour|timing|time|close|schedule)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-hours')?.answer;
    }
    if (/(home|collect|visit|dadar|bandra|matunga|mahim east)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-home')?.answer;
    }
    if (/(address|where|location|map|canossa|garden colony|soonawala|direction)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-location')?.answer;
    }
    if (/(report|turnaround|ready|pdf|whatsapp|result)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-reports')?.answer;
    }

    // 2. Check specific test match in catalogue
    const matchedTests = DATA.tests.filter((t) => {
      const hay = `${t.name} ${t.code} ${t.category} ${t.keywords}`.toLowerCase();
      return q
        .split(/\s+/)
        .filter((word) => word.length >= 2 && !['for', 'test', 'tests', 'need', 'fasting', 'fast', 'what', 'how', 'do', 'does', 'is', 'the', 'can', 'you'].includes(word))
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
      return `${details} You can add it from our Test Directory or call +91 80803 65359 to confirm preparation.`;
    }

    if (/(fast|empty stomach|water|tea|coffee|medicine|tablet)/.test(q)) {
      return DATA.assistantQuickQuestions.find((x) => x.id === 'q-fasting')?.answer;
    }

    if (/(doctor|wilson|menezes|qualification|experience|mmc|tnmc|rank)/.test(q)) {
      return `Dr. Wilson Menezes completed his M.D. (Pathology) from Topiwala National Medical College, Mumbai in 1985 (Ranked 1st in Mumbai University; MMC Reg. No. 49541) and has practised in Mahim West for over 40 years.`;
    }

    return `I answer based on our clinic information here, and may not have details for every specialised query. Please call +91 80803 65359 (Mon – Sat, 8:00 AM – 7:00 PM) or share your prescription on WhatsApp and our desk will help right away.`;
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
     Bootstrap
     -------------------------------------------------------------------------- */

  function init() {
    if (els.currentYear) {
      els.currentYear.textContent = String(new Date().getFullYear());
    }
    updateClinicStatus();
    setInterval(updateClinicStatus, 60000);

    initNavigation();
    initTestDirectory();
    initPackages();
    initWhyTrust();
    initSelectionSync();
    initPrepGuide();
    initPatientNotes();
    initBookingForm();
    initLocationHelpers();
    initLabAssistant();
    initScrollReveal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
