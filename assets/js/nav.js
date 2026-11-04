/* ==========================================================================
   NAVIGATION
   ========================================================================== */

export function initNav() {
  initCompactHeader();
  initDropdowns();
  initMobileMenu();
  initActiveSection();
}

function initCompactHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const syncHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);

  const onScroll = () => {
    header.classList.toggle("is-compact", window.scrollY > 24);
    syncHeaderHeight(); // compact mode changes the header's height
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initDropdowns() {
  const groups = document.querySelectorAll(".nav-group");
  groups.forEach((group) => {
    const trigger = group.querySelector(".nav-group__trigger");
    const menu = group.querySelector(".nav-group__menu");
    if (!trigger || !menu) return;

    const close = () => {
      group.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      groups.forEach((g) => g !== group && g.classList.remove("is-open"));
      group.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      group.classList.contains("is-open") ? close() : open();
    });
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); open(); menu.querySelector("a")?.focus(); }
      if (e.key === "Escape") close();
    });
    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { close(); trigger.focus(); }
    });
  });

  document.addEventListener("click", () => groups.forEach((g) => g.classList.remove("is-open")));
}

function initMobileMenu() {
  const btn = document.querySelector(".mobile-menu-btn");
  const menu = document.querySelector(".nav-mobile");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const open = () => {
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  btn.addEventListener("click", () => {
    btn.getAttribute("aria-expanded") === "true" ? close() : open();
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); btn.focus(); }
  });
}

function initActiveSection() {
  const links = Array.from(document.querySelectorAll(".nav-link[href^='#'], .nav-mobile__link[href^='#']"));
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  if (!links.length || !sections.length) return;

  // Sections reached only through a dropdown (Journey/Work/Knowledge) have no
  // top-level .nav-link of their own, so highlight their group trigger instead.
  const groupTriggerFor = new Map();
  document.querySelectorAll(".nav-group").forEach((group) => {
    const trigger = group.querySelector(".nav-group__trigger");
    group.querySelectorAll(".nav-group__menu a[href^='#']").forEach((a) => {
      groupTriggerFor.set(a.getAttribute("href").slice(1), trigger);
    });
  });
  const allTriggers = Array.from(document.querySelectorAll(".nav-group__trigger"));

  const setActive = (id) => {
    links.forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      link.toggleAttribute("aria-current", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    allTriggers.forEach((t) => t.classList.remove("is-active-section"));
    const trigger = groupTriggerFor.get(id);
    if (trigger) trigger.classList.add("is-active-section");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
  );
  sections.forEach((s) => observer.observe(s));
}
