/**
 * ==========================================================================
 * THANUSHREE H U — PROFESSIONAL PORTFOLIO SCRIPT
 * Features:
 *  1. Interactive AI Recipe Generator Engine with fuzzy token matching
 *  2. Hero Tech Canvas (Interactive Neural Mesh / Constellation)
 *  3. Sticky Navbar & Scrollspy
 *  4. Mobile Responsive Hamburger Menu
 *  5. Skills Category Filtering
 *  6. Project Modals & Deep Dives
 *  7. Interactive Contact Form with Validation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initNavigation();
  initSkillsFilter();
  initProjectModals();
  initRecipeGenerator();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. HERO TECH CANVAS (Neural Particle Mesh)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('tech-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse pointer
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const alpha = 1 - dist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVIGATION, STICKY HEADER, SCROLLSPY & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active indicator
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll helper for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   3. SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab style
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   4. PROJECT MODALS & DEEP DIVES
   ========================================================================== */
const projectData = {
  solar: {
    title: 'AI Solar Panel Fault Detection',
    badge: 'AI & Computer Vision',
    summary: 'An AI-based computer vision system designed to classify solar panel anomalies in real time.',
    overview: 'This project addresses efficiency drop in photovoltaic installations caused by surface dust, bird-drop, micro-cracks, hotspots, physical fractures, and snow cover. Using convolutional neural networks (CNNs), the system analyzes thermal and high-resolution RGB imagery from drone inspections to identify faults automatically.',
    highlights: [
      'Multi-class anomaly classification across 6 standard diagnostic classes',
      'High accuracy (>94%) on test validation datasets',
      'Integration with OpenCV for edge extraction and contour segmentation',
      'Automated diagnostic alert report generation for site technicians'
    ],
    technologies: ['Python', 'Machine Learning', 'Computer Vision', 'OpenCV', 'TensorFlow / PyTorch', 'NumPy'],
    architecture: 'Input Image Stream -> Preprocessing (Bilateral Filter, Edge Detection) -> CNN Feature Extraction -> Softmax Multi-Class Classifier -> Telemetry Log & Alert Trigger'
  },
  robot: {
    title: 'Autonomous Robot with LiDAR & Camera',
    badge: 'Robotics & Embedded Systems',
    summary: 'A self-navigating autonomous mobile rover powered by Raspberry Pi and LiDAR sensor fusion.',
    overview: 'Engineered a compact autonomous rover that uses 360-degree LiDAR distance scanning, a forward-facing camera module, and DC motor drivers controlled via PWM signals. The robot creates a localized 2D occupancy grid map and executes dynamic obstacle avoidance routines using custom path planning algorithms.',
    highlights: [
      '360° LiDAR scanning at 5.5 Hz for real-time obstacle boundary detection',
      'SLAM (Simultaneous Localization and Mapping) concepts for path planning',
      'L298N Dual H-Bridge motor driver control through Raspberry Pi GPIOs',
      'Fail-safe collision avoidance with sub-100ms reaction latency'
    ],
    technologies: ['Raspberry Pi', 'LiDAR Sensor', 'Python', 'DC Motors / PWM', 'Linux / Raspbian', 'GPIO Control'],
    architecture: 'LiDAR + Camera -> Serial / GPIO Data Feed -> Python Navigation Node -> Obstacle Avoidance Decision Logic -> Motor Controller Signals'
  },
  scada: {
    title: 'SCADA Power System Model',
    badge: 'Power Systems & Simulation',
    summary: 'A comprehensive electrical grid simulation for monitoring generation, transmission, and load dispatch.',
    overview: 'Designed a MATLAB/Simulink power grid simulation demonstrating core Supervisory Control and Data Acquisition (SCADA) principles. The model incorporates generator buses, three-phase transmission lines, transformers, and dynamic industrial loads with automated fault detection and breaker trip logic.',
    highlights: [
      'Real-time simulation of voltage, frequency, active and reactive power flow',
      'Automatic fault isolation upon abnormal current and frequency excursions',
      'Interactive SCADA dashboard for remote breaker operation and load shedding',
      'Harmonic analysis and power factor correction modeling'
    ],
    technologies: ['MATLAB', 'Simulink', 'Simscape Electrical', 'SCADA Protocols', 'Power Systems Analysis'],
    architecture: 'Generator Dynamics -> 3-Phase Transmission Model -> SCADA Telemetry Sensors -> Control Terminal & Automated Protection Relays'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-project-body');
  const viewButtons = document.querySelectorAll('.view-project-btn');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="badge-featured">${data.badge}</span>
        <h2 id="modal-project-title" style="font-size: 1.8rem; font-weight: 800; margin: 0.6rem 0 0.8rem; color: #f8fafc;">
          ${data.title}
        </h2>
        <p style="color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${data.overview}
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1rem; color: #38bdf8; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 0.75rem;">
          Key Engineering Highlights
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
          ${data.highlights.map(h => `
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; color: #cbd5e1; font-size: 0.92rem;">
              <span style="color: #10b981; font-weight: bold;">✓</span>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 1.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem;">
        <h4 style="font-size: 0.85rem; color: #c084fc; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 0.4rem;">
          System Architecture Flow
        </h4>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: #94a3b8; line-height: 1.5;">
          ${data.architecture}
        </p>
      </div>

      <div>
        <h4 style="font-size: 0.85rem; color: #94a3b8; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 0.6rem;">
          Technologies Used
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.technologies.map(t => `
            <span style="font-family: var(--font-mono); font-size: 0.75rem; padding: 0.25rem 0.65rem; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 6px; color: #a5b4fc;">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  // Profile avatar interactive photo viewer modal
  const avatarContainer = document.getElementById('profile-avatar-container');
  if (avatarContainer) {
    avatarContainer.addEventListener('click', () => {
      modalBody.innerHTML = `
        <div class="modal-profile-wrapper">
          <img src="thanushree.jpg" alt="Thanushree H U" class="modal-profile-photo-lg" />
          <span class="badge-featured" style="margin-bottom: 0.6rem;">Engineering Profile</span>
          <h2 id="modal-project-title" style="font-size: 1.8rem; font-weight: 800; margin: 0 0 0.35rem; color: #f8fafc;">
            Thanushree H U
          </h2>
          <p style="color: #38bdf8; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.35rem;">
            B.E. in Computer Science &amp; Engineering
          </p>
          <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            <span>🏛️</span> Adichunchanagiri Institute of Technology (AIT)
          </p>
          <p style="color: #94a3b8; font-size: 0.92rem; line-height: 1.6; max-width: 480px; margin: 0 auto 1.4rem;">
            Passionate engineering student pursuing Computer Science &amp; Engineering. Building modern web platforms, computer vision applications, and intelligent robotics control systems.
          </p>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.4rem;">
            <span class="tech-tag">B.E. CSE</span>
            <span class="tech-tag">AIT Chikkamagaluru</span>
            <span class="tech-tag">Python &amp; ML</span>
            <span class="tech-tag">Full-Stack Web</span>
            <span class="tech-tag">Robotics</span>
          </div>
          <a href="#contact" class="btn btn-primary" id="modal-profile-contact-btn" style="margin-top: 0.2rem;">
            <span>Get In Touch</span>
          </a>
        </div>
      `;
      const contactBtn = modalBody.querySelector('#modal-profile-contact-btn');
      if (contactBtn) {
        contactBtn.addEventListener('click', () => {
          closeModal();
        });
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. AI RECIPE GENERATOR ENGINE (MAIN INTERACTIVE FEATURE)
   ========================================================================== */

/**
 * Local Recipe Database
 * Guaranteed to contain at least the 6 recipes specified in requirements:
 * 1. Chicken Fried Rice
 * 2. Tomato Rice
 * 3. Egg Fried Rice
 * 4. Paneer Masala
 * 5. Potato Fry
 * 6. Vegetable Rice
 * Plus supplementary recipes to ensure smooth matching for all variations!
 */
const recipeDatabase = [
  {
    id: 'chicken-fried-rice',
    name: 'Chicken Fried Rice',
    emoji: '🍗',
    ingredients: ['chicken', 'rice', 'onion', 'carrot', 'egg', 'soy sauce'],
    cookingTime: '25 minutes',
    difficulty: 'Medium',
    description: 'A classic wok-tossed fried rice loaded with savory tender chicken chunks, scrambled eggs, crisp carrots, and umami soy sauce.',
    steps: [
      'Dice the chicken breast into bite-sized pieces and season lightly with salt and pepper.',
      'Heat sesame oil in a wok or large pan over medium-high heat.',
      'Add chopped onions and diced carrots; sauté for 3 minutes until tender-crisp.',
      'Push vegetables to one side, pour beaten egg into the pan, and gently scramble.',
      'Add the cooked chicken and cold cooked rice, breaking up any clumps.',
      'Drizzle soy sauce over the rice and toss briskly on high heat for 3-4 minutes.',
      'Garnish with spring onions and serve immediately while hot.'
    ]
  },
  {
    id: 'tomato-rice',
    name: 'Tomato Rice',
    emoji: '🍅',
    ingredients: ['rice', 'tomato', 'onion', 'chili', 'spices'],
    cookingTime: '20 minutes',
    difficulty: 'Easy',
    description: 'A vibrant South-Asian spiced rice preparation infused with tangy ripe tomatoes, sautéed onions, fresh green chilies, and fragrant spices.',
    steps: [
      'Heat vegetable oil or ghee in a pan and temper with mustard seeds and curry leaves.',
      'Add thinly sliced onions and slit green chili; sauté until translucent and golden.',
      'Add finely chopped tomatoes along with turmeric powder, red chili powder, and garam masala.',
      'Cook on medium flame for 6-8 minutes until tomatoes become soft, pulpy, and oil starts separating.',
      'Gently fold in previously cooked rice, mixing thoroughly so every grain absorbs the tangy masala.',
      'Cover with a lid and let it steam on low heat for 2 minutes.',
      'Garnish with fresh cilantro leaves and serve with cooling raita or papad.'
    ]
  },
  {
    id: 'egg-fried-rice',
    name: 'Egg Fried Rice',
    emoji: '🍳',
    ingredients: ['rice', 'egg', 'onion', 'carrot', 'soy sauce'],
    cookingTime: '20 minutes',
    difficulty: 'Easy',
    description: 'A quick, wholesome staple featuring fluffy jasmine rice, golden scrambled eggs, finely diced carrots, and savory soy sauce.',
    steps: [
      'Heat oil in a pan over medium heat.',
      'Add chopped onion and diced carrot, then sauté until aromatic.',
      'Crack in eggs and scramble softly in the center of the pan.',
      'Add cooked rice (preferably day-old) and break up any large clusters.',
      'Add soy sauce and a pinch of salt and pepper for seasoning.',
      'Mix thoroughly on high flame for 3 minutes and serve piping hot.'
    ]
  },
  {
    id: 'paneer-masala',
    name: 'Paneer Masala',
    emoji: '🧀',
    ingredients: ['paneer', 'tomato', 'onion', 'spices', 'cream'],
    cookingTime: '25 minutes',
    difficulty: 'Medium',
    description: 'Rich and velvety cottage cheese cubes simmered in a luscious onion-tomato gravy with roasted spices and a touch of heavy cream.',
    steps: [
      'Cut fresh paneer into cubes and lightly sauté in butter until golden, then set aside in warm water.',
      'In the same skillet, sauté finely diced onions, ginger, and garlic paste until golden brown.',
      'Add fresh pureed tomatoes and blend in turmeric, Kashmiri red chili powder, coriander powder, and garam masala.',
      'Simmer the sauce for 8-10 minutes until the gravy thickens and oil glistens on the surface.',
      'Pour in heavy cooking cream and stir gently to create a velvety texture.',
      'Add the paneer cubes, gently simmer for 3 minutes, sprinkle kasuri methi, and serve hot.'
    ]
  },
  {
    id: 'potato-fry',
    name: 'Potato Fry',
    emoji: '🥔',
    ingredients: ['potato', 'onion', 'chili', 'spices', 'oil'],
    cookingTime: '15 minutes',
    difficulty: 'Easy',
    description: 'Crispy, spiced golden potato cubes shallow-fried with sliced onions, fresh green chili, and roasted cumin spices.',
    steps: [
      'Peel and dice potatoes into uniform small cubes for even cooking.',
      'Heat oil in a heavy-bottomed skillet and temper with cumin seeds.',
      'Add sliced onions and green chili; cook for 2 minutes until soft.',
      'Add the cubed potatoes, turmeric powder, red chili powder, and salt.',
      'Fry on medium heat uncovered, stirring every few minutes until the potatoes turn fork-tender and crispy at the edges.',
      'Turn heat to high for the final 2 minutes for extra crispness, then serve hot with rice or flatbread.'
    ]
  },
  {
    id: 'vegetable-rice',
    name: 'Vegetable Rice',
    emoji: '🥕',
    ingredients: ['rice', 'carrot', 'beans', 'peas', 'onion', 'spices'],
    cookingTime: '25 minutes',
    difficulty: 'Easy',
    description: 'A nutritious, aromatic one-pot meal bursting with crisp carrots, tender green beans, sweet peas, and whole tempered spices.',
    steps: [
      'Heat oil or ghee in a deep pot; add whole spices (bay leaf, cloves, cinnamon).',
      'Add sliced onions and sauté until lightly caramelized.',
      'Add chopped carrots, French beans, and green peas; sauté for 3 minutes.',
      'Add ground turmeric, coriander powder, garam masala, and salt.',
      'Add rinsed rice along with water (1:2 ratio); bring to a vigorous boil.',
      'Cover tightly with a lid, reduce heat to low, and cook for 15 minutes without opening.',
      'Fluff gently with a fork and serve hot with yogurt dip or curry.'
    ]
  },
  {
    id: 'paneer-fried-rice',
    name: 'Paneer Fried Rice',
    emoji: '🍚',
    ingredients: ['paneer', 'rice', 'onion', 'carrot', 'chili', 'soy sauce'],
    cookingTime: '20 minutes',
    difficulty: 'Easy',
    description: 'Fusion street-style fried rice loaded with crispy paneer cubes, fresh carrots, scallions, chili, and dark soy sauce.',
    steps: [
      'Shallow fry paneer cubes until light golden, then keep aside.',
      'In a hot wok, sauté finely chopped onion, carrots, and green chili on high heat.',
      'Add cooked rice and toss briskly.',
      'Drizzle soy sauce, black pepper, and season with salt.',
      'Add the fried paneer cubes and toss everything together for 2 minutes.',
      'Serve hot with spicy chili sauce.'
    ]
  },
  {
    id: 'crispy-chili-potato',
    name: 'Crispy Chili Potato',
    emoji: '🍟',
    ingredients: ['potato', 'onion', 'chili', 'soy sauce', 'spices', 'oil'],
    cookingTime: '20 minutes',
    difficulty: 'Medium',
    description: 'Crispy wok-tossed potato fingers coated in a spicy-sweet soy and chili sauce with bell peppers and onions.',
    steps: [
      'Cut potatoes into fingers, soak in cold water, drain and toss in cornstarch and spices.',
      'Deep or shallow fry potatoes until golden brown and very crisp.',
      'In a separate wok, sauté garlic, sliced onions, and chili.',
      'Add soy sauce, a touch of vinegar, and chili sauce to form a sticky glaze.',
      'Toss in the crispy potatoes quickly so they stay crunchy.',
      'Garnish with spring onions and toasted sesame seeds; serve immediately.'
    ]
  }
];

function initRecipeGenerator() {
  const input = document.getElementById('recipe-ingredient-input');
  const clearBtn = document.getElementById('clear-ingredients-btn');
  const generateBtn = document.getElementById('generate-recipe-btn');
  const resetBtn = document.getElementById('reset-recipe-btn');
  const surpriseBtn = document.getElementById('random-surprise-btn');
  const alertBox = document.getElementById('recipe-alert');
  const loadingState = document.getElementById('recipe-loading-state');
  const resultContainer = document.getElementById('recipe-result-container');
  const quickButtons = document.querySelectorAll('.quick-btn');
  const presetTags = document.querySelectorAll('.preset-tag');
  const loadingStatusText = document.getElementById('loading-status-text');

  if (!input || !generateBtn || !resultContainer) return;

  // Toggle clear button visibility on input
  input.addEventListener('input', () => {
    if (input.value.trim().length > 0) {
      clearBtn.style.display = 'flex';
      hideAlert();
    } else {
      clearBtn.style.display = 'none';
    }
    syncQuickButtonsWithInput();
  });

  // Clear input button handler
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
    syncQuickButtonsWithInput();
  });

  // Quick ingredient buttons handler
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const ing = btn.getAttribute('data-ingredient');
      toggleIngredientInInput(ing);
    });
  });

  // Preset example click handler
  presetTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const preset = tag.getAttribute('data-preset');
      input.value = preset;
      clearBtn.style.display = 'flex';
      syncQuickButtonsWithInput();
      executeRecipeGeneration();
    });
  });

  // Generate recipe button handler
  generateBtn.addEventListener('click', () => {
    executeRecipeGeneration();
  });

  // Enter key in input triggers generation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeRecipeGeneration();
    }
  });

  // Reset Engine handler
  resetBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    hideAlert();
    quickButtons.forEach(b => b.classList.remove('selected'));
    renderWelcomeState();
    showToast('Recipe engine reset to ready state', 'info');
  });

  // Surprise Basket handler
  surpriseBtn.addEventListener('click', () => {
    const surprises = [
      'chicken, rice, onion, carrot',
      'rice, egg, onion',
      'paneer, tomato, onion, spices',
      'potato, onion, chili, spices',
      'rice, tomato, chili',
      'rice, carrot, beans, peas'
    ];
    const picked = surprises[Math.floor(Math.random() * surprises.length)];
    input.value = picked;
    clearBtn.style.display = 'flex';
    syncQuickButtonsWithInput();
    executeRecipeGeneration();
  });

  // Synchronize quick ingredient button highlight state with input string
  function syncQuickButtonsWithInput() {
    const currentTokens = parseIngredients(input.value);
    quickButtons.forEach(btn => {
      const ing = btn.getAttribute('data-ingredient').toLowerCase();
      if (currentTokens.has(normalizeToken(ing))) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  // Toggle ingredient into/out of input box
  function toggleIngredientInInput(ingredientName) {
    let tokens = input.value.split(',').map(s => s.trim()).filter(Boolean);
    const normalizedTarget = normalizeToken(ingredientName);

    const existingIndex = tokens.findIndex(t => normalizeToken(t) === normalizedTarget);
    if (existingIndex >= 0) {
      tokens.splice(existingIndex, 1);
    } else {
      tokens.push(ingredientName);
    }

    input.value = tokens.join(', ');
    if (input.value.length > 0) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
    }
    syncQuickButtonsWithInput();
    hideAlert();
  }

  function showAlert(msg) {
    if (alertBox) {
      alertBox.textContent = msg;
      alertBox.className = 'recipe-alert warning';
    }
  }

  function hideAlert() {
    if (alertBox) {
      alertBox.className = 'recipe-alert';
      alertBox.textContent = '';
    }
  }

  // Parse and normalize comma / space separated user ingredient input
  function parseIngredients(inputString) {
    const rawTokens = inputString
      .toLowerCase()
      .split(/[,;\n+&]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const tokenSet = new Set();
    rawTokens.forEach(token => {
      // also split multiple words if user typed "rice egg onion"
      const words = token.split(/\s+/).filter(Boolean);
      words.forEach(w => tokenSet.add(normalizeToken(w)));
      tokenSet.add(normalizeToken(token));
    });

    return tokenSet;
  }

  // Normalize ingredient tokens (e.g., plurals to singular, synonyms)
  function normalizeToken(token) {
    let str = token.trim().toLowerCase();
    // Synonym mapping
    const synonyms = {
      'chickens': 'chicken',
      'tomatoes': 'tomato',
      'potatoes': 'potato',
      'eggs': 'egg',
      'onions': 'onion',
      'carrots': 'carrot',
      'chillies': 'chili',
      'chilies': 'chili',
      'chilli': 'chili',
      'green chili': 'chili',
      'green chili': 'chili',
      'spices': 'spices',
      'spice': 'spices',
      'soya sauce': 'soy sauce',
      'soysauce': 'soy sauce',
      'cottage cheese': 'paneer',
      'pease': 'peas',
      'pea': 'peas',
      'bean': 'beans',
      'green beans': 'beans'
    };

    if (synonyms[str]) return synonyms[str];

    // Simple plural strip (e.g. carrots -> carrot, except spices/peas/beans)
    if (str.endsWith('ies')) str = str.slice(0, -3) + 'y';
    else if (str.endsWith('es') && !['spices'].includes(str)) str = str.slice(0, -2);
    else if (str.endsWith('s') && !['peas', 'beans', 'spices'].includes(str)) str = str.slice(0, -1);

    return str;
  }

  // Check if a recipe ingredient is matched by the user input tokens
  function isIngredientMatched(recipeIng, userTokens) {
    const normRecipeIng = normalizeToken(recipeIng);
    if (userTokens.has(normRecipeIng)) return true;

    // Check if any user token is a substring or vice versa
    for (let uToken of userTokens) {
      if (normRecipeIng.includes(uToken) || uToken.includes(normRecipeIng)) {
        return true;
      }
    }
    return false;
  }

  // Main Generator Execution Flow
  function executeRecipeGeneration() {
    const rawVal = input.value.trim();

    // 1. Empty input validation
    if (!rawVal) {
      showAlert('⚠️ Please enter at least one ingredient to generate recipes (e.g., "chicken, rice, onion").');
      input.focus();
      return;
    }

    hideAlert();
    const userTokens = parseIngredients(rawVal);

    // 2. Perform Recipe Matching Calculation
    const matchResults = [];

    recipeDatabase.forEach(recipe => {
      const available = [];
      const missing = [];

      // Culinary weighted pantry scoring (core staples have higher culinary impact than minor seasonings)
      const stapleWeights = {
        'rice': 30, 'chicken': 35, 'egg': 25, 'paneer': 35, 'potato': 35, 'tomato': 28, 'onion': 20,
        'carrot': 12, 'soy sauce': 13, 'chili': 10, 'spices': 10, 'cream': 12, 'oil': 10, 'beans': 12, 'peas': 10
      };

      let weightedAvailable = 0;
      let totalWeight = 0;

      recipe.ingredients.forEach(ing => {
        const norm = normalizeToken(ing);
        const w = stapleWeights[norm] || 15;
        totalWeight += w;

        if (isIngredientMatched(ing, userTokens)) {
          weightedAvailable += w;
          available.push(ing);
        } else {
          missing.push(ing);
        }
      });

      const matchPct = totalWeight > 0 ? Math.min(100, Math.round((weightedAvailable / totalWeight) * 100)) : 0;

      // We only consider recipes that have at least 1 match
      if (available.length > 0) {
        matchResults.push({
          recipe,
          matchPct,
          available,
          missing,
          score: matchPct * 10 + (available.length * 5)
        });
      }
    });

    // Sort matching results descending
    matchResults.sort((a, b) => b.score - a.score);

    // 3. Show dynamic loading animation for AI feedback feel
    showLoadingSequence(() => {
      if (matchResults.length === 0) {
        renderNoMatchesState(rawVal);
      } else {
        renderMatchedRecipe(matchResults[0], matchResults);
      }
    });
  }

  // Loading animation simulation
  function showLoadingSequence(callback) {
    resultContainer.style.display = 'none';
    loadingState.classList.add('active');
    loadingState.setAttribute('aria-hidden', 'false');

    const phrases = [
      'Scanning pantry ingredients...',
      'Cross-referencing culinary database...',
      'Calculating ingredient match scores & steps...'
    ];

    let step = 0;
    loadingStatusText.textContent = phrases[0];

    const interval = setInterval(() => {
      step++;
      if (step < phrases.length) {
        loadingStatusText.textContent = phrases[step];
      }
    }, 240);

    setTimeout(() => {
      clearInterval(interval);
      loadingState.classList.remove('active');
      loadingState.setAttribute('aria-hidden', 'true');
      resultContainer.style.display = 'block';
      callback();
    }, 750);
  }

  // Render when zero matches exist
  function renderNoMatchesState(userInput) {
    resultContainer.innerHTML = `
      <div class="recipe-no-match-card">
        <div class="no-match-icon">🥣</div>
        <h3>No Exact Recipe Match Found</h3>
        <p>
          We couldn't find a matching recipe for <strong>"${escapeHTML(userInput)}"</strong> in our current database. 
          Try adding common staples like <strong>rice, chicken, egg, tomato, potato,</strong> or <strong>paneer</strong>.
        </p>
        <div class="recipe-try-suggestions">
          <span>Try one of these combos:</span>
          <button type="button" class="preset-tag" data-preset="chicken, rice, onion">"chicken, rice, onion"</button>
          <button type="button" class="preset-tag" data-preset="rice, egg, onion">"rice, egg, onion"</button>
          <button type="button" class="preset-tag" data-preset="potato, onion, chili">"potato, onion, chili"</button>
        </div>
      </div>
    `;

    // Reattach listener to new suggestion tags
    resultContainer.querySelectorAll('.preset-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        input.value = tag.getAttribute('data-preset');
        clearBtn.style.display = 'flex';
        syncQuickButtonsWithInput();
        executeRecipeGeneration();
      });
    });
  }

  // Render initial welcome state
  function renderWelcomeState() {
    resultContainer.innerHTML = `
      <div class="recipe-welcome-state" id="recipe-welcome-state">
        <div class="welcome-icon-box">🥘</div>
        <h3>Ready to cook something delicious?</h3>
        <p>Type the ingredients you have on hand or click any of the quick tags above, then hit <strong>"Generate Recipe"</strong>.</p>
        <div class="recipe-try-suggestions">
          <span>Try quick combos:</span>
          <button type="button" class="preset-tag" data-preset="rice, egg, onion">"rice, egg, onion"</button>
          <button type="button" class="preset-tag" data-preset="chicken, rice, onion, carrot">"chicken, rice, onion, carrot"</button>
          <button type="button" class="preset-tag" data-preset="paneer, tomato, onion">"paneer, tomato, onion"</button>
          <button type="button" class="preset-tag" data-preset="potato, onion, chili">"potato, onion, chili"</button>
        </div>
      </div>
    `;

    resultContainer.querySelectorAll('.preset-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        input.value = tag.getAttribute('data-preset');
        clearBtn.style.display = 'flex';
        syncQuickButtonsWithInput();
        executeRecipeGeneration();
      });
    });
  }

  // Render matched recipe card
  function renderMatchedRecipe(topMatch, allMatches) {
    const { recipe, matchPct, available, missing } = topMatch;

    let badgeClass = 'match-high';
    if (matchPct < 50) badgeClass = 'match-low';
    else if (matchPct < 75) badgeClass = 'match-med';

    const diffClass = recipe.difficulty.toLowerCase() === 'easy' ? 'easy' : 'medium';

    // Alternative matches (other recipes that also matched)
    const otherMatches = allMatches.filter(m => m.recipe.id !== recipe.id);

    resultContainer.innerHTML = `
      <div class="recipe-display-card" id="recipe-card-${recipe.id}">
        <!-- Header -->
        <div class="recipe-display-header">
          <div class="recipe-hero-meta">
            <div class="recipe-thumb-box">${recipe.emoji}</div>
            <div class="recipe-title-group">
              <h3>${recipe.name}</h3>
              <div class="recipe-quick-specs">
                <span class="spec-pill">⏱️ ${recipe.cookingTime}</span>
                <span class="spec-pill ${diffClass}">🔥 ${recipe.difficulty}</span>
                <span class="spec-pill">🥗 ${recipe.ingredients.length} Total Ingredients</span>
              </div>
            </div>
          </div>

          <div class="match-gauge-wrapper">
            <div class="match-badge ${badgeClass}">
              <span>${matchPct}%</span>
            </div>
            <span class="match-label">Pantry Match</span>
          </div>
        </div>

        <!-- Ingredients Available vs Missing Grid -->
        <div class="ingredients-compare-grid">
          <!-- Available Column -->
          <div class="ingredient-column">
            <div class="column-header available">
              <span>✓</span>
              <span>Available in Your Kitchen (${available.length})</span>
            </div>
            <div class="ingredient-chips-list">
              ${available.map(ing => `
                <div class="ingredient-chip chip-available">
                  <span><strong class="check-symbol">✓</strong> ${capitalize(ing)}</span>
                  <span style="font-size:0.75rem; color:#34d399; font-family:var(--font-mono)">In Pantry</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Missing Column -->
          <div class="ingredient-column">
            <div class="column-header missing">
              <span>○</span>
              <span>Missing Ingredients (${missing.length})</span>
            </div>
            <div class="ingredient-chips-list">
              ${missing.length > 0 ? missing.map(ing => `
                <div class="ingredient-chip chip-missing">
                  <span><strong class="circle-symbol">○</strong> ${capitalize(ing)}</span>
                  <span style="font-size:0.75rem; color:#f59e0b; font-family:var(--font-mono)">Needed</span>
                </div>
              `).join('') : `
                <div class="none-missing-text">
                  🎉 Fantastic! You have 100% of the required ingredients!
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Step by Step Preparation -->
        <div class="preparation-steps-block">
          <h4 class="steps-title">
            <span>👨‍🍳</span> Step-by-Step Preparation
          </h4>
          <ol class="steps-list">
            ${recipe.steps.map((step, idx) => `
              <li class="step-item">
                <span class="step-num-badge">${idx + 1}</span>
                <p class="step-text">${step}</p>
              </li>
            `).join('')}
          </ol>
        </div>

        <!-- Alternative matches if available -->
        ${otherMatches.length > 0 ? `
          <div class="alternative-matches-block">
            <h5 class="alt-title">Other Recipes Matching Your Ingredients:</h5>
            <div class="alt-recipes-pills">
              ${otherMatches.map(m => `
                <button type="button" class="alt-recipe-btn" data-alt-id="${m.recipe.id}">
                  <span>${m.recipe.emoji} ${m.recipe.name}</span>
                  <span class="alt-match-pct">(${m.matchPct}%)</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Footer Actions -->
        <div class="recipe-display-footer">
          <button type="button" class="btn btn-secondary" id="try-another-recipe-btn">
            <span>🔄 Try Another Recipe</span>
          </button>
          <span style="font-size: 0.82rem; color: #64748b; font-family: var(--font-mono)">
            Powered by In-Browser Culinary Logic
          </span>
        </div>
      </div>
    `;

    // Hook up "Try Another Recipe" button
    const tryAnotherBtn = document.getElementById('try-another-recipe-btn');
    if (tryAnotherBtn) {
      tryAnotherBtn.addEventListener('click', () => {
        if (otherMatches.length > 0) {
          // Cycle to the second match
          renderMatchedRecipe(otherMatches[0], allMatches);
          showToast(`Switched to: ${otherMatches[0].recipe.name}`, 'info');
        } else {
          // If no other matches, pick a random alternative recipe from database
          const otherRecipes = recipeDatabase.filter(r => r.id !== recipe.id);
          const randomOther = otherRecipes[Math.floor(Math.random() * otherRecipes.length)];
          const sampleMatch = {
            recipe: randomOther,
            matchPct: 60,
            available: randomOther.ingredients.slice(0, 3),
            missing: randomOther.ingredients.slice(3)
          };
          renderMatchedRecipe(sampleMatch, [sampleMatch]);
          showToast(`Displaying inspiration: ${randomOther.name}`, 'info');
        }
      });
    }

    // Hook up alternative match pill clicks
    resultContainer.querySelectorAll('.alt-recipe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const altId = btn.getAttribute('data-alt-id');
        const picked = allMatches.find(m => m.recipe.id === altId);
        if (picked) {
          renderMatchedRecipe(picked, allMatches);
          showToast(`Loaded: ${picked.recipe.name}`, 'info');
        }
      });
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* ==========================================================================
   6. CONTACT FORM & VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('form-status');

  if (!form || !submitBtn) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(input, isValid) {
    if (!isValid) {
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
    }
    return isValid;
  }

  // Real-time input validation on change/blur
  nameInput.addEventListener('input', () => validateField(nameInput, nameInput.value.trim().length > 0));
  emailInput.addEventListener('input', () => validateField(emailInput, validateEmail(emailInput.value.trim())));
  msgInput.addEventListener('input', () => validateField(msgInput, msgInput.value.trim().length >= 5));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
    const isEmailValid = validateField(emailInput, validateEmail(emailInput.value.trim()));
    const isMsgValid = validateField(msgInput, msgInput.value.trim().length >= 5);

    if (!isNameValid || !isEmailValid || !isMsgValid) {
      showToast('Please fix the errors in the form before sending.', 'info');
      return;
    }

    // Simulate sending state
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="btn-text">Sending Message...</span>
      <span style="display:inline-block; animation: spin 1s infinite linear;">⏳</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const senderName = nameInput.value.trim();
      form.reset();

      // Show success status
      if (statusBox) {
        statusBox.className = 'form-status success';
        statusBox.innerHTML = `
          <strong>Message Received!</strong> Thank you, ${escapeHTML(senderName)}. Thanushree will review your message and reach out shortly.
        `;
        statusBox.style.display = 'block';

        setTimeout(() => {
          statusBox.style.display = 'none';
        }, 6000);
      }

      showToast(`Thank you, ${senderName}! Message sent successfully.`, 'success');
    }, 900);
  });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
