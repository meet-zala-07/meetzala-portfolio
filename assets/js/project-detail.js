import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { getProjects } from "./data.js";
import { icon } from "./render.js";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function boot() {
  initTheme();
  initNav();

  const root = document.querySelector("[data-project-root]");
  const slug = new URLSearchParams(location.search).get("slug");

  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
      root.innerHTML = notFoundTemplate();
    } else {
      document.title = `${project.title} · Meet Zala`;
      root.innerHTML = detailTemplate(project);
    }
  } catch (err) {
    console.error("Failed to load project data:", err);
    root.innerHTML = `<div class="container" style="padding-block:var(--space-section)">
      <p class="mono text-secondary">Content failed to load. If you're viewing this file directly from disk, run a local server (see README) — browsers block JSON loading over file://.</p>
    </div>`;
  }

  document.body.classList.add("is-loaded");
  initReveal();
}

function notFoundTemplate() {
  return `
    <div class="container not-found">
      <a class="back-link" href="index.html#projects">${icon("arrow-left")} Back to Projects</a>
      <div class="section-head__meta"><b>404</b> / PROJECT_NOT_FOUND</div>
      <h1 class="detail-header__title" style="margin-top:var(--space-4)">This project doesn't exist, or hasn't been published yet.</h1>
      <p class="detail-header__summary">Check the link, or browse everything that's currently documented.</p>
      <a class="btn btn-primary" style="margin-top:var(--space-6)" href="index.html#projects">${icon("arrow-right")} View all projects</a>
    </div>`;
}

function block(title, bodyHTML) {
  if (!bodyHTML) return "";
  return `<div class="detail-block"><div class="detail-block__title mono">${title}</div>${bodyHTML}</div>`;
}

function detailTemplate(p) {
  const screenshotsHTML =
    p.screenshots && p.screenshots.length
      ? `<div class="detail-gallery">${p.screenshots.map((s) => `<img src="${s}" alt="Screenshot of ${esc(p.title)}" loading="lazy" style="border:1px solid var(--border);border-radius:var(--radius-md)">`).join("")}</div>`
      : `<div class="detail-gallery__empty mono">SCREENSHOTS_PENDING</div>`;

  const blocks = [
    block("OVERVIEW", p.description ? `<p>${esc(p.description)}</p>` : ""),
    block("PROBLEM", p.problem ? `<p>${esc(p.problem)}</p>` : ""),
    block("SOLUTION", p.solution ? `<p>${esc(p.solution)}</p>` : ""),
    block("KEY FEATURES", p.features && p.features.length ? `<ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""),
    block("SCREENSHOTS", screenshotsHTML),
    block("CHALLENGES", p.challenges ? `<p>${esc(p.challenges)}</p>` : ""),
    block("WHAT I LEARNED", p.learnings ? `<p>${esc(p.learnings)}</p>` : ""),
    block("FUTURE IMPROVEMENTS", p.future ? `<p>${esc(p.future)}</p>` : ""),
  ].join("");

  const sidebarRows = [
    p.status ? `<dl><dt>STATUS</dt><dd>${esc(p.status)}</dd></dl>` : "",
    p.date ? `<dl><dt>DATE</dt><dd>${esc(p.date)}</dd></dl>` : "",
    p.technologies && p.technologies.length ? `<dl><dt>STACK</dt><dd>${p.technologies.map(esc).join(" · ")}</dd></dl>` : "",
  ].join("");

  return `
    <div class="container detail-header">
      <a class="back-link" href="index.html#projects">${icon("arrow-left")} Back to Projects</a>
      <div class="detail-header__badges">
        ${p.status ? `<span class="badge ${p.status === "Completed" ? "badge--success" : "badge--accent"}">${esc(p.status)}</span>` : ""}
        ${p.date ? `<span class="badge mono">${esc(p.date)}</span>` : ""}
      </div>
      <h1 class="detail-header__title">${esc(p.title)}</h1>
      <p class="detail-header__summary">${esc(p.summary)}</p>
      <div class="detail-header__actions">
        ${p.github ? `<a class="btn btn-primary" href="${p.github}" target="_blank" rel="noopener">${icon("github")} View Code</a>` : ""}
        ${p.demo ? `<a class="btn btn-secondary" href="${p.demo}" target="_blank" rel="noopener">${icon("external")} Live Demo</a>` : ""}
      </div>
    </div>

    <div class="container">
      <div class="detail-layout">
        <div>${blocks}</div>

        <aside class="detail-sidebar">
          ${sidebarRows}
          ${p.github ? `<a class="btn btn-secondary btn-sm" href="${p.github}" target="_blank" rel="noopener">${icon("github")} Repository</a>` : ""}
          ${p.demo ? `<a class="btn btn-secondary btn-sm" href="${p.demo}" target="_blank" rel="noopener">${icon("external")} Live Demo</a>` : ""}
        </aside>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", boot);
