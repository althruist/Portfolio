import gsap from "gsap";

import { Howl } from "howler";

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

let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function scrollTo(target) {
  if (lenis) {
    lenis.scrollTo(target, {
      offset: -140,
      duration: 0.3,
      easing: (t) => Math.sin((t * Math.PI) / 2),
    });
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 140,
        behavior: "smooth",
      });
    }
  }
}

export function mouseMove(event) {
  const item = event.currentTarget;
  const rect = item.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  item.style.setProperty("--x", `${x}px`);
  item.style.setProperty("--y", `${y}px`);
}

export function addNoise(node) {
  let visible = false,
    call;
  const tick = () => {
    if (!visible) return;
    gsap.set(node, {
      backgroundPosition: `${Math.random() * 500}px ${Math.random() * 500}px`,
    });
    call = gsap.delayedCall(0.07, tick);
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) tick();
    else call?.kill();
  });
  io.observe(node);
  return {
    destroy() {
      io.disconnect();
      call?.kill();
    },
  };
}

export function disableContextMenu(event) {
  event.preventDefault();
}
