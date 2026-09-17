// Sam White — Portfolio
// Small hand-rolled SPA: one state object, one render() that rebuilds #app.

const STUDIES = [
  {
    slug: 'cascade', title: 'Cascade Equinox', cat: 'Brand strategy', year: '2025',
    summary: 'A high-altitude apparel label needed an identity that could live on a trail marker and a flagship window alike. We set the strategy, built the name architecture, and shipped a flexible wordmark system the in-house team could run with.',
    role: ['Brand strategy', 'Naming', 'Identity'],
    blocks: [
      { label: 'Wordmark & trail-marker logo', tone: 'dark', ratio: '16 / 9' },
      { label: 'Seasonal packaging system', tone: 'light', ratio: '4 / 3' },
      { label: 'Flagship window, Portland', tone: 'mid', ratio: '16 / 9' },
    ],
    metrics: [
      { value: '+38%', label: 'DTC revenue, first season' },
      { value: '3', label: 'national retail partners' },
      { value: '12wk', label: 'strategy to launch' },
    ],
  },
  {
    slug: 'dogwood', title: 'Dogwood', cat: 'Experience design', year: '2024',
    summary: 'Dogwood is a slow-living companion app. We reframed the whole product around a single daily ritual — collapsing fourteen screens into four and making the first run feel like a deep breath.',
    role: ['Experience design', 'Prototyping', 'Design systems'],
    blocks: [
      { label: 'Daily ritual home screen', tone: 'light', ratio: '16 / 9' },
      { label: 'Onboarding, four screens', tone: 'mid', ratio: '4 / 3' },
      { label: 'Design-system tokens', tone: 'dark', ratio: '16 / 9' },
    ],
    metrics: [
      { value: '4.8', label: 'App Store rating' },
      { value: '−64%', label: 'onboarding drop-off' },
      { value: '2×', label: 'daily return rate' },
    ],
  },
  {
    slug: 'myco', title: 'Myco Mylk', cat: 'Product development', year: '2024',
    summary: 'A mushroom-based mylk startup going from test kitchen to shelf. We shaped the product line, the carton system, and the shelf story that earned it a national grocery slot.',
    role: ['Product development', 'Packaging', 'Brand'],
    blocks: [
      { label: 'Carton system, five SKUs', tone: 'accent', ratio: '16 / 9' },
      { label: 'Shelf story & point-of-sale', tone: 'light', ratio: '4 / 3' },
      { label: 'Launch campaign', tone: 'dark', ratio: '16 / 9' },
    ],
    metrics: [
      { value: '5', label: 'SKUs launched' },
      { value: '400', label: 'stores at launch' },
      { value: 'Series A', label: 'closed post-launch' },
    ],
  },
  {
    slug: 'nike', title: 'Nike Inc', cat: 'Creative direction', year: '2023',
    summary: 'A focused creative-direction engagement on a seasonal running campaign — concept, art direction, and a toolkit precise enough for a global team to extend without us in the room.',
    role: ['Creative direction', 'Art direction'],
    blocks: [
      { label: 'Seasonal running concept', tone: 'dark', ratio: '16 / 9' },
      { label: 'Art-direction toolkit', tone: 'mid', ratio: '4 / 3' },
      { label: 'Global market extensions', tone: 'light', ratio: '16 / 9' },
    ],
    metrics: [
      { value: '11', label: 'markets activated' },
      { value: '60+', label: 'campaign assets' },
      { value: '1', label: 'self-serve toolkit' },
    ],
  },
];

const SERVICES = ['Brand Strategy', 'Experience Design', 'Product Development', 'Creative Direction', 'Design Systems'];
const CLIENTS = ['Cascade', 'Dogwood', 'Myco Mylk', 'Nike', 'Harbor', 'North Loop'];
const FAQS = [
  { q: 'What is your creative process like?', a: 'It starts with listening. I spend the first stretch of any engagement understanding the business, the people, and the constraints — then I sketch, fast and loosely, until the obvious answer shows up.' },
  { q: 'What is a typical project timeline?', a: 'Brand strategy runs 4–8 weeks; a full experience or product engagement, 8–16. I scope tightly up front so there are no surprises.' },
  { q: 'How do I get started on a project with you?', a: 'Send a note through the contact page with a sentence or two about what you are building. I will reply within a couple of days to set up a call.' },
  { q: 'Do you work with teams in-house?', a: 'Often. I embed with product and brand teams as a fractional creative director, or run focused workshops to get everyone aligned.' },
];

