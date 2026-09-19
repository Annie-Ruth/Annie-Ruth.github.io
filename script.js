// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- LinkedIn placeholder ----------
// Replace the href below with your actual LinkedIn profile URL.
document.getElementById('linkedinLink').setAttribute('href', 'https://www.linkedin.com/');

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll spy ----------
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('[data-nav]');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => spyObserver.observe(section));

// ---------- Typed role rotator ----------
const roles = ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'CI/CD', 'Docker'];
const typedEl = document.getElementById('typed');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

// ---------- Job details expand/collapse ----------
document.querySelectorAll('.job').forEach((job, i) => {
  const list = job.querySelector('.job-list');
  const btn = document.createElement('button');
  btn.className = 'job-toggle';
  btn.innerHTML = `<span class="label">Show details</span><span class="chev">▾</span>`;
  job.appendChild(btn);
  job.insertBefore(list, btn);

  // First job open by default
  if (i === 0) {
    list.classList.add('open');
    btn.classList.add('open');
    btn.querySelector('.label').textContent = 'Hide details';
  }

  btn.addEventListener('click', () => {
    const isOpen = list.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.querySelector('.label').textContent = isOpen ? 'Hide details' : 'Show details';
  });
});

// ---------- Back to top ----------
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
