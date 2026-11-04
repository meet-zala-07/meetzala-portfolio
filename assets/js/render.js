/* ==========================================================================
   RENDER
   Turns JSON data into markup for every section. HTML files hold only
   structural chrome (nav, section headers); everything content-shaped is
   rendered here from assets/data/*.json.
   ========================================================================== */

export function icon(name, cls = "icon") {
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const monthFmt = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  if (!m) return y;
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[Number(m) - 1]} ${y}`;
};

/* ---------------------------- Hero ---------------------------- */

export function computeHeroStats({ projects, certifications, achievements, academics }) {
  const stats = [
    { label: "Projects Built", value: projects.length },
    { label: "Certifications", value: certifications.length },
  ];

  if (achievements.length > 0) {
    stats.push({ label: "Achievements", value: achievements.length });
  } else {
    const semesters = (academics.programs || []).reduce((n, p) => n + p.semesters.length, 0);
    stats.push({ label: "Semesters Completed", value: semesters });
  }
  return stats;
}

export function renderHero(site, stats) {
  const statusBadge = document.querySelector("[data-hero-status-badge]");
  if (statusBadge) statusBadge.textContent = site.hero.status;

  document.querySelector("[data-hero-headline]").textContent = site.hero.headline;
  document.querySelector("[data-hero-description]").textContent = site.hero.description;
  document.querySelector("[data-hero-title]").textContent = site.owner.title;

  const statsEl = document.querySelector("[data-hero-stats]");
  statsEl.innerHTML = stats
    .map((s) => `<div class="stat"><div class="stat__value">${s.value}</div><div class="stat__label">${esc(s.label)}</div></div>`)
    .join("");

  document.querySelector("[data-hero-monogram]").textContent = site.owner.monogram;
  document.querySelector("[data-hero-status]").textContent = site.hero.status;
  document.querySelector("[data-hero-currently]").textContent = site.hero.currently;

  const focusEl = document.querySelector("[data-hero-focus]");
  focusEl.textContent = site.hero.focus.join(" · ");

  const locationRow = document.querySelector("[data-hero-location-row]");
  if (locationRow) {
    if (site.owner.location) {
      locationRow.querySelector("[data-hero-location]").textContent = site.owner.location;
      locationRow.style.display = "";
    } else {
      locationRow.style.display = "none";
    }
  }

  const social = document.querySelector("[data-hero-social]");
  social.innerHTML = [
    `<a class="social-link" href="${site.social.github}" target="_blank" rel="noopener" aria-label="GitHub">${icon("github")}</a>`,
    `<a class="social-link" href="${site.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>`,
    `<a class="social-link" href="mailto:${site.social.email}" aria-label="Email">${icon("mail")}</a>`,
    `<a class="social-link" href="${site.social.codingChannel}" target="_blank" rel="noopener" aria-label="Coding Channel">${icon("whatsapp")}</a>`,
  ].join("");
}

/* ---------------------------- About ---------------------------- */

export function renderAbout(site) {
  document.querySelector("[data-about-pillars]").innerHTML = site.about.pillars
    .map((p) => `<div class="pillar"><div class="pillar__label mono">${esc(p.label)}</div><p class="pillar__text">${esc(p.text)}</p></div>`)
    .join("");

  document.querySelector("[data-about-profile]").innerHTML = site.about.profile
    .map((p) => `<div class="profile-grid__cell"><dt>${esc(p.label)}</dt><dd>${esc(p.value)}</dd></div>`)
    .join("");
}

/* ---------------------------- Education ---------------------------- */

export function renderEducation(list) {
  const el = document.querySelector("[data-education-list]");
  el.innerHTML = list
    .map((e) => {
      const years = e.startYear ? `${esc(e.startYear)}–${esc(e.endYear)}` : esc(e.endYear);
      const tags = [
        e.location ? `<span class="badge">${esc(e.location)}</span>` : "",
        e.status ? `<span class="badge ${e.status === "Currently Pursuing" || e.status === "In Progress" ? "badge--accent" : "badge--success"}">${esc(e.status)}</span>` : "",
        e.result ? `<span class="badge mono">${esc(e.result)}</span>` : "",
        e.grade ? `<span class="badge mono">Grade ${esc(e.grade)}</span>` : "",
      ].join("");
      return `
      <div class="timeline-item reveal">
        <div class="timeline-item__years mono">${years}</div>
        <div class="timeline-item__rule"></div>
        <div class="timeline-item__body">
          <h3>${esc(e.qualification)}</h3>
          <div class="timeline-item__sub">${esc(e.institution)}${e.board ? " · " + esc(e.board) : ""}</div>
          <p class="timeline-item__desc">${esc(e.description)}</p>
          <div class="timeline-item__tags">${tags}</div>
        </div>
      </div>`;
    })
    .join("");
}