const WORK_LAYOUT = 'uniform'; // 'editorial' | 'uniform'
const CASE_HERO = 'centered'; // 'block' | 'split' | 'centered'

function pal(slug) {
  return {
    cascade: { bg: 'var(--ink-900)', fg: 'var(--white)' },
    dogwood: { bg: 'var(--ink-50)', fg: 'var(--ink-900)', border: '1px solid var(--border-subtle)' },
    myco:    { bg: 'var(--blue-500)', fg: 'var(--white)' },
    nike:    { bg: 'var(--ink-800)', fg: 'var(--white)' },
  }[slug];
}

function tone(t) {
  if (t === 'dark') return { bg: 'var(--ink-900)', fg: 'rgba(255,255,255,0.78)' };
  if (t === 'mid') return { bg: 'var(--ink-100)', fg: 'var(--text-tertiary)' };
  if (t === 'accent') return { bg: 'var(--blue-500)', fg: 'rgba(255,255,255,0.9)' };
  return { bg: 'var(--ink-50)', fg: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' };
}

const state = { page: 'work', cs: 0, sent: false, copied: false, openFaq: 0 };

function setState(patch) {
  Object.assign(state, patch);
  render();
  if (patch.page !== undefined || patch.cs !== undefined) {
    window.scrollTo(0, 0);
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function btn({ label, variant = 'primary', size = 'md', action, extraClass = '', type = 'button' }) {
  const actionAttr = action ? ` data-action="${action}"` : '';
  return `<button type="${type}" class="btn btn-${variant} btn-${size} ${extraClass}"${actionAttr}>${label}</button>`;
}

function renderNav() {
  const link = (id, label) => `<span class="nav-link ${state.page === id ? 'active' : ''}" data-action="nav:${id}">${label}</span>`;
  return `
    <nav class="site-nav">
      <span class="nav-logo" data-action="nav:work">Sam White</span>
      <div class="nav-links">
        ${link('work', 'Work')}
        ${link('about', 'About')}
        ${link('contact', 'Contact')}
      </div>
    </nav>`;
}

function renderFooter() {
  if (state.page === 'contact') return '';
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-social">
          <span>Instagram</span><span>LinkedIn</span><span>Behance</span>
        </div>
        <h2 class="footer-heading">Curious what we could make together?<br><span class="dim">Let's build something worth keeping.</span></h2>
        <div class="footer-cta-row">
          ${btn({ label: 'Get in touch', variant: 'on-dark', action: 'nav:contact' })}
          <span class="footer-avail"><span class="status-dot"></span>Available for work</span>
        </div>
        <div class="footer-columns">
          <div>+1 503 555 0148<br>hello@samwhite.co</div>
          <div>Creative Director<br>Portland, OR</div>
          <div class="align-right">All rights reserved,<br>Sam White &copy;2026</div>
        </div>
      </div>
    </footer>`;
}

function renderWork() {
  const tiles = STUDIES.map((s, i) => {
    const c = pal(s.slug);
    const wide = WORK_LAYOUT === 'editorial' && (i === 0 || i === 3);
    return `
      <div class="work-tile-wrap ${wide ? 'wide' : ''}" data-action="case:${i}">
        <div class="work-tile" style="background:${c.bg};${c.border ? 'border:' + c.border + ';' : ''}">
          <span class="work-tile-title" style="color:${c.fg}">${esc(s.title)}</span>
          <span class="work-tile-view" style="color:${c.fg}">View case study &rarr;</span>
        </div>
        <div class="work-tile-meta">
          <span class="work-tile-cat">${esc(s.cat)}</span>
          <span class="work-tile-year">${esc(s.year)}</span>
        </div>
      </div>`;
  }).join('');

  return `
    <section class="container work-page">
      <h1 class="work-title">Work</h1>
      <div class="work-sub-row">
        <p class="work-sub-lede">Selected brand, experience, and product work — Portland and beyond.</p>
        <span class="work-sub-range">work 2023 — 2026</span>
      </div>
      <div class="work-grid">${tiles}</div>
    </section>`;
}

function renderCase() {
  const cur0 = STUDIES[state.cs];
  const cp = pal(cur0.slug);
  const nextIdx = (state.cs + 1) % STUDIES.length;

  let hero = '';
  if (CASE_HERO === 'block') {
    hero = `
      <header class="case-hero-band" style="background:${cp.bg};color:${cp.fg}">
        <div class="container">
          <span class="case-hero-eyebrow">${esc(cur0.cat)} &middot; ${esc(cur0.year)}</span>
          <h1 class="case-hero-title-band">${esc(cur0.title)}</h1>
        </div>
      </header>`;
  } else if (CASE_HERO === 'split') {
    hero = `
      <header class="container case-hero-split">
        <div class="case-hero-split-grid">
          <div class="case-hero-split-copy">
            <span class="case-hero-split-eyebrow">${esc(cur0.cat)} &middot; ${esc(cur0.year)}</span>
            <h1 class="case-hero-split-title">${esc(cur0.title)}</h1>
          </div>
          <div class="case-hero-square" style="background:${cp.bg};${cp.border ? 'border:' + cp.border + ';' : ''}"></div>
        </div>
      </header>`;
  } else {
    hero = `
      <header class="container case-hero-centered">
        <span class="case-hero-centered-eyebrow">${esc(cur0.cat)} &middot; ${esc(cur0.year)}</span>
        <h1 class="case-hero-centered-title">${esc(cur0.title)}</h1>
        <div class="case-hero-banner" style="background:${cp.bg};${cp.border ? 'border:' + cp.border + ';' : ''}"></div>
      </header>`;
  }

  const blocks = cur0.blocks.map((b) => {
    const t = tone(b.tone);
    return `
      <div class="case-block" style="aspect-ratio:${b.ratio};background:${t.bg};${t.border ? 'border:' + t.border + ';' : ''}">
        <span class="case-block-label" style="color:${t.fg}">${esc(b.label)}</span>
      </div>`;
  }).join('');

  const metrics = cur0.metrics.map((m) => `
    <div>
      <div class="case-metric-value">${esc(m.value)}</div>
      <div class="case-metric-label">${esc(m.label)}</div>
    </div>`).join('');

  return `
    <article>
      <div class="container case-back-row">
        <span class="case-back" data-action="nav:work">&larr; All work</span>
      </div>
      ${hero}
      <div class="container case-body">
        <div class="case-intro">
          <p class="case-summary">${esc(cur0.summary)}</p>
          <div class="case-meta">
            <div>
              <div class="case-meta-label">Role</div>
              <div class="case-meta-value">${esc(cur0.role.join(' · '))}</div>
            </div>
            <div>
              <div class="case-meta-label">Year</div>
              <div class="case-meta-value">${esc(cur0.year)}</div>
            </div>
          </div>
        </div>

        <div class="case-blocks">${blocks}</div>

        <div class="case-results">
          <span class="case-results-label">results.</span>
          <div class="case-metrics">${metrics}</div>
        </div>

        <div class="case-next" data-action="case:${nextIdx}">
          <div>
            <div class="case-next-label">Next project</div>
            <div class="case-next-title">${esc(STUDIES[nextIdx].title)}</div>
          </div>
          <span class="case-next-arrow">&rarr;</span>
        </div>
      </div>
    </article>`;
}

function renderAbout() {
  const services = SERVICES.map((s) => `<span class="about-service">${esc(s)}</span>`).join('');
  const clients = CLIENTS.map((c) => `<span class="about-client">${esc(c)}</span>`).join('');
  const faqs = FAQS.map((f, i) => {
    const open = state.openFaq === i;
    return `
      <div class="faq-row">
        <button class="faq-question" data-action="faq:${i}">
          ${esc(f.q)}
          <span class="faq-plus ${open ? 'open' : ''}">+</span>
        </button>
        <div class="faq-body-wrap ${open ? 'open' : ''}">
          <p class="faq-answer">${esc(f.a)}</p>
        </div>
      </div>`;
  }).join('');

  return `
    <section class="container about-page about-bottom-space">
      <h1 class="about-title">Sam White</h1>

      <div class="about-row">
        <span class="about-row-label">about.</span>
        ${btn({ label: 'Resume', variant: 'secondary', size: 'sm' })}
      </div>
      <p class="about-lede">I collaborate with teams of every size, helping them find the simplest true version of what they are building — and then making it feel inevitable.</p>

      <div class="about-media">
        <img src="../shared/assets/sam-portrait-square.png" alt="Sam White at work">
        <p class="about-media-copy">I'm dedicated to crafting work that is both beautiful and genuinely useful — design that aligns with a client's real needs and holds up over the long term.</p>
      </div>

      <div class="about-section">
        <span class="about-row-label">services.</span>
        <div class="about-services">${services}</div>
      </div>

      <div class="about-clients">${clients}</div>

      <div class="about-section">
        <span class="about-row-label">FAQs.</span>
        <div class="faq-list">${faqs}</div>
      </div>
    </section>`;
}

function renderContact() {
  const body = state.sent
    ? `
      <div>
        <div class="contact-sent-title">Thanks — message sent.</div>
        <p class="contact-sent-note">I read everything that lands here and reply within a couple of days.</p>
        <button class="contact-sent-again" data-action="contact:reset">Send another &rarr;</button>
      </div>`
    : `
      <form class="contact-form" data-action="contact:submit">
        <input class="input input--filled" placeholder="Your name" aria-label="Your name" required>
        <input class="input input--filled" type="email" placeholder="Your email" aria-label="Your email" required>
        <textarea class="textarea textarea--filled" rows="5" placeholder="Your masterpiece starts here" aria-label="Message"></textarea>
        ${btn({ label: 'Send it!', variant: 'primary', size: 'lg', extraClass: 'btn-full btn-square', type: 'submit' })}
      </form>`;

  return `
    <section class="container contact-page">
      <h1 class="contact-title">Start a<br>project</h1>
      <div class="contact-grid">
        <div>
          <button class="contact-email-row" data-action="contact:copy">
            <span class="contact-email-label">${state.copied ? 'Copied!' : 'hello@samwhite.co'}</span>
            <span class="contact-email-icon">&#10697;</span>
          </button>
          <p class="contact-note">Tell me a sentence or two about what you're building. I read everything that lands here and reply within a couple of days.</p>
          <div class="contact-avail"><span class="status-dot"></span>Available for work</div>
        </div>
        ${body}
      </div>
    </section>`;
}

function render() {
  const app = document.getElementById('app');
  let page = '';
  if (state.page === 'work') page = renderWork();
  else if (state.page === 'case') page = renderCase();
  else if (state.page === 'about') page = renderAbout();
  else if (state.page === 'contact') page = renderContact();

  app.innerHTML = `
    ${renderNav()}
    <main>${page}</main>
    ${renderFooter()}
  `;
}

function handleAction(action, event) {
  const [kind, arg] = action.split(':');
  if (kind === 'nav') setState({ page: arg });
  else if (kind === 'case') setState({ page: 'case', cs: Number(arg) });
  else if (kind === 'faq') setState({ openFaq: state.openFaq === Number(arg) ? -1 : Number(arg) });
  else if (kind === 'contact' && arg === 'copy') {
    try { navigator.clipboard.writeText('hello@samwhite.co'); } catch (e) {}
    setState({ copied: true });
    setTimeout(() => setState({ copied: false }), 1600);
  } else if (kind === 'contact' && arg === 'reset') {
    setState({ sent: false });
  } else if (kind === 'contact' && arg === 'submit') {
    if (event) event.preventDefault();
    setState({ sent: true });
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'FORM') return;
  handleAction(el.getAttribute('data-action'), e);
});

document.addEventListener('submit', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  handleAction(el.getAttribute('data-action'), e);
});

render();
