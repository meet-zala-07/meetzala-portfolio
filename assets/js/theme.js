/* ==========================================================================
   THEME SWITCHER
   The no-flash boot (reading localStorage and setting data-theme before
   paint) lives in an inline <script> in <head> of each HTML page — it must
   run synchronously before CSS paints. This file only wires up the UI.
   ========================================================================== */

const THEME_KEY = "mz-theme"; // "system" | "light" | "dark"

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "system";
  } catch {
    return "system";
  }
}

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
  document
    .querySelectorAll("[data-theme-switch] button")
    .forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.theme === mode)));
}

function setTheme(mode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage unavailable — theme just won't persist */
  }
  applyTheme(mode);
}

export function initTheme() {
  const current = getStoredTheme();
  applyTheme(current);

  document.querySelectorAll("[data-theme-switch] button").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getStoredTheme() === "system") applyTheme("system");
    });
  }
}
