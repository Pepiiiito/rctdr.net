const PROJECT = {
  ownerName: "Adri\u00e0 Gonz\u00e1lez Dom\u00e8nech",
  contactEmail: "20agonzalez@insbde.net",
  videos: [
    {
      title: "V\u00eddeo general de muntatge i funcionament",
      tag: "General",
      description: "Mostra completa del muntatge i del funcionament del vehicle RC.",
      embed: "https://www.youtube.com/embed/rWLSy-YXUao"
    }
  ],
  models: [
    {
      title: "Model inicial \u00b7 Xass\u00eds prova final",
      tag: "Dissenys inicials",
      description: "Visualitzaci\u00f3 3D del xass\u00eds principal.",
      stlUrl: "https://raw.githubusercontent.com/Pepiiiito/disseny-cotxe/4d97e7299fbadb52bbcf9b29f367382a9c160273/Xass%C3%ADs%20prova%20final.stl",
      sourceUrl: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Xass%C3%ADs%20prova%20final.stl"
    },
    {
      title: "Model inicial \u00b7 Components tracci\u00f3",
      tag: "Dissenys inicials",
      description: "Visualitzaci\u00f3 3D del conjunt de tracci\u00f3.",
      stlUrl: "https://raw.githubusercontent.com/Pepiiiito/disseny-cotxe/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20tracci%C3%B3.stl",
      sourceUrl: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20tracci%C3%B3.stl"
    },
    {
      title: "Model inicial \u00b7 Components direcci\u00f3",
      tag: "Dissenys inicials",
      description: "Visualitzaci\u00f3 3D del conjunt de direcci\u00f3.",
      stlUrl: "https://raw.githubusercontent.com/Pepiiiito/disseny-cotxe/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20direcci%C3%B3.stl",
      sourceUrl: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20direcci%C3%B3.stl"
    },
    {
      title: "Model 2 (stand by)",
      tag: "Dissenys V2",
      description: "A l'espera dels enlla\u00e7os finals del model 2.",
      stlUrl: "",
      sourceUrl: "#"
    }
  ],
  resources: [
    {
      title: "Mem\u00f2ria del TDR (PDF)",
      description: "Document complet de recerca, desenvolupament i conclusions.",
      meta: "Document principal",
      href: "docs/TdR.pdf",
      cta: "Obrir PDF"
    },
    {
      title: "Guia d'impressi\u00f3",
      description: "Par\u00e0metres recomanats per material i orientaci\u00f3.",
      meta: "Fabricaci\u00f3",
      href: "#",
      cta: "Enlla\u00e7 pendent"
    },
    {
      title: "Manual de muntatge",
      description: "Ordre de muntatge, ajustos i comprovacions finals.",
      meta: "Implementaci\u00f3",
      href: "#",
      cta: "Enlla\u00e7 pendent"
    },
    {
      title: "Model inicial \u00b7 Xass\u00eds prova final",
      description: "Fitxer STL del model inicial (xass\u00eds).",
      meta: "Dissenys inicials",
      href: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Xass%C3%ADs%20prova%20final.stl",
      cta: "Obrir STL"
    },
    {
      title: "Model inicial \u00b7 Components tracci\u00f3",
      description: "Fitxer STL dels components de tracci\u00f3 del model inicial.",
      meta: "Dissenys inicials",
      href: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20tracci%C3%B3.stl",
      cta: "Obrir STL"
    },
    {
      title: "Model inicial \u00b7 Components direcci\u00f3",
      description: "Fitxer STL dels components de direcci\u00f3 del model inicial.",
      meta: "Dissenys inicials",
      href: "https://github.com/Pepiiiito/disseny-cotxe/blob/4d97e7299fbadb52bbcf9b29f367382a9c160273/Components%20direcci%C3%B3.stl",
      cta: "Obrir STL"
    },
    {
      title: "Model 2 (stand by)",
      description: "Els enlla\u00e7os del model 2 s'afegiran quan estiguin disponibles.",
      meta: "Dissenys V2",
      href: "#",
      cta: "Enlla\u00e7 pendent"
    }
  ]
};

const byId = (id) => document.getElementById(id);
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

init();

function init() {
  setActiveNav();
  initMenu();
  initProgressBar();
  initRevealObserver();
  initTabs();
  renderVideos();
  renderResources();
  renderModels();
  initVideoModal();
  initFaq();
  initContactForm();
  setFooterText();
}

function setActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  qsa(".main-nav a[data-page]").forEach((link) => {
    const current = link.dataset.page === page;
    link.classList.toggle("is-current", current);
    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initMenu() {
  const toggle = byId("menuToggle");
  const nav = byId("mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  qsa("a", nav).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initProgressBar() {
  const progress = byId("scrollProgress");
  if (!progress) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initRevealObserver() {
  const nodes = qsa(".reveal");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initTabs() {
  const tabs = qsa(".tab");
  const panels = qsa(".tab-panel");
  if (!tabs.length || !panels.length) return;

  const activateTab = (tab) => {
    const target = tab.dataset.tab;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.id === `panel-${target}`;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      const key = event.key;
      const last = tabs.length - 1;
      let nextIndex = index;

      if (key === "ArrowRight") nextIndex = index === last ? 0 : index + 1;
      if (key === "ArrowLeft") nextIndex = index === 0 ? last : index - 1;
      if (key === "Home") nextIndex = 0;
      if (key === "End") nextIndex = last;

      if (nextIndex !== index) {
        event.preventDefault();
        const nextTab = tabs[nextIndex];
        activateTab(nextTab);
        nextTab.focus();
      }
    });
  });

  const initial = tabs.find((tab) => tab.classList.contains("is-active")) || tabs[0];
  activateTab(initial);
}

function renderVideos() {
  const grid = byId("videoGrid");
  if (!grid) return;

  const html = PROJECT.videos
    .map(
      (video, index) => `
      <article class="video-card reveal">
        <button
          class="video-thumb"
          type="button"
          data-video-index="${index}"
          aria-label="Obrir v\u00eddeo: ${escapeHtml(video.title)}"
        >
          <span>&#9654;</span>
        </button>
        <div class="video-content">
          <p class="card-meta">${escapeHtml(video.tag)}</p>
          <h3>${escapeHtml(video.title)}</h3>
          <p>${escapeHtml(video.description)}</p>
          <button class="card-action" type="button" data-video-index="${index}">Reprodueix</button>
        </div>
      </article>
    `
    )
    .join("");

  grid.innerHTML = html;
  initRevealObserver();
}

function renderResources() {
  const grid = byId("resourceGrid");
  if (!grid) return;

  const html = PROJECT.resources
    .map((resource) => {
      const href = resource.href && resource.href !== "#" ? resource.href : "#";
      const disabled = href === "#";

      return `
      <article class="resource-card reveal">
        <div class="resource-content">
          <p class="card-meta">${escapeHtml(resource.meta)}</p>
          <h3>${escapeHtml(resource.title)}</h3>
          <p>${escapeHtml(resource.description)}</p>
          <a
            class="card-action"
            href="${escapeHtml(href)}"
            ${disabled ? 'data-pending="true"' : 'target="_blank" rel="noopener noreferrer"'}
          >
            ${escapeHtml(resource.cta)}
          </a>
        </div>
      </article>
      `;
    })
    .join("");

  grid.innerHTML = html;
  initRevealObserver();

  qsa("[data-pending='true']", grid).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.alert("Encara no hi ha URL configurada. Edita l'enlla\u00e7 a app.js > PROJECT.resources.");
    });
  });
}

function renderModels() {
  const gallery = byId("modelGallery");
  if (!gallery) return;

  const html = PROJECT.models
    .map((model, index) => {
      const isStandby = !model.stlUrl;
      const statusId = `model-status-${index}`;

      return `
      <article class="model-card reveal ${isStandby ? "is-standby" : ""}">
        <div class="model-canvas-wrap">
          ${
            isStandby
              ? `<div class="model-standby">Model en espera</div>`
              : `<div class="model-canvas" data-stl-url="${escapeHtml(model.stlUrl)}" data-status-id="${statusId}"></div>`
          }
        </div>
        <div class="model-content">
          <p class="card-meta">${escapeHtml(model.tag)}</p>
          <h3>${escapeHtml(model.title)}</h3>
          <p>${escapeHtml(model.description)}</p>
          <p class="model-status" id="${statusId}">
            ${isStandby ? "Encara sense fitxer STL." : "Carregant model 3D..."}
          </p>
          <a
            class="card-action"
            href="${escapeHtml(model.sourceUrl || "#")}"
            ${isStandby ? 'data-pending="true"' : 'target="_blank" rel="noopener noreferrer"'}
          >
            ${isStandby ? "Enlla\u00e7 pendent" : "Obrir STL a GitHub"}
          </a>
        </div>
      </article>
      `;
    })
    .join("");

  gallery.innerHTML = html;
  initRevealObserver();

  qsa(".model-canvas[data-stl-url]", gallery).forEach((canvasHost) => {
    initModelViewer(canvasHost);
  });

  qsa("[data-pending='true']", gallery).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.alert("Model en stand by: afegirem aquest STL quan el tinguis.");
    });
  });
}

