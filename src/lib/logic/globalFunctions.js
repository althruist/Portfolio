let gsap;
let ScrollToPlugin;

import { Howl } from "howler";

export async function initGSAP() {
  if (typeof window === "undefined") return;

  const gsapModule = await import("gsap");
  const scrollModule = await import("gsap/ScrollToPlugin");

  gsap = gsapModule.gsap;
  ScrollToPlugin = scrollModule.ScrollToPlugin;

  gsap.registerPlugin(ScrollToPlugin);
}
export function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

const sounds = {
  click: new Howl({ src: ["/sounds/click.mp3"], volume: 0.1 }),
  hover: new Howl({ src: ["/sounds/hover.mp3"], volume: 0.1 }),
  openLink: new Howl({ src: ["/sounds/openlink.mp3"], volume: 0.1 }),
  openCard: new Howl({ src: ["/sounds/opencard.mp3"], volume: 0.1 }),
  cardHover: new Howl({ src: ["/sounds/cardhover.mp3"], volume: 0.1 }),
  closeCard: new Howl({ src: ["/sounds/closecard.mp3"], volume: 0.1 }),
  cardClick: new Howl({ src: ["/sounds/cardclick.mp3"], volume: 0.1 }),
};

export function playSound(name, options = {}) {
  const sound = sounds[name];
  if (!sound) return;

  if (options.rate) sound.rate(options.rate);
  if (options.volume !== undefined) sound.volume(options.volume);

  sound.play();
}

export function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

export function scrollTo(place) {
  if (!gsap) return;
  gsap.to(window, {
    duration: 0.3,
    scrollTo: { y: place, offsetY: 140 },
    ease: "sine.out",
  });
}

export function mouseMove(event) {
  const item = event.currentTarget;
  const rect = item.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Pass coordinates into CSS variables
  item.style.setProperty("--x", `${x}px`);
  item.style.setProperty("--y", `${y}px`);
}
