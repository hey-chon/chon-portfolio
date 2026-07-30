(function() {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  if (reducedMotion) document.documentElement.classList.add('motion-reduced');

  // typewriter thing
  const taglines = ['Student Web Developer', 'Front-End Dev', 'Creative Coder', 'ICT Student', 'Consistent With Honors', 'Willing to Adapt & Learn'];
  let taglineIndex = 0;
  let displayed = '';
  let isDeleting = false;
  const typewriterEl = document.getElementById('typewriter');

  function typeWriter() {
    const current = taglines[taglineIndex];
    if (!isDeleting && displayed === current) {
      setTimeout(() => { isDeleting = true; typeWriter(); }, 1600);
      return;
    }
    if (isDeleting && displayed === '') {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typeWriter();
      return;
    }
    const speed = isDeleting ? 60 : 100;
    displayed = isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1);
    if (typewriterEl) typewriterEl.textContent = displayed;
    setTimeout(typeWriter, speed);
  }

  // nav stuff
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['about', 'skills', 'projects', 'experience', 'certificates', 'contact'];

  function handleNavScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (scrollProgress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }
    // Active section
    let current = '';
    for (const id of [...sections].reverse()) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) {
        current = id;
        break;
      }
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // mobile menu
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }

  if (navToggle && mobileMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      const icon = navToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const target = href === '#' ? document.getElementById('hero') : document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      closeMobileMenu();
      const offset = (navbar ? navbar.getBoundingClientRect().height : 0) + 12;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: 'smooth' });
      if (href !== '#') window.history.replaceState(null, '', href);
    });
  });

  // little rev
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observeRevealElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      if (!el.classList.contains('visible')) revealObserver.observe(el);
    });
  }

  observeRevealElements();

  // skills
  const skillsData = [
    { name: 'HTML', icon: 'fa-brands fa-html5', color: '#f97316' },
    { name: 'CSS', icon: 'fa-brands fa-css3-alt', color: '#60a5fa' },
    { name: 'JavaScript', icon: 'fa-brands fa-js', color: '#facc15' },
    { name: 'Front-End Development', icon: 'fa-brands fa-react', color: '#22d3ee' },
    { name: 'Responsive Web Design', icon: 'fa-solid fa-wind', color: '#2dd4bf' },
    { name: 'Basic Back-End', icon: 'fa-brands fa-node', color: '#4ade80' },
    { name: 'Microsoft Word', icon: 'fa-solid fa-file-word', color: '#3b82f6' },
    { name: 'Microsoft PowerPoint', icon: 'fa-solid fa-file-powerpoint', color: '#ea580c' },
  ];

  const skillList = document.getElementById('skillList');
  if (skillList) {
    skillList.innerHTML = skillsData.map(s => `
      <div class="skill-logo-card" title="${s.name}" aria-label="${s.name}">
        <i class="${s.icon}" style="color:${s.color}" aria-hidden="true"></i>
        <span>${s.name}</span>
      </div>
    `).join('');
  }

  // strengths
  const strengthsData = [
    'Fast Learner', 'Student Developer', 'Responsible & Reliable',
    'Uses Helpful Tools', 'Adaptable & Motivated', 'Willing to Learn'
  ];
  const strengthsGrid = document.getElementById('strengthsGrid');
  if (strengthsGrid) {
    strengthsGrid.innerHTML = strengthsData.map(s =>
      `<div class="strength-card reveal">${s}</div>`
    ).join('');
  }

  // projects
  const projectsData = [
    {
      title: 'Personal Web Portfolio',
      desc: 'This is my own portfolio site for showing my skills, projects and etc. feel free to explore this portfolio.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      icons: ['fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js'],
      iconColors: ['#f97316', '#60a5fa', '#facc15'],
      url: 'https://chon-dev-portfolio.netlify.app/',
      meta: 'Personal project',
      featured: true,
    },
    {
      title: 'Hapib Surprise Web',
      desc: 'A private surprise website made for a client as paid work. It has a date entry, voice message player, three songs with personal notes, flip-style memory cards, photo memories, and a closing love letter.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Audio'],
      icons: ['fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js'],
      iconColors: ['#f97316', '#60a5fa', '#facc15', '#c084fc'],
      url: 'https://hapib-surprise-web.netlify.app/',
      meta: 'Paid client project',
      featured: false,
    },
    {
      title: 'Jera & Jimson Anniversary',
      desc: 'A private anniversary website for me and my girlfriend 2 years anniversary with profile cards, three playable songs, memory cards, a love letter, relationship timeline, live time-together counter, verse cards, a kiss canvas, credits, and a closing message.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
      icons: ['fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js'],
      iconColors: ['#f97316', '#60a5fa', '#facc15', '#f472b6'],
      url: 'https://jera-jimson-anniv.netlify.app/',
      meta: 'Personal project',
      featured: false,
    },
    {
      title: 'WB.prjc',
      desc: 'A simple training-ground website built to practice layout and navigation. It includes Home, About, Author, and Social sections, a mobile menu, smooth scrolling, and made with spck editor only.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      icons: ['fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js'],
      iconColors: ['#f97316', '#60a5fa', '#facc15'],
      url: 'https://wb-prjc.vercel.app/',
      meta: 'Training showcase',
      featured: false,
    },
  ];

  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid) {
    projectsGrid.innerHTML = projectsData.map((p, i) => `
      <div class="project-card reveal">
        ${p.featured ? '<div class="project-featured">Featured</div>' : ''}
        <div class="project-header">
          <div class="project-icon"><i class="fa-solid fa-code"></i></div>
          <div class="project-tech-icons">
            ${p.icons.map((icon, j) => `<i class="${icon}" style="color:${p.iconColors[j]}"></i>`).join('')}
          </div>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-footer">
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-links">
            <span class="project-meta">${p.meta}</span>
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${p.title}">
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // numbers
  const statsData = [
    { icon: 'fa-solid fa-trophy', value: '4', label: 'Years with Honors', sub: 'Grade 7 to Grade 10', color: 'yellow', iconColor: '#facc15' },
    { icon: 'fa-solid fa-star', value: '94.30', label: 'Top Average', sub: 'Highest general average', color: 'red', iconColor: '#dc2626' },
    { icon: 'fa-solid fa-code', value: '13+', label: 'Projects Built', sub: 'Showcase and client work', color: 'blue', iconColor: '#60a5fa' },
    { icon: 'fa-solid fa-graduation-cap', value: 'SHS', label: 'Tech-Pro CSSNCII', sub: 'Cavite Community Academy', color: 'green', iconColor: '#4ade80' },
  ];

  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) {
    statsGrid.innerHTML = statsData.map(s => `
      <div class="stat-card ${s.color} reveal">
        <div class="stat-icon" style="color:${s.iconColor}">
          <i class="${s.icon}"></i>
        </div>
        <div class="stat-value" style="color:${s.iconColor}">${s.value}</div>
        <div class="stat-label">${s.label}</div>
        <div class="stat-sub">${s.sub}</div>
      </div>
    `).join('');
  }

  // certificates
  const certificatesData = [
    {
      image: 'images/cert1.jpg',
      issuer: 'Cisco & DICT MIMAROPA',
      issuerClass: 'cisco',
      issuerIcon: 'fa-solid fa-network-wired',
      title: 'HTML Essentials with Cisco Skills for All Platform',
      date: 'May 2026',
      badge: 'Cisco',
    },
    {
      image: 'images/cert2.png',
      issuer: 'Springer Capital',
      issuerClass: 'springer',
      issuerIcon: 'fa-solid fa-building',
      title: 'Web Development Internship Program',
      date: 'May 2026',
      badge: 'Internship',
    },
    {
      image: 'images/cert3.png',
      issuer: 'CodeSignal',
      issuerClass: 'codesignal',
      issuerIcon: 'fa-solid fa-signal',
      title: 'Introduction to HTML',
      date: 'May 26, 2026',
      badge: 'Course',
    },
    {
      image: 'images/cert4.jpeg',
      issuer: 'Alison',
      issuerClass: 'springer',
      issuerIcon: 'fa-solid fa-laptop-code',
      title: 'Web Page Design Using HTML5 and CSS3',
      date: 'July 5, 2026',
      badge: 'Course',
    },
  ];

  const certificatesGrid = document.getElementById('certificatesGrid');
  if (certificatesGrid) {
    certificatesGrid.innerHTML = certificatesData.map((c, i) => `
      <div class="cert-card reveal" data-cert="${i}">
        <div class="cert-image-wrapper">
          <img src="${c.image}" alt="${c.title}" loading="lazy" />
          <div class="cert-image-overlay">
            <span class="cert-view-btn"><i class="fa-solid fa-expand"></i> Click to View</span>
          </div>
        </div>
        <div class="cert-content">
          <div class="cert-issuer">
            <div class="cert-issuer-icon ${c.issuerClass}">
              <i class="${c.issuerIcon}"></i>
            </div>
            <span class="cert-issuer-name">${c.issuer}</span>
          </div>
          <h3 class="cert-title">${c.title}</h3>
          <span class="cert-date"><i class="fa-regular fa-calendar"></i> ${c.date}</span>
        </div>
        <div class="cert-badge">${c.badge}</div>
      </div>
    `).join('');
  }

  // cert popup
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close"><i class="fa-solid fa-xmark"></i></button>
    <img class="lightbox-img" src="" alt="Certificate" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.dataset.cert;
      lightboxImg.src = certificatesData[idx].image;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // credits
  const creditsData = [
    { image: 'images/replit.svg', name: 'Replit', desc: 'Online IDE & deployment', url: 'https://replit.com/' },
    { image: 'images/vscode.svg', name: 'VS Code', desc: 'Code editor by Microsoft', url: 'https://code.visualstudio.com/' },
    { image: 'images/openai.svg', imageClass: 'logo-invert', name: 'OpenAI', desc: 'Helpful AI tools', url: 'https://openai.com/' },
    { image: 'images/grok.svg', imageClass: 'logo-invert', name: 'Grok', desc: 'AI assistant', url: 'https://grok.com/' },
    { image: 'images/claude.svg', name: 'Claude', desc: 'AI assistant by Anthropic', url: 'https://claude.ai/' },
    { image: 'images/gemini.svg', name: 'Gemini', desc: 'AI assistant by Google', url: 'https://gemini.google.com/' },
    { image: 'images/openai.svg', imageClass: 'logo-invert', name: 'Codex', desc: 'OpenAI coding agent', url: 'https://openai.com/codex/' },
    { image: 'images/youtube.svg', name: 'Bro Code', desc: 'Programming tutorials', url: 'https://www.youtube.com/@BroCodez' },
    { image: 'images/github-mark.png', imageClass: 'logo-invert', name: 'GitHub', desc: 'Version control & open source', url: 'https://github.com/' },
    { image: 'images/mdn.svg', imageClass: 'logo-invert', name: 'MDN Web Docs', desc: 'Web documentation', url: 'https://developer.mozilla.org/' },
    { image: 'images/freecodecamp.svg', imageClass: 'logo-invert', name: 'freeCodeCamp', desc: 'Free coding courses', url: 'https://www.freecodecamp.org/' },
    { image: 'images/udemy.svg', name: 'Udemy', desc: 'Online learning platform', url: 'https://www.udemy.com/' },
  ];

  const creditsGrid = document.getElementById('creditsGrid');
  if (creditsGrid) {
    creditsGrid.innerHTML = creditsData.map(c => `
      <a href="${c.url}" class="credit-card reveal" target="_blank" rel="noopener noreferrer" aria-label="Open ${c.name} in a new tab">
        <div class="credit-icon">
          <img class="${c.imageClass || ''}" src="${c.image}" alt="" loading="lazy" />
        </div>
        <p class="credit-name">${c.name}</p>
        <p class="credit-desc">${c.desc}</p>  
      </a>
    `).join('');
  }

  // contact form
  const contactForm = document.getElementById('contactForm');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const formToast = document.getElementById('formToast');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = contactForm.elements.namedItem('name');
      const email = contactForm.elements.namedItem('email');
      const message = contactForm.elements.namedItem('message');

      [name, email, message].forEach(field => field.setCustomValidity(''));
      if (!name.value.trim()) name.setCustomValidity('Please enter your name.');
      if (!email.value.trim()) email.setCustomValidity('Please enter your email.');
      if (!message.value.trim()) message.setCustomValidity('Please enter a message.');
      if (!contactForm.reportValidity()) return;
      if (contactForm.elements.namedItem('_gotcha').value) return;

      btnSubmit.disabled = true;
      btnText.textContent = 'Sending...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Formspree request failed');
        btnSubmit.disabled = false;
        btnText.textContent = 'Send Message';
        contactForm.reset();
        formToast.classList.remove('error');
        formToast.classList.add('success');
        formToast.querySelector('i').className = 'fas fa-check-circle';
        formToast.querySelector('span').textContent = 'Message sent! Wait for Jimson\'s response.';
        formToast.classList.add('show');
        setTimeout(() => formToast.classList.remove('show'), 3000);
      } catch {
        btnSubmit.disabled = false;
        btnText.textContent = 'Send Message';
        formToast.classList.remove('success');
        formToast.classList.add('error');
        formToast.querySelector('i').className = 'fas fa-circle-exclamation';
        formToast.classList.add('show');
        formToast.querySelector('span').textContent = 'Something went wrong. Please try again.';
        setTimeout(() => formToast.classList.remove('show'), 4000);
      }
    });
  }

  observeRevealElements();

  // start
  document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    handleNavScroll();
    window.addEventListener('scroll', handleNavScroll);
  });

})();

