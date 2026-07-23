<script>
  import { onMount } from "svelte";
  import gsap from "gsap";
  import {
    getCSSVariable,
    scrollTo,
    playSound,
  } from "$lib/logic/globalFunctions.js";
  import Socials from "./Socials.svelte";

  let header;
  let logoHeader;

  let mobileButtons;
  let socials;

  let home;
  let portfolio;
  let labs;
  let about;

  let homeMobile;
  let portfolioMobile;
  let labsMobile;
  let aboutMobile;

  let dropDownIsOpen = false;

  function updateThemeColors() {
    const headerButtons = [home, portfolio, labs, about];

    headerButtons.forEach((button) => {
      const text = button.querySelector("span");
      gsap.killTweensOf(text);
      gsap.set(text, { color: getCSSVariable("--color-primary") });
    });
  }

  onMount(() => {
    updateThemeColors();

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
          updateThemeColors();
        });
    }

    function openDropdown() {
      dropDownIsOpen = true;

      let timelineOpen = gsap.timeline();
      let timelineOpen2 = gsap.timeline();

      gsap.set(socials, { opacity: 0 });

      timelineOpen2
        .to(logoHeader, {
          y: "25",
          duration: 0.2,
          ease: "sine.inOut",
          onComplete: () => {
            mobileButtons.style.display = "grid";
          },
        })
        .to(logoHeader, {
          y: "0",
          duration: 0.5,
          ease: "sine.out",
        })
        .to(socials, {
          opacity: 1,
        });

      timelineOpen
        .to(header, {
          y: "20",
          duration: 0.1,
          ease: "sine.out",
          delay: 0.1,
        })
        .to(header, {
          marginTop: "0",
          borderRadius: 0,
          paddingLeft: 0,
          width: "100%",
          y: "0",
          height: "100%",
          duration: 0.5,
          ease: "circ.out",
          top: "auto",
        });
      let multiplier = 0;
      headerButtonsMobile.forEach((button) => {
        gsap.set(button, { opacity: 0, height: "0%" });
        multiplier++;
        gsap.to(button, {
          height: "100%",
          opacity: 1,
          duration: 0.5,
          delay: 0.1 * multiplier,
          onComplete: () => {
            socials.style.display = "flex";
          },
        });
      });
    }

    const animateCard = () => {
      const x = Math.random() * 500;
      const y = Math.random() * 500;
      const duration = 0.02;

      gsap.to(header, {
        backgroundPosition: `${x}px ${y}px`,
        duration,
        ease: "linear",
        onComplete: animateCard,
      });
    };

    animateCard();

    function closeDropdown() {
      dropDownIsOpen = false;

      let timelineClose = gsap.timeline();
      let timelineClose2 = gsap.timeline();

      let multiplier = 0;
      let buttonsAnimated = 0;

      headerButtonsMobile.forEach((button) => {
        multiplier++;
        gsap.to(socials, {
          opacity: 0,
          duration: 0.3,
        });
        gsap.to(button, {
          height: "0%",
          opacity: 0,
          duration: 0.2,
          delay: 0.1 * multiplier,
          onComplete: () => {
            buttonsAnimated++;

            if (buttonsAnimated === headerButtonsMobile.length) {
              mobileButtons.style.display = "none";
              socials.style.display = "none";

              timelineClose
                .to(header, {
                  width: "80px",
                  borderRadius: "50px",
                  height: "80px",
                  duration: 0.2,
                  ease: "circ.out",
                  top: "80%",
                })
                .to(header, {
                  paddingLeft: "10px",
                  y: "-20",
                  duration: 0.2,
                  ease: "circ.out",
                })
                .to(header, {
                  marginTop: "5%",
                  y: "0",
                  duration: 0.3,
                  ease: "sine.out",
                });

              timelineClose2
                .to(logoHeader, {
                  y: "-20",
                  duration: 0.3,
                  ease: "sine.out",
                  delay: 0.2,
                })
                .to(logoHeader, {
                  y: "0",
                  duration: 0.3,
                  ease: "sine.out",
                });
            }
          },
        });
      });
    }

    function toggleDropdown() {
      dropDownIsOpen ? closeDropdown() : openDropdown();
    }

    const headerButtons = [home, portfolio, labs, about];
    const headerButtonsMobile = [
      homeMobile,
      portfolioMobile,
      labsMobile,
      aboutMobile,
    ];

    headerButtons.forEach((button) => {
      const overlay = button.querySelector(".headerButtonOverlay");
      const text = button.querySelector("span");

      let isHovering = false;

      gsap.set(overlay, { yPercent: 100 });

      button.addEventListener("mouseenter", () => {
        isHovering = true;
        playSound("hover");
        gsap.fromTo(
          overlay,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          },
        );

        gsap.to(text, {
          color: getCSSVariable("--color-background"),
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(button, {
          scale: 0.9,
          duration: 0.2,
        });
      });

      button.addEventListener("mousedown", () => {
        playSound("openLink");
        isHovering = false;
        gsap.to(button, {
          scale: 0.8,
          duration: 0.1,
        });
        gsap.to(overlay, {
          backgroundColor: getCSSVariable("--color-secondary"),

          duration: 0.1,
        });
      });

      button.addEventListener("click", () => {
        let tl = gsap.timeline();

        gsap.to(overlay, {
          backgroundColor: getCSSVariable("--color-primary"),

          duration: 0.4,
        });

        tl.to(button, {
          scale: 0.7,
          duration: 0.1,
          ease: "circ.out",
        });
        tl.to(button, {
          scale: 1.1,
          duration: 0.2,
          ease: "circ.Out",
        });
        if (!isHovering) {
          tl.to(button, {
            scale: 1,
            duration: 0.1,
          });
        } else if (isHovering) {
          tl.to(button, {
            scale: 0.8,
            boxShadow: "0 0 0 0px",
            duration: 0.1,
          });
        }
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
        });

        gsap.fromTo(
          overlay,
          { yPercent: 0 },
          {
            yPercent: -100,
            duration: 0.4,
            ease: "power2.in",
            overwrite: "auto",
          },
        );

        gsap.to(text, {
          color: getCSSVariable("--color-primary"),
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    headerButtonsMobile.forEach((button) => {
      const overlay = button.querySelector(".headerButtonOverlay");
      const text = button.querySelector("span");

      let isHovering = false;

      gsap.set(overlay, { yPercent: 100, opacity: 0 });

      button.addEventListener("click", () => {
        if (dropDownIsOpen) {
          closeDropdown();
        }
      });

      button.addEventListener("mouseenter", () => {
        playSound("hover");
        isHovering = true;
        gsap.fromTo(
          overlay,
          { yPercent: 100 },
          {
            yPercent: 0,
            borderRadius: "10px",
            duration: 0.4,
            opacity: 1,
            ease: "power2.out",
            overwrite: "auto",
          },
        );

        gsap.to(text, {
          color: getCSSVariable("--color-background"),
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(button, {
          scale: 0.9,
          duration: 0.2,
        });
      });

      button.addEventListener("mousedown", () => {
        playSound("openLink");
        isHovering = false;
        gsap.to(button, {
          scale: 0.8,
          duration: 0.1,
        });
      });

      button.addEventListener("click", () => {
        let tl = gsap.timeline();

        tl.to(button, {
          scale: 0.7,
          duration: 0.1,
          ease: "circ.out",
        });
        tl.to(button, {
          scale: 1.1,
          duration: 0.2,
          ease: "circ.Out",
        });
        if (!isHovering) {
          tl.to(button, {
            scale: 0.9,
            duration: 0.3,
          });
        } else if (isHovering) {
          tl.to(button, {
            scale: 0.8,
            boxShadow: "0 0 0 0px",
            duration: 0.1,
          });
        }
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
        });

        gsap.fromTo(
          overlay,
          { yPercent: 0 },
          {
            yPercent: -100,
            duration: 0.4,
            opacity: 0,
            ease: "power2.in",
            overwrite: "auto",
          },
        );

        gsap.to(text, {
          color: getCSSVariable("--color-primary"),
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    function handleResize(e) {
      if (!logoHeader) return;

      const logoBox = logoHeader.getBoundingClientRect();

      if (e.matches) {
        gsap.set(header, {
          marginTop: "5%",
          padding: "10px",
          width: logoBox.width,
          borderRadius: "50px",
          top: "80%",
        });
        mobileButtons.style.display = dropDownIsOpen ? "grid" : "none";
        socials.style.display = dropDownIsOpen ? "flex" : "none";
      } else {
        dropDownIsOpen = false;

        gsap.set(header, {
          marginTop: "10px",
          borderRadius: "20px",
          width: "85%",
          height: "auto",
          top: "auto",
          y: 0,
        });

        mobileButtons.style.display = "none";
        socials.style.display = "flex";
        gsap.set(socials, { opacity: 1 });
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    mediaQuery.addEventListener("change", handleResize);
    handleResize(mediaQuery);

    logoHeader.addEventListener("click", () => {
      playSound("openLink");
      gsap.fromTo(
        logoHeader,
        { scale: 1 },
        {
          scale: 0.7,
          duration: 0.1,
          ease: "sine.out",
          repeat: 1,
          yoyo: true,
        },
      );

      if (window.innerWidth <= 1024) {
        toggleDropdown();
        return;
      }
    });

    let hoverAnim;
    logoHeader.addEventListener("mouseenter", () => {
      playSound("hover");
      hoverAnim = gsap.to(logoHeader.querySelector(".logo"), {
        x: gsap.utils.random(50, -50),
        y: gsap.utils.random(50, -50),
        yoyo: true,
        repeat: -1,
        duration: 0.3,
        ease: "sine.inOut",
      });
    });

    logoHeader.addEventListener("mouseleave", () => {
      hoverAnim.kill();
      hoverAnim = null;

      gsap.to(logoHeader.querySelector(".logo"), {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "circ.out",
      });
    });
  });
</script>

<header bind:this={header} id="header" class="card noBounce">
  <div id="left">
    <svg
      bind:this={logoHeader}
      id="logoHeader"
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
    >
      <path
        id="Color Fill 1"
        fill-rule="evenodd"
        class="logo interactable"
        d="m553.9 225.8c27.9 3.4 72.2 35.2 95 48.7 84 50.1 173.4 96.9 236.2 168.2-2.6 46.3-58.8 78.4-93.7 93.7-15.5 6.9-38 14.2-47.5 27-9.6 13-13.7 29.4-26.9 38.5q-11.6 5.8-23.1 11.6c-16.8 20.5-35.7 45.4-57.8 60.3-14.8 10-28.6 24.5-43.7 32.1q-9 2.6-17.9 5.1c-19.9 17.7-36.2 59.2-68.1 62.9-40.5 4.8-58.9-43.3-80.9-62.9q-8.9-2.5-17.9-5.1c-15.1-7.6-28.9-22.1-43.7-32.1-22-14.9-41-39.8-57.8-60.3q-11.5-5.8-23.1-11.6c-13.2-9.1-17.3-25.5-26.9-38.5-9.5-12.8-32-20.1-47.5-27-35-15.4-88.7-46.8-93.7-91.1 73.6-87.1 207-159.8 314.5-213.1q9 25 18 50.1c8.3 12.3 22.7 18.4 28.2 34.6 6 17.9 9.9 48.3 14.1 64.2q2 24.4 3.9 48.8 0.6-1.3 1.3-2.6c7.6-10.9 18.8-35.9 14.1-56.5-1.4-6.3-8.4-14.3-5.1-25.6q15.4-23.8 30.8-47.5c-7.4-43.8 5.7-40.6 19.2-71.9z"
      />
    </svg>
    <nav class="buttons">
      <a
        bind:this={home}
        aria-label="Home"
        class="headerButton interactable noSelect"
        href="/"
        ><span>home</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        bind:this={portfolio}
        aria-label="portfolio"
        href="/"
        class="headerButton interactable noSelect"
        on:click={() => {
          scrollTo("#projectsSection");
        }}
        ><span>portfolio</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        bind:this={labs}
        aria-label="labs"
        href="/labs"
        class="headerButton interactable noSelect"
        ><span>labs</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        bind:this={about}
        aria-label="about"
        href="/"
        on:click={() => {
          scrollTo("#aboutSection");
        }}
        class="headerButton interactable noSelect"
        ><span>about</span>
        <div class="headerButtonOverlay"></div>
      </a>
    </nav>
  </div>
  <div class="buttons_mobile" bind:this={mobileButtons}>
    <a
      bind:this={homeMobile}
      aria-label="Home"
      class="headerButton interactable noSelect"
      href="/"
      ><span>home</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      bind:this={portfolioMobile}
      aria-label="portfolio"
      href="/"
      class="headerButton interactable noSelect"
      on:click={() => {
        scrollTo("#projectsSection");
      }}
      ><span>portfolio</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      bind:this={labsMobile}
      aria-label="labs"
      href="/labs"
      class="headerButton interactable noSelect"
      ><span>labs</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      bind:this={aboutMobile}
      aria-label="about"
      href="/"
      on:click={() => {
        scrollTo("#aboutSection");
      }}
      class="headerButton interactable noSelect"
      ><span>about</span>
      <div class="headerButtonOverlay"></div>
    </a>
  </div>
  <Socials bind:container={socials}></Socials>
</header>

<style>
  .logo {
    fill: var(--color-primary);
    cursor: pointer;
  }

  .card {
    aspect-ratio: unset;
  }

  #logoHeader {
    width: 80px;
  }
</style>
