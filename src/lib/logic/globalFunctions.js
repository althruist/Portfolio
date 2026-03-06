let gsap;
let ScrollToPlugin;

export async function initGSAP() {
  if (typeof window === "undefined") return;

  const gsapModule = await import("gsap");
  const scrollModule = await import("gsap/ScrollToPlugin");

  gsap = gsapModule.gsap;
  ScrollToPlugin = scrollModule.ScrollToPlugin;

  gsap.registerPlugin(ScrollToPlugin);
}

export function isMobile() {
  return window.innerWidth <= 1024;
}

export function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

export function scrollTo(place) {
  if (!gsap) return;
  gsap.to(window, { duration: 0.3, scrollTo: place, ease: "sine.out" });
}