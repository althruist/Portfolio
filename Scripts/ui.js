const background = document.getElementById("background");
const body = document.body;
const content = document.getElementById("content");
const header = document.getElementById("header");
const logo = document.getElementById("logoHeader");
const welcomeHeader = document.getElementById("welcomeHeader");
const currentProject = document.getElementById("currentProject");
const transition = document.getElementById("transition");
const logoTransition = document.getElementById("logoTransition");
const buttons = document.querySelectorAll(".headerButton");
const socialSVGs = document.querySelectorAll(".socialSVG");

window.onload = () => {
  transition.style.display = "flex";

  gsap.to(transition, {
    opacity: '0',
    duration: 0.5,
    ease: 'sine.out',
    onComplete: () => { transition.style.display = "none" }
  })

  gsap.to(logoTransition, {
    opacity: '0',
    duration: 0.2,
    scale: 1.5,
    ease: 'sine.out',
  })
}

socialSVGs.forEach(svg => {

  svg.parentElement.addEventListener("mouseenter", () => {
    gsap.to(
      svg.querySelector('.icon'),
      {
        fill: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-basic")
          .trim(),
        duration: 0.2
      }
    )
  })

  svg.parentElement.addEventListener("mouseleave", () => {
    gsap.to(
      svg.querySelector('.icon'),
      {
        fill: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-secondary")
          .trim(),
        duration: 0.2
      }
    )
  })
})

buttons.forEach(button => {
  const overlay = button.querySelector(".headerButtonOverlay");
  const text = button.querySelector("span");

  // Overlay starts hidden below
  gsap.set(overlay, { yPercent: 100 });

  button.addEventListener("mouseenter", () => {
    gsap.fromTo(
      overlay,
      { yPercent: 100 },   // start at bottom
      { yPercent: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" } // cover
    );

    gsap.to(text, {
      color: getComputedStyle(document.documentElement)
        .getPropertyValue("--title-text")
        .trim(),
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });

    gsap.to(button, {
      scale: 0.9,
      duration: 0.2
    })
  });

  button.addEventListener("mousedown", () => {
    gsap.to(button, {
      scale: 0.8,
      duration: 0.1,
    })
  })

  button.addEventListener("mouseup", () => {
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1
    })
  })

  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.2
    })

    gsap.fromTo(
      overlay,
      { yPercent: 0 },     // assume it's in middle (covered)
      { yPercent: -100, duration: 0.4, ease: "power2.in", overwrite: "auto" } // exit top
    );

    gsap.to(text, {
      color: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-basic")
        .trim(),
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto"
    });
  });
});

logo.addEventListener("click", () => {
  transition.style.display = "flex";

  gsap.to(transition, {
    opacity: '1',
    duration: 0.3,
    ease: 'sine.out',
    onComplete: () => { location.reload() }
  })

  gsap.to(logoTransition, {
    opacity: '1',
    duration: 0.2,
    scale: 1,
    ease: 'sine.out',
  })
})

logo.addEventListener("mouseenter", () => {
  gsap.to(logo.querySelector(".logo"), {
    fill: getComputedStyle(document.documentElement)
      .getPropertyValue("--color-secondary")
      .trim(),
    duration: 0.5,
    ease: "circ.out",
  });
});

logo.addEventListener("mouseleave", () => {
  gsap.to(logo.querySelector(".logo"), {
    fill: getComputedStyle(document.documentElement)
      .getPropertyValue("--title-text")
      .trim(),
    duration: 0.5,
    ease: "circ.out",
  });
});

let xPos = 0,
  yPos = 0,
  isAnimating = false;

document.addEventListener("mousemove", (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  xPos = (e.clientX / w - 0.5) * 100;
  yPos = (e.clientY / h - 0.5) * 100;

  if (!isAnimating) {
    isAnimating = true;
    requestAnimationFrame(() => {
      gsap.to(background, {
        backgroundPosition: `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`,
        duration: 0.5,
        ease: "circ.out",
      });
      isAnimating = false;
    });
  }
});

function handleResize(e) {
  const logoBox = logo.getBoundingClientRect();
  gsap.to(header, {
    width: e.matches ? logoBox.width : "80%",
    duration: 0.5,
    ease: "circ.out",
  });
}

const mediaQuery = window.matchMedia("(max-width: 1023px)");
mediaQuery.addEventListener("change", handleResize);
handleResize(mediaQuery);

gsap.utils.toArray(".card").forEach((card) => {
  if (card.classList.contains("noBounce")) return;

  card.addEventListener("mouseenter", () => {
    card.style.zIndex = 2;
    gsap.to(card, { scale: 1.1, duration: 0.5, ease: "circ.out" });
  });

  card.addEventListener("mouseleave", () => {
    card.style.zIndex = 1;
    gsap.to(card, { scale: 1, duration: 0.5, ease: "circ.out" });
  });

  card.addEventListener("click", () => {
    let tlClick = gsap.timeline();
    tlClick.to(card, {
      rotation: gsap.utils.random(-4, 4),
      scale: 1,
      duration: 0.1,
      ease: "sine.out",
    });
    tlClick.to(card, {
      rotation: 0,
      scale: 1.1,
      duration: 0.2,
      ease: "sine.out",
    });
  });

  if (card.classList.contains("instantShow")) return;
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top 70%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(
    card,
    { scale: 0.9, opacity: 0, y: 50 },
    { scale: 1.1, opacity: 1, y: 0, duration: 0.3 }
  ).to(card, { scale: 1, duration: 0.5 });
});

let isHovering = false;

welcomeHeader.addEventListener("mouseenter", () => {
  if (isHovering) return;
  isHovering = true;
  gsap.to(welcomeHeader.querySelector(".name"), {
    duration: 1,
    scrambleText: {
      text: "althruist",
      chars: "kailetrhaunist",
      revealDelay: 0,
      speed: 1,
    },
  });
});

welcomeHeader.addEventListener("mouseleave", () => {
  isHovering = false;
  gsap.to(welcomeHeader.querySelector(".name"), {
    duration: 1,
    scrambleText: {
      text: "Kieran",
      chars: "kailetrhaunist",
      revealDelay: 0,
      speed: 1,
    },
  });
});

const darkFavicon = "Images/SVG/Favicons/Light.ico";
const lightFavicon = "Images/SVG/Favicons/Dark.ico";

function setFavicon(src) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = src;
}

function updateFavicon() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setFavicon(isDark ? lightFavicon : darkFavicon);
}

updateFavicon();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateFavicon);