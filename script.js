// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Hero terminal: typed scan output, matching the dashboard's own
// risk rules (FTP high, SSH medium, HTTPS low).
const termBody = document.getElementById('term-body');

const lines = [
  { text: '$ python scanner.py --target localhost', pause: 400 },
  { text: '', pause: 150 },
  { text: 'Scanning localhost...', pause: 500 },
  { text: '', pause: 200 },
  { text: 'PORT   SERVICE   RISK', pause: 150 },
  { html: '21     ftp       <span class="risk-high">HIGH</span>', pause: 150 },
  { html: '22     ssh       <span class="risk-medium">MEDIUM</span>', pause: 150 },
  { html: '443    https     <span class="risk-low">LOW</span>', pause: 150 },
  { text: '', pause: 300 },
  { text: '3 ports scanned. Results saved to scan_history.json', pause: 0 },
];

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function renderStatic() {
  termBody.innerHTML = lines
    .map((l) => l.html !== undefined ? l.html : l.text)
    .join('\n');
}

function typeLine(lineIndex, charIndex, cb) {
  const line = lines[lineIndex];
  const full = line.html !== undefined ? line.html : line.text;

  // For html lines, type the plain text version, then swap in the
  // colored span once the line is complete (keeps typing simple).
  const plain = line.html !== undefined
    ? full.replace(/<[^>]+>/g, '')
    : full;

  if (charIndex <= plain.length) {
    const current = document.getElementById('term-current');
    current.textContent = plain.slice(0, charIndex);
    setTimeout(() => typeLine(lineIndex, charIndex + 1, cb), 14);
  } else {
    if (line.html !== undefined) {
      const current = document.getElementById('term-current');
      current.outerHTML = `<span id="term-current">${line.html}</span>`;
    }
    setTimeout(cb, line.pause);
  }
}

function typeAll(lineIndex) {
  if (lineIndex >= lines.length) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    termBody.appendChild(cursor);
    return;
  }

  const lineEl = document.createElement('div');
  lineEl.innerHTML = '<span id="term-current"></span>';
  termBody.appendChild(lineEl);

  typeLine(lineIndex, 0, () => typeAll(lineIndex + 1));
}

if (prefersReducedMotion) {
  renderStatic();
} else {
  typeAll(0);
}
