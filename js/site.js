/* Saturday Selects — site.js
   Injects shared nav, powers gear page filtering, mobile menu */

(function () {
  'use strict';

  /* ── NAV HTML ── */
  const NAV_HTML = `
<header>
  <div class="header-inner">
    <a class="logo" href="/">Saturday <span>Selects</span></a>

    <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="site-nav">
      <!-- Browse by School -->
      <div class="nav-item has-dropdown">
        <button class="nav-link dropdown-trigger">By School <span class="caret">▾</span></button>
        <div class="dropdown">
          <div class="dropdown-cols">
            <div class="dropdown-col">
              <a class="dropdown-link" href="/posts/alabama-fan-essentials.html">Alabama Crimson Tide</a>
              <a class="dropdown-link" href="/posts/arkansas-fan-essentials.html">Arkansas Razorbacks</a>
              <a class="dropdown-link" href="/posts/auburn-fan-essentials.html">Auburn Tigers</a>
              <a class="dropdown-link" href="/posts/florida-fan-essentials.html">Florida Gators</a>
              <a class="dropdown-link" href="/posts/georgia-fan-essentials.html">Georgia Bulldogs</a>
              <a class="dropdown-link" href="/posts/kentucky-fan-essentials.html">Kentucky Wildcats</a>
              <a class="dropdown-link" href="/posts/lsu-tailgate-essentials.html">LSU Tigers</a>
              <a class="dropdown-link" href="/posts/mississippi-state-fan-essentials.html">Mississippi State</a>
            </div>
            <div class="dropdown-col">
              <a class="dropdown-link" href="/posts/missouri-fan-essentials.html">Missouri Tigers</a>
              <a class="dropdown-link" href="/posts/ole-miss-fan-essentials.html">Ole Miss Rebels</a>
              <a class="dropdown-link" href="/posts/south-carolina-fan-essentials.html">South Carolina</a>
              <a class="dropdown-link" href="/posts/tennessee-fan-essentials.html">Tennessee Volunteers</a>
              <a class="dropdown-link" href="/posts/texas-fan-essentials.html">Texas Longhorns</a>
              <a class="dropdown-link" href="/posts/texas-am-fan-essentials.html">Texas A&amp;M Aggies</a>
              <a class="dropdown-link" href="/posts/vanderbilt-fan-essentials.html">Vanderbilt Commodores</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Browse by Type -->
      <div class="nav-item has-dropdown">
        <button class="nav-link dropdown-trigger">By Type <span class="caret">▾</span></button>
        <div class="dropdown">
          <a class="dropdown-link" href="/gear.html?type=cooler">🧊 Coolers</a>
          <a class="dropdown-link" href="/gear.html?type=canopy">⛺ Canopies &amp; Shade</a>
          <a class="dropdown-link" href="/gear.html?type=chair">🪑 Chairs</a>
          <a class="dropdown-link" href="/gear.html?type=grill">🔥 Grills &amp; Cooking</a>
          <a class="dropdown-link" href="/gear.html?type=speaker">🔊 Speakers</a>
          <a class="dropdown-link" href="/gear.html?type=bag">👜 Stadium Bags</a>
          <a class="dropdown-link" href="/gear.html?type=apparel">👕 Fan Apparel</a>
          <a class="dropdown-link" href="/gear.html?type=other">⚡ Accessories</a>
        </div>
      </div>

      <!-- Browse by Season -->
      <div class="nav-item has-dropdown">
        <button class="nav-link dropdown-trigger">By Season <span class="caret">▾</span></button>
        <div class="dropdown">
          <a class="dropdown-link" href="/gear.html?season=summer">☀️ Summer Prep (May–July)</a>
          <a class="dropdown-link" href="/gear.html?season=early">🏈 Early Season (Sep–Oct)</a>
          <a class="dropdown-link" href="/gear.html?season=late">🍂 Late Season (Nov)</a>
          <a class="dropdown-link" href="/gear.html?season=bowl">🏆 Bowl Season</a>
        </div>
      </div>

      <!-- Tailgating / Game Day -->
      <a class="nav-link" href="/gear.html?cat=tailgating">Tailgating</a>
      <a class="nav-link" href="/gear.html?cat=gameday">Game Day</a>

      <a class="nav-link" href="/about.html">About</a>
    </nav>
  </div>
</header>`;

  /* ── Inject nav ── */
  function injectNav() {
    const existing = document.querySelector('header');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    bindNav();
  }

  /* ── Dropdown + mobile menu logic ── */
  function bindNav() {
    const triggers = document.querySelectorAll('.dropdown-trigger');
    triggers.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const item = this.closest('.nav-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
    });

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const siteNav = document.querySelector('.site-nav');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        const open = siteNav.classList.toggle('mobile-open');
        this.setAttribute('aria-expanded', open);
      });
    }
  }

  /* ── Gear Page Filtering ── */
  function initGearFilters() {
    if (!document.querySelector('.gear-filter-bar')) return;

    const params = new URLSearchParams(window.location.search);
    const filterBtns = document.querySelectorAll('[data-filter]');
    const products = document.querySelectorAll('.gear-card');

    // Apply URL param on load
    if (params.get('type'))   setFilter('type', params.get('type'), filterBtns);
    if (params.get('season')) setFilter('season', params.get('season'), filterBtns);
    if (params.get('cat'))    setFilter('cat', params.get('cat'), filterBtns);

    applyFilters(filterBtns, products);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const group = this.dataset.filterGroup;
        // Toggle off if already active
        if (this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          document.querySelectorAll(`[data-filter-group="${group}"]`).forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        }
        applyFilters(filterBtns, products);
        updateSectionHeaders(products);
      });
    });

    updateSectionHeaders(products);
  }

  function setFilter(group, value, btns) {
    btns.forEach(btn => {
      if (btn.dataset.filterGroup === group && btn.dataset.filter === value) {
        btn.classList.add('active');
      }
    });
  }

  function applyFilters(btns, products) {
    const active = {};
    btns.forEach(btn => {
      if (btn.classList.contains('active')) {
        active[btn.dataset.filterGroup] = btn.dataset.filter;
      }
    });

    products.forEach(card => {
      let show = true;
      if (active.type   && !card.dataset.type.split(',').includes(active.type))     show = false;
      if (active.season && !card.dataset.season.split(',').includes(active.season)) show = false;
      if (active.cat    && !card.dataset.cat.split(',').includes(active.cat))       show = false;
      if (active.school && !card.dataset.school.split(',').includes(active.school)) show = false;
      card.style.display = show ? '' : 'none';
    });

    // Show/hide empty section messages
    document.querySelectorAll('.gear-section').forEach(section => {
      const visible = section.querySelectorAll('.gear-card:not([style*="none"])').length;
      const empty = section.querySelector('.no-results');
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
    });
  }

  function updateSectionHeaders(products) {
    document.querySelectorAll('.gear-section').forEach(section => {
      const cards = section.querySelectorAll('.gear-card');
      const visible = [...cards].filter(c => c.style.display !== 'none').length;
      section.style.display = visible === 0 ? 'none' : '';
    });
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectNav();
    initGearFilters();
  });
})();
