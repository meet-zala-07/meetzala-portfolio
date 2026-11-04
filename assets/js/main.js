import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import {
  getSite, getEducation, getExperience, getSkills, getProjects,
  getCertifications, getAchievements, getAcademics, getDocuments,
  getNotes, getCurrentResume,
} from "./data.js";
import {
  computeHeroStats, renderHero, renderAbout, renderEducation, renderExperience,
  renderSkills, renderProjects, renderCertifications, renderAchievements,
  renderAcademics, renderDocuments, renderNotes, renderContact,
  renderFooter, wireResumeButtons,
} from "./render.js";

async function boot() {
  initTheme();
  initNav();

  try {
    const [site, education, experience, skills, projects, certifications, achievements, academics, documents, notes, resume] =
      await Promise.all([
        getSite(), getEducation(), getExperience(), getSkills(), getProjects(),
        getCertifications(), getAchievements(), getAcademics(), getDocuments(),
        getNotes(), getCurrentResume(),
      ]);

    renderHero(site, computeHeroStats({ projects, certifications, achievements, academics }));
    renderAbout(site);
    renderEducation(education);
    renderExperience(experience);
    renderSkills(skills);
    renderProjects(projects);
    renderCertifications(certifications);
    renderAchievements(achievements);
    renderAcademics(academics);
    renderDocuments(documents);
    renderNotes(notes, site);
    renderContact(site, resume);
    renderFooter(site);
    wireResumeButtons(resume);

    document.body.classList.add("is-loaded");
    initReveal();
  } catch (err) {
    console.error("Failed to load site data:", err);
    document.body.classList.add("is-loaded");
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `<div class="container" style="padding-block:var(--space-section)">
        <p class="mono text-secondary">Content failed to load. If you're viewing this file directly from disk, run a local server (see README) — browsers block JSON loading over file://.</p>
      </div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", boot);