/* ---------------------------- Experience ---------------------------- */

export function renderExperience(list) {
  const el = document.querySelector("[data-experience-content]");
  if (!list.length) {
    el.innerHTML = `
      <div class="empty-state reveal">
        <div class="empty-state__kicker mono">CURRENTLY / NO FORMAL ROLES YET</div>
        <p class="empty-state__text">Meet is presently building practical experience through academic learning, independent projects and deliberate software development practice. Professional experience will be added here as the journey progresses.</p>
        <a class="btn btn-secondary" href="#projects">${icon("arrow-right")} See the projects instead</a>
      </div>`;
    return;
  }
  el.innerHTML = `<div class="card-grid">${list
    .map(
      (x) => `
      <div class="card reveal">
        <div class="card__top"><span class="card__id mono">${esc(x.role)}</span><span class="badge">${esc(x.employmentType || "")}</span></div>
        <h3 class="card__title">${esc(x.organization)}</h3>
        <p class="card__summary">${esc(x.description || "")}</p>
      </div>`
    )
    .join("")}</div>`;
}

/* ---------------------------- Skills ---------------------------- */

export function renderSkills(groups) {
  const el = document.querySelector("[data-skills-matrix]");
  el.innerHTML = groups
    .map(
      (g) => `
      <div class="skill-group reveal">
        <div class="skill-group__title mono">${esc(g.category)}</div>
        <div class="skill-group__grid">
          ${g.items
            .map((i) => `<div class="skill-cell"><span class="skill-cell__name">${esc(i.name)}</span><span class="skill-cell__status mono">${esc(i.status)}</span></div>`)
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

/* ---------------------------- Projects ---------------------------- */

function projectCard(p) {
  return `
    <article class="card ${p.featured ? "card--featured" : ""} reveal">
      <div class="card__top">
        <span class="card__id mono">${esc(p.id.toUpperCase().replace("PROJ-", "PROJECT_"))}</span>
        <span class="badge ${p.status === "Completed" ? "badge--success" : "badge--accent"}">${esc(p.status)}</span>
      </div>
      <h3 class="card__title">${esc(p.title)}</h3>
      <p class="card__summary">${esc(p.summary)}</p>
      <div class="card__tech">${p.technologies.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="card__actions">
        <a href="project.html?slug=${encodeURIComponent(p.slug)}">${icon("arrow-right")} View Details</a>
        ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener">${icon("github")} Code</a>` : ""}
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">${icon("external")} Live</a>` : ""}
      </div>
    </article>`;
}

export function renderProjects(list) {
  const featured = list.filter((p) => p.featured);
  document.querySelector("[data-projects-featured]").innerHTML = featured.map(projectCard).join("");

  const allGrid = document.querySelector("[data-projects-all]");
  allGrid.innerHTML = list.map(projectCard).join("");

  const techs = [...new Set(list.flatMap((p) => p.technologies))].sort();
  const filterBar = document.querySelector("[data-projects-filters]");
  if (techs.length > 1) {
    filterBar.innerHTML = [`<button class="filter-chip" data-filter="All" aria-pressed="true">All</button>`]
      .concat(techs.map((t) => `<button class="filter-chip" data-filter="${esc(t)}" aria-pressed="false">${esc(t)}</button>`))
      .join("");
    filterBar.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;
        allGrid.querySelectorAll(":scope > article").forEach((card, i) => {
          const match = f === "All" || list[i].technologies.includes(f);
          card.style.display = match ? "" : "none";
        });
      });
    });
  }
}

/* ---------------------------- Certifications ---------------------------- */

function certCard(c) {
  return `
    <article class="card ${c.featured ? "card--featured" : ""} reveal">
      <div class="card__top">
        <span class="card__id mono">${esc(c.category.toUpperCase())}</span>
      </div>
      <h3 class="card__title">${esc(c.title)}</h3>
      <p class="card__summary">${esc(c.issuer)} · ${monthFmt(c.issueDate)}${c.level ? " · " + esc(c.level) : ""}${c.score ? " · " + esc(c.score) : ""}</p>
      <div class="card__tech">${(c.skills || []).map((s) => `<span>${esc(s)}</span>`).join("")}</div>
      ${
        c.file || c.verifyUrl
          ? `<div class="card__actions">
              ${c.file ? `<a href="${c.file}" target="_blank" rel="noopener">${icon("external")} View Certificate</a>` : ""}
              ${c.verifyUrl ? `<a href="${c.verifyUrl}" target="_blank" rel="noopener">${icon("external")} Verify</a>` : ""}
            </div>`
          : ""
      }
    </article>`;
}

export function renderCertifications(list) {
  document.querySelector("[data-certs-featured]").innerHTML = list.filter((c) => c.featured).map(certCard).join("");
  const allGrid = document.querySelector("[data-certs-all]");
  allGrid.innerHTML = list.map(certCard).join("");

  const cats = [...new Set(list.map((c) => c.category))];
  const filterBar = document.querySelector("[data-certs-filters]");
  if (cats.length > 1) {
    filterBar.innerHTML = [`<button class="filter-chip" data-filter="All" aria-pressed="true">All</button>`]
      .concat(cats.map((c) => `<button class="filter-chip" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`))
      .join("");
    filterBar.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;
        allGrid.querySelectorAll(":scope > article").forEach((card, i) => {
          const match = f === "All" || list[i].category === f;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }
}

/* ---------------------------- Achievements ---------------------------- */

export function renderAchievements(list) {
  const el = document.querySelector("[data-achievements-content]");
  if (!list.length) {
    el.innerHTML = `
      <div class="empty-state reveal">
        <div class="empty-state__kicker mono">BUILDING TOWARD THE NEXT MILESTONE.</div>
        <p class="empty-state__text">Current focus is technical skills, projects and academics. Competition placements, hackathon results and other recognition will be documented here as they happen.</p>
        <a class="btn btn-secondary" href="#projects">${icon("arrow-right")} See the projects instead</a>
      </div>`;
    return;
  }
  el.innerHTML = `<div class="timeline">${list
    .map(
      (a) => `
      <div class="timeline-item reveal">
        <div class="timeline-item__years mono">${esc(a.period) || monthFmt(a.date)}</div>
        <div class="timeline-item__rule"></div>
        <div class="timeline-item__body">
          <h3>${esc(a.title)}</h3>
          <div class="timeline-item__sub">${esc(a.organization)}</div>
          <p class="timeline-item__desc">${esc(a.description)}</p>
        </div>
      </div>`
    )
    .join("")}</div>`;
}

/* ---------------------------- Academics ---------------------------- */

export function renderAcademics(data) {
  const program = data.programs[data.programs.length - 1];
  const allSemesters = data.programs.flatMap((p) => p.semesters);
  const latest = allSemesters[allSemesters.length - 1];
  const totalBacklogs = allSemesters.reduce((n, s) => n + (s.backlogs || 0), 0);

  document.querySelector("[data-academics-overview]").innerHTML = `
    <div class="overview-cell"><dt>PROGRAM</dt><dd style="font-size:var(--text-md)">${esc(program.program)}</dd></div>
    <div class="overview-cell"><dt>SEMESTERS COMPLETED</dt><dd>${allSemesters.length}</dd></div>
    <div class="overview-cell"><dt>LATEST SPI</dt><dd>${latest.spi.toFixed(2)}</dd></div>
    <div class="overview-cell"><dt>CURRENT CPI</dt><dd>${latest.cpi.toFixed(2)}</dd></div>
    <div class="overview-cell"><dt>BACKLOGS</dt><dd>${totalBacklogs}</dd></div>
  `;

  drawGraph(allSemesters);
  if (!window.__mzGraphResizeBound) {
    window.__mzGraphResizeBound = true;
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.__mzLastSemesters) drawGraph(window.__mzLastSemesters);
      }, 200);
    });
  }

  document.querySelector("[data-academics-semesters]").innerHTML = allSemesters
    .map(
      (s) => `
      <div class="semester-card reveal">
        <div class="semester-card__id mono">SEM_${String(s.semester).padStart(2, "0")}</div>
        <div class="semester-card__spi">${s.spi.toFixed(2)} <span class="text-secondary" style="font-size:var(--text-xs)">SPI</span></div>
        <div class="semester-card__meta">CPI ${s.cpi.toFixed(2)} · ${s.backlogs || 0} backlog${s.backlogs === 1 ? "" : "s"}</div>
      </div>`
    )
    .join("");
}

function drawGraph(semesters) {
  window.__mzLastSemesters = semesters;
  const wrap = document.querySelector("[data-academics-graph]");
  if (!wrap) return;
  let renderWidth = 680;
  const cs = getComputedStyle(wrap);
  const contentWidth = wrap.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
  if (contentWidth > 40) renderWidth = Math.round(contentWidth);
  wrap.innerHTML = buildGraph(semesters, renderWidth);
}

function buildGraph(semesters, renderWidth) {
  // The viewBox matches the actual rendered width so SVG text/strokes (specified
  // in user units) come out at their real CSS pixel size at every breakpoint,
  // instead of shrinking to ~4px on phones or ballooning on desktop.
  const w = renderWidth || 680;
  const h = Math.round(w * (220 / 680));
  const pad = Math.max(26, Math.min(40, Math.round(w * 0.06)));
  const values = semesters.map((s) => s.spi);
  const min = Math.floor(Math.min(...values) - 0.5);
  const max = Math.ceil(Math.max(...values) + 0.5);
  const x = (i) => pad + (i * (w - pad * 2)) / Math.max(semesters.length - 1, 1);
  const y = (v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);

  const points = semesters.map((s, i) => `${x(i)},${y(s.spi)}`).join(" ");
  const gridLines = [0, 0.25, 0.5, 0.75, 1]
    .map((t) => {
      const gy = pad + t * (h - pad * 2);
      return `<line class="graph-grid" x1="${pad}" y1="${gy}" x2="${w - pad}" y2="${gy}" />`;
    })
    .join("");
  const labels = semesters
    .map((s, i) => `<text class="graph-label" x="${x(i)}" y="${h - 8}" text-anchor="middle">S${s.semester}</text>`)
    .join("");
  const dots = semesters
    .map((s, i) => `<circle class="graph-point" cx="${x(i)}" cy="${y(s.spi)}" r="3.5"><title>Semester ${s.semester}: SPI ${s.spi}</title></circle>`)
    .join("");

  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="SPI trend across semesters">
    ${gridLines}
    <polyline class="graph-line" points="${points}" />
    ${dots}
    ${labels}
  </svg>`;
}

/* ---------------------------- Documents ---------------------------- */

export function renderDocuments(list) {
  const el = document.querySelector("[data-documents-grid]");
  el.innerHTML = list
    .map((d) => {
      const pendingText = d.type === "resume" ? "Resume will be published here once it's finalized." : "File not yet available.";
      return `
      <div class="doc-card reveal">
        <div class="doc-card__top">
          <div>
            <div class="meta-tag">${esc(d.category.toUpperCase())}</div>
            <div class="doc-card__title">${esc(d.title)}${d.current ? ' <span class="badge badge--accent">Current</span>' : ""}</div>
          </div>
        </div>
        <p class="doc-card__desc">${esc(d.description)}</p>
        ${
          d.file
            ? `<div class="doc-card__foot">
                <span>${esc(d.fileType)}${d.version ? " · " + esc(d.version) : ""}</span>
                <span>${monthFmt(d.dateUpdated)}</span>
              </div>
              <div class="doc-card__actions">
                <a class="btn btn-secondary btn-sm" href="${d.file}" target="_blank" rel="noopener">${icon("external")} Preview</a>
                ${d.downloadable ? `<a class="btn btn-primary btn-sm" href="${d.file}" download>${icon("download")} Download</a>` : ""}
              </div>`
            : `<div class="doc-card__foot"><span class="mono" style="color:var(--text-tertiary)">${pendingText}</span></div>`
        }
      </div>`;
    })
    .join("");
}

/* ---------------------------- Notes ---------------------------- */

export function renderNotes(notes, site) {
  const content = document.querySelector("[data-notes-content]");
  const hasArticles = notes.articles && notes.articles.length > 0;
  const hasHandwritten = notes.handwrittenNotes && notes.handwrittenNotes.length > 0;

  if (!hasArticles && !hasHandwritten) {
    const topics = (notes.plannedTopics || []).join(", ");
    content.innerHTML = `
      <div class="empty-state reveal">
        <div class="empty-state__kicker mono">DOCUMENTING WHAT I LEARN /</div>
        <p class="empty-state__text">Technical notes, visual explanations and programming write-ups are being prepared and will be published here as they become ready.${
          topics ? ` Planned topics include ${esc(topics)}.` : ""
        }</p>
      </div>`;
  } else {
    const articlesHTML = hasArticles
      ? `<div class="meta-tag" style="margin-bottom:var(--space-4)">ARTICLES /</div>
         <div class="card-grid" style="margin-bottom:var(--space-10)">${notes.articles
           .map(
             (a) => `
            <article class="card reveal">
              <div class="card__top"><span class="card__id mono">${esc(a.category)}</span><span class="meta-tag">${a.readingTimeMinutes} min read</span></div>
              <h3 class="card__title">${esc(a.title)}</h3>
              <p class="card__summary">${esc(a.description)}</p>
              <div class="card__actions"><span class="text-secondary" style="font-size:var(--text-xs)">${monthFmt(a.date)}</span></div>
            </article>`
           )
           .join("")}</div>`
      : "";

    const notesHTML = hasHandwritten
      ? `<div class="meta-tag" style="margin-bottom:var(--space-4)">HANDWRITTEN NOTES /</div>
         <div class="card-grid">${notes.handwrittenNotes
           .map(
             (n) => `
            <div class="note-card reveal">
              <div class="note-card__preview"><span>${n.pageCount} pages</span></div>
              <div class="note-card__body">
                <div class="meta-tag">${esc(n.subject.toUpperCase())}</div>
                <h3 class="card__title" style="margin-top:var(--space-2)">${esc(n.title)}</h3>
                <p class="card__summary">${esc(n.description)}</p>
              </div>
            </div>`
           )
           .join("")}</div>`
      : "";

    content.innerHTML = articlesHTML + notesHTML;
  }

  const cta = document.querySelector("[data-channel-cta]");
  cta.querySelector("[data-channel-link]").href = site.social.codingChannel;
}

/* ---------------------------- Contact ---------------------------- */

export function renderContact(site, resume) {
  document.querySelector("[data-contact-status]").textContent = site.hero.status;
  const locationEl = document.querySelector("[data-contact-location]");
  if (locationEl) locationEl.textContent = site.owner.location || "";
  const grid = document.querySelector("[data-contact-grid]");
  grid.innerHTML = [
    { icon: "mail", label: "EMAIL", value: site.social.email, href: `mailto:${site.social.email}` },
    { icon: "github", label: "GITHUB", value: site.social.github.replace("https://", ""), href: site.social.github },
    { icon: "linkedin", label: "LINKEDIN", value: site.social.linkedin.replace("https://", ""), href: site.social.linkedin },
    { icon: "whatsapp", label: "CODING CHANNEL", value: "Join on WhatsApp", href: site.social.codingChannel },
  ]
    .map(
      (c) => `
      <a class="contact-item" href="${c.href}" target="${c.href.startsWith("mailto") ? "_self" : "_blank"}" rel="noopener">
        ${icon(c.icon)}
        <span><span class="contact-item__label mono">${c.label}</span><span class="contact-item__value">${esc(c.value)}</span></span>
      </a>`
    )
    .join("");

  wireResumeButtons(resume);
}

export function wireResumeButtons(resume) {
  document.querySelectorAll("[data-resume-link]").forEach((btn) => {
    if (resume && resume.file) {
      btn.href = resume.file;
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.hidden = false;
      btn.style.display = "";
    } else {
      // No verified resume yet — remove the CTA rather than link to a placeholder or fallback.
      btn.hidden = true;
      btn.style.display = "none";
    }
  });
}

/* ---------------------------- Footer ---------------------------- */

export function renderFooter(site) {
  const year = document.querySelector("[data-footer-year]");
  if (year) year.textContent = new Date().getFullYear();
  const title = document.querySelector("[data-footer-title]");
  if (title) title.textContent = site.owner.title;
}
