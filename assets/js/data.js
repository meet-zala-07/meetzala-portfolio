/* ==========================================================================
   DATA LAYER
   All content lives in assets/data/*.json. This is the only place that
   talks to those files — components never fetch directly.
   ========================================================================== */

const cache = new Map();

async function loadJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const json = await res.json();
  cache.set(path, json);
  return json;
}

const DATA_DIR = "assets/data";

export const getSite = () => loadJSON(`${DATA_DIR}/site.json`);
export const getEducation = () => loadJSON(`${DATA_DIR}/education.json`);
export const getExperience = () => loadJSON(`${DATA_DIR}/experience.json`);
export const getSkills = () => loadJSON(`${DATA_DIR}/skills.json`);
export const getProjects = () => loadJSON(`${DATA_DIR}/projects.json`);
export const getCertifications = () => loadJSON(`${DATA_DIR}/certifications.json`);
export const getAchievements = () => loadJSON(`${DATA_DIR}/achievements.json`);
export const getAcademics = () => loadJSON(`${DATA_DIR}/academics.json`);
export const getDocuments = () => loadJSON(`${DATA_DIR}/documents.json`);
export const getNotes = () => loadJSON(`${DATA_DIR}/notes.json`);

export async function getCurrentResume() {
  const docs = await getDocuments();
  return docs.find((d) => d.type === "resume" && d.current) || null;
}
