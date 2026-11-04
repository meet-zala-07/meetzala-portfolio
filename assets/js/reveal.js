/* ==========================================================================
   SCROLL REVEAL
   Applies .is-visible to .reveal elements as they enter the viewport.
   Call after dynamic content has been rendered into the DOM.
   ========================================================================== */

export function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.is-visible)");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}