function initModelViewer(canvasHost) {
  const stlUrl = canvasHost.dataset.stlUrl;
  const statusId = canvasHost.dataset.statusId;
  const statusNode = statusId ? byId(statusId) : null;

  if (!window.THREE || typeof window.THREE.STLLoader !== "function") {
    canvasHost.innerHTML = `<div class="model-fallback">No s'ha pogut carregar el visor 3D en aquest navegador.</div>`;
    if (statusNode) statusNode.textContent = "Visor 3D no disponible.";
    return;
  }

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfff7eb);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 2000);
  camera.position.set(120, 90, 140);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  canvasHost.innerHTML = "";
  canvasHost.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xdde2f0, 1.15);
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  key.position.set(80, 120, 110);
  fill.position.set(-60, -20, -50);
  scene.add(hemi, key, fill);

  const group = new THREE.Group();
  scene.add(group);

  let controls = null;
  if (typeof THREE.OrbitControls === "function") {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = false;
    controls.minDistance = 35;
    controls.maxDistance = 500;
  }

  const loader = new THREE.STLLoader();
  loader.load(
    stlUrl,
    (geometry) => {
      geometry.center();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      const bbox = geometry.boundingBox;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 95 / maxDim;
      geometry.scale(scale, scale, scale);
      geometry.center();
      geometry.computeBoundingSphere();

      const material = new THREE.MeshStandardMaterial({
        color: 0x0b8f9c,
        roughness: 0.55,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      group.add(mesh);

      const radius = geometry.boundingSphere ? geometry.boundingSphere.radius : 40;
      camera.position.set(radius * 2.1, radius * 1.4, radius * 2.1);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }

      if (statusNode) statusNode.textContent = "Model carregat. Pots girar i fer zoom.";
    },
    undefined,
    () => {
      canvasHost.innerHTML = `<div class="model-fallback">No s'ha pogut carregar aquest STL.</div>`;
      if (statusNode) statusNode.textContent = "Error carregant el model.";
    }
  );

  const resize = () => {
    const width = canvasHost.clientWidth;
    const height = canvasHost.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  resize();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => resize());
    observer.observe(canvasHost);
  } else {
    window.addEventListener("resize", resize);
  }

  const animate = () => {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

function initVideoModal() {
  const dialog = byId("videoModal");
  const body = byId("modalBody");
  const closeBtn = byId("modalClose");

  if (!dialog || !body) return;

  const openVideo = (index) => {
    const item = PROJECT.videos[index];
    if (!item || !item.embed) {
      window.alert("Falta configurar l'enlla\u00e7 embed d'aquest v\u00eddeo a app.js.");
      return;
    }

    const iframe = `
      <iframe
        src="${escapeHtml(item.embed)}"
        title="${escapeHtml(item.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;

    body.innerHTML = iframe;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      window.open(item.embed, "_blank", "noopener,noreferrer");
    }
  };

  qsa("[data-video-index]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openVideo(Number(trigger.dataset.videoIndex));
    });
  });

  const closeModal = () => {
    if (dialog.open) {
      dialog.close();
    }
    body.innerHTML = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal();
  });
  dialog.addEventListener("close", () => {
    body.innerHTML = "";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) closeModal();
  });
}

function initFaq() {
  qsa(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = qs(".faq-answer", item);
      const expanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.hidden = expanded;

      const icon = qs("span", button);
      if (icon) icon.textContent = expanded ? "+" : "-";
    });
  });
}

function initContactForm() {
  const form = byId("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      window.alert("Completa tots els camps abans d'enviar.");
      return;
    }

    const subject = encodeURIComponent(`Consulta sobre el RCTDR - ${name}`);
    const body = encodeURIComponent(`Nom: ${name}\nCorreu: ${email}\n\nMissatge:\n${message}`);
    window.location.href = `mailto:${PROJECT.contactEmail}?subject=${subject}&body=${body}`;
  });
}

function setFooterText() {
  const node = byId("copyright");
  if (!node) return;

  const year = new Date().getFullYear();
  node.textContent = `\u00A9 ${year} ${PROJECT.ownerName}. Portfoli del TDR RCTDR.`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
