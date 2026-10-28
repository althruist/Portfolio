<script>
  import { onMount } from "svelte";
  import gsap from "gsap";
  import {
    getCSSVariable,
    scrollTo,
    playSound,
    addNoise,
  } from "$lib/logic/globalFunctions.js";
  import Socials from "./Socials.svelte";

  let buttons;
  let buttonsMobile;
  let header;
  let emblem;
  let logoHeader;
  let dropDownIsOpen = $state(false);
  let socials = $state();

  onMount(() => {
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
            buttonsMobile.style.display = "grid";
          },
        })
        .to(logoHeader, {
          y: "0",
          duration: 0.5,
          ease: "sine.out",
          onStart: () => {
            gsap.to(emblem, {
              backgroundColor: getCSSVariable("--color-card"),
              paddingTop: "20px",
              paddingBottom: "20px",
              duration: 0.1,
            });
          },
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
          paddingTop: 0,
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
              buttonsMobile.style.display = "none";
              socials.style.display = "none";

              timelineClose
                .to(header, {
                  width: "fit-content",
                  borderRadius: "50px",
                  height: logoHeader.getBoundingClientRect().height,
                  duration: 0.2,
                  ease: "circ.out",
                  top: "80%",
                  onStart: () => {
                    gsap.to(emblem, {
                      backgroundColor: "transparent",
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      duration: 0,
                    });
                  },
                })
                .to(header, {
                  paddingLeft: "10px",
                  paddingTop: "10px",
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

    const headerButtons = buttons.querySelectorAll(".headerButton");
    const headerButtonsMobile = buttonsMobile.querySelectorAll(".headerButton");

    headerButtons.forEach((button) => {
      const overlay = button.querySelector(".headerButtonOverlay");
      const text = button.querySelector("span");

      let isHovering = false;

      gsap.set(overlay, { yPercent: 100 });

      button.addEventListener("pointerenter", () => {
        isHovering = true;
        playSound("hover");
        gsap.fromTo(
          overlay,
          {
            yPercent: 100,
            backgroundColor: getCSSVariable("--color-title-text"),
          },
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

      button.addEventListener("pointerdown", () => {
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
          backgroundColor: getCSSVariable("--color-title-text"),

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

      button.addEventListener("pointerleave", () => {
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
          color: getCSSVariable("--color-title-text"),
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(text, { clearProps: "color" });
          },
        });
      });
    });

    headerButtonsMobile.forEach((button) => {
      const overlay = button.querySelector(".headerButtonOverlay");
      const text = button.querySelector("span");

      let isHovering = false;

      gsap.killTweensOf([text, overlay]);

      gsap.set(text, { clearProps: "color" });
      gsap.set(overlay, {
        yPercent: 100,
        opacity: 0,
        clearProps: "backgroundColor",
      });

      button.addEventListener("pointerdown", () => {
        playSound("openLink");
        isHovering = false;
        gsap.to(button, {
          scale: 0.8,
          duration: 0.05,
        });
        gsap.to(text, {
          color: getCSSVariable("--color-background"),
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.fromTo(
          overlay,
          { yPercent: 100, backgroundColor: getCSSVariable("--color-title-text") },
          {
            yPercent: 0,
            borderRadius: "10px",
            duration: 0.4,
            opacity: 1,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      });

      button.addEventListener("click", () => {
        let tl = gsap.timeline();

        if (dropDownIsOpen) {
          closeDropdown();
        }

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

      button.addEventListener("pointerleave", () => {
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
          color: getCSSVariable("--color-title-text"),
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(text, { clearProps: "color" });
          },
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
        buttonsMobile.style.display = dropDownIsOpen ? "grid" : "none";
        socials.style.display = dropDownIsOpen ? "flex" : "none";
      } else {
        dropDownIsOpen = false;

        gsap.set(header, {
          marginTop: "10px",
          borderRadius: getCSSVariable("--radius-card"),
          width: "85%",
          height: "auto",
          top: "auto",
          y: 0,
        });

        buttonsMobile.style.display = "none";
        socials.style.display = "flex";
        gsap.set(socials, { opacity: 1 });
      }
    }

    const mediaQuery = window.matchMedia("(max-width: 1064px)");
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

      if (window.innerWidth <= 1064) {
        toggleDropdown();
        return;
      }
    });
  });
</script>

<header bind:this={header} id="header" class="card noBounce" use:addNoise>
  <div id="left" bind:this={emblem}>
    <svg
      bind:this={logoHeader}
      id="logoHeader"
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1300 700"
    >
      <path
        id="Color Fill 1"
        fill-rule="evenodd"
        class="logo interactable"
        d="m471.72 202.73c1.53-1.53 4.13-3.43 5.78-4.23 1.65-0.8 5.59-1.46 8.75-1.48 3.47-0.01 7.18 0.67 9.37 1.73 1.99 0.96 4.78 3.32 6.2 5.25 2.22 3.01 2.71 5.05 3.48 14.5 0.49 6.05 0.62 28.89-0.3 90.5l28.5 0.58 7.86 3.96c5.49 2.77 9.56 5.76 13.52 9.96 3.12 3.3 7.57 9.15 9.89 13 2.33 3.85 5.8 11.84 7.73 17.75 1.92 5.91 3.95 14.69 4.49 19.5 0.55 4.81 0.99 24.5 0.98 43.75-0.01 19.25-0.44 41.52-0.96 49.5-0.53 7.98-1.86 19.45-2.96 25.5-1.1 6.05-2.68 13.36-3.52 16.25-0.85 2.91-2.98 6.84-4.78 8.81-1.79 1.96-5.05 4.26-7.25 5.1-2.45 0.94-6.18 1.4-9.63 1.19-3.84-0.24-6.36-0.99-7.9-2.35-1.25-1.1-3.56-4.02-5.14-6.5-1.85-2.92-2.85-5.82-2.84-8.25 0-2.06 1.22-11.74 2.7-21.5 2.6-17.2 2.69-19.15 2.81-107.75l-2.7-8c-1.48-4.4-4.07-9.91-5.75-12.25-1.68-2.34-4.51-5.16-6.3-6.28-2.41-1.51-4.16-1.87-6.75-1.4-1.92 0.35-5.64 1.71-8.25 3.03-2.61 1.32-5.17 3.19-5.67 4.15-0.51 0.96-1.44 16.82-2.06 35.25-0.63 18.43-1.53 40.48-2.01 49-0.47 8.52-0.93 23.6-1.01 33.5-0.08 9.9-0.47 21.82-0.88 26.5-0.57 6.7-1.25 9.21-3.17 11.83-1.35 1.82-4.48 4.65-6.95 6.27-3.65 2.39-5.54 2.93-10 2.89-3.03-0.04-6.44-0.61-7.58-1.28-1.15-0.66-3.2-2.11-4.57-3.21-1.36-1.1-3.35-3.33-4.41-4.95-1.77-2.7-1.97-5.28-2.29-30-0.2-15.66 0.32-40.52 1.22-59.05 0.86-17.6 1.81-41.9 2.11-54 0.31-12.1 1.01-28.98 1.57-37.5 0.55-8.52 1.42-37.77 1.92-65 0.72-38.75 1.25-50.8 2.44-55.5 0.97-3.79 2.55-7.02 4.31-8.77zm439.28 2.73c4.13-1.42 11.77-3.43 17-4.46 5.43-1.07 11.43-1.65 14-1.35 2.48 0.29 5.85 1.16 7.5 1.94 1.65 0.77 4.35 2.55 6 3.94 2.07 1.74 4.16 2.52 6.75 2.5 3.04-0.02 4.63 0.78 8.4 4.22 2.56 2.34 5.71 6.5 6.99 9.25 1.71 3.65 2.34 6.75 2.32 11.5-0.01 4.01-0.67 7.94-1.74 10.25-0.94 2.06-4.2 6.27-7.22 9.36-3.02 3.09-7.3 6.56-9.5 7.72-2.2 1.15-6.92 3.35-10.5 4.89-3.58 1.54-9.42 3.78-13 4.98-5.5 1.85-8.82 2.2-21.5 2.24-13.31 0.05-15.68-0.2-21-2.23-3.3-1.26-8.02-3.77-10.5-5.57-3.04-2.21-5.6-5.37-7.89-9.71-2.78-5.27-3.32-7.24-2.96-10.93 0.23-2.47 1.83-7.43 3.54-11 2.17-4.51 5.06-8.31 9.47-12.42 3.49-3.25 8.59-7.4 11.34-9.22 2.75-1.82 8.38-4.47 12.5-5.9zm32.5 17.64c-3.3 0.1-7.13 0.35-8.5 0.56-1.38 0.21-4.52 0.91-7 1.55-2.48 0.64-6.52 2.04-9 3.12-2.48 1.07-6.3 3.2-8.5 4.72-2.2 1.52-5.48 4.26-7.3 6.1-1.81 1.84-3.14 3.8-2.94 4.35 0.19 0.55 1.9 1.8 3.79 2.77 2.19 1.13 5.82 1.81 9.95 1.86 3.58 0.04 9.42-0.69 13-1.62 3.58-0.93 9.88-2.98 14-4.56 4.25-1.63 8.8-4.2 10.5-5.93 2.6-2.64 2.89-3.48 2.21-6.28-0.44-1.78-1.56-4.04-2.5-5.02-1.31-1.37-3.1-1.75-7.71-1.62zm-672.4-10.56c2.06-2.73 4.8-5.55 6.08-6.27 1.51-0.85 5.16-1.21 10.52-1.04 8.09 0.27 8.26 0.33 12.29 4.27 2.44 2.39 4.52 5.61 5.18 8 0.77 2.8 0.89 17.32 0.42 48.5-0.37 24.48-1.1 53.05-1.61 63.5-0.52 10.45-1.41 34.07-1.97 52.5-0.56 18.43-1.49 39.8-2.07 47.5-0.58 7.7-1.42 28.63-1.87 46.5-0.63 24.72-1.18 33.34-2.29 36-0.8 1.92-2.88 4.96-4.62 6.75-1.82 1.88-4.96 3.71-7.41 4.34-2.34 0.6-6.05 0.83-8.25 0.52-2.2-0.32-5.55-1.6-7.45-2.85-1.9-1.24-4.82-4.21-9.55-10.94l-0.35-19.66c-0.19-10.81 0.14-29.11 0.72-40.66 0.59-11.55 1.53-31.35 2.09-44 0.56-12.65 1.48-34.02 2.04-47.5 0.57-13.48 1.49-42.73 2.04-65 0.56-22.27 1.31-48.37 2.31-75.5zm97.06-2.22c1.29-1.21 3.69-2.91 5.34-3.8 2.15-1.16 4.99-1.53 10-1.31 5.28 0.23 7.8 0.85 10.25 2.54 1.95 1.35 4.32 4.55 8.62 13.75l-0.78 37.5c-0.74 35.69-0.68 37.58 1.07 39.2 1.39 1.29 4.91 1.94 14.34 2.65 6.87 0.52 14.07 1.6 16 2.4 1.92 0.79 5.11 3.2 7.08 5.35 2.22 2.41 3.88 5.43 4.34 7.9 0.42 2.2 0.42 6.02 0.01 8.5-0.56 3.44-1.82 5.63-5.33 9.3-2.53 2.64-5.5 5.06-6.6 5.38-1.1 0.32-8.97 0.86-32.98 1.82l-0.7 5c-0.39 2.75-1.23 22.55-1.86 44-0.63 21.45-1.33 39.34-1.55 39.75-0.23 0.41-0.81 17.96-1.31 39-0.75 31.92-1.17 38.91-2.55 42.25-0.92 2.2-2.65 5.07-3.86 6.38-1.2 1.31-3.65 2.99-5.44 3.75-1.79 0.75-5.73 1.37-8.75 1.37-3.03 0-6.51-0.5-7.75-1.12-1.24-0.61-3.95-2.75-6.04-4.75-2.24-2.15-4.22-5.26-4.86-7.63-0.73-2.72-0.86-14.39-0.4-36.5 0.37-17.88 1.32-46.45 2.11-63.5 0.79-17.05 1.43-39.66 1.44-69.5h-12c-6.6 0-13.24-0.48-14.75-1.06-1.51-0.59-4.03-2.28-5.59-3.75-1.56-1.48-3.54-4.04-4.4-5.69-0.91-1.76-1.6-5.76-1.66-9.66-0.09-5.99 0.2-7.04 2.95-10.5 1.68-2.11 5.05-4.84 7.5-6.05q4.45-2.21 16.95-3.77c6.87-0.85 12.72-1.81 13-2.12 0.27-0.31 0.8-15.04 1.16-32.73 0.36-17.7 1.19-36 1.84-40.67 0.65-4.68 1.55-9.18 2-10 0.45-0.83 1.87-2.48 3.16-3.68zm794.51 2.43c1.28-2.06 3.79-4.65 5.58-5.75 2.43-1.49 5.01-1.99 10.25-1.99 5.24 0 7.82 0.5 10.25 1.99 1.79 1.1 4.49 3.57 8.75 9l-0.33 39.75c-0.26 31.87-0.06 40.11 1 41.59 1.08 1.5 3.94 2.11 15.33 3.29 8.61 0.88 15.31 2.1 17.41 3.15 1.88 0.95 4.46 2.96 5.75 4.47 1.29 1.51 2.79 4.44 3.33 6.5 0.55 2.06 1 5.44 1 7.5 0.01 2.06-0.72 5.21-1.61 7-0.89 1.79-2.57 4.3-3.75 5.59-1.17 1.29-3.48 3.07-5.13 3.94-2.27 1.21-6.7 1.67-18.25 1.91-14.74 0.3-15.28 0.38-16.15 2.56-0.5 1.24-1.4 17.55-2.01 36.25-0.6 18.7-1.55 40.75-2.11 49-0.56 8.25-1.43 29.4-1.94 47-0.51 17.6-1.41 33.57-2 35.5-0.59 1.92-2.31 4.78-3.81 6.34-1.5 1.56-3.97 3.47-5.48 4.25-1.51 0.77-5.45 1.41-8.75 1.41-3.3 0-7.24-0.63-8.75-1.41-1.51-0.77-3.74-2.46-4.94-3.75-1.21-1.29-3.18-4.59-4.38-7.34-2.05-4.68-2.19-6.49-2.15-28 0.02-12.65 0.74-36.28 1.59-52.5 0.86-16.23 1.86-43.23 2.91-90.5h-13.47c-13.14 0-13.56-0.07-17.14-2.75-2.02-1.51-4.57-4.21-5.67-6-1.48-2.42-2-5.05-2.02-10.25-0.03-5.63 0.41-7.69 2.24-10.5 1.42-2.18 4.35-4.52 7.78-6.19 4.11-2.02 8.65-3.08 18-4.22 6.87-0.84 12.72-1.8 13-2.14 0.27-0.34 0.8-17.57 1.17-38.28 0.37-20.72 1.01-38.8 1.42-40.17 0.41-1.38 1.79-4.19 3.08-6.25zm-416.88 127.87c1.02-1.58 3.85-3.71 6.28-4.72 2.44-1.02 6.34-1.87 8.68-1.88 2.34-0.01 5.89 0.77 7.9 1.73 2.01 0.96 5.16 3.44 7 5.5 1.84 2.06 3.64 4.99 4 6.5 0.35 1.51-0.13 9.5-1.08 17.75-0.95 8.25-2.33 21.07-3.08 28.5-0.74 7.42-1.84 21.37-2.44 31-0.79 12.52-0.8 20.91-0.04 29.5 0.59 6.6 1.49 14.47 2.01 17.5 0.75 4.36 1.63 6.07 4.21 8.25 1.8 1.52 5.52 3.26 8.27 3.88 4.33 0.98 5.6 0.87 9.5-0.8 2.47-1.06 6.68-3.93 9.35-6.38 2.67-2.45 6.81-7.6 9.2-11.45 2.39-3.85 5.44-9.48 6.79-12.5 1.34-3.03 3.15-8.2 4.02-11.5 0.86-3.3 2.04-10.28 2.61-15.5 0.57-5.23 1.46-21.2 1.97-35.5 0.52-14.37 1.44-27.34 2.06-29 0.62-1.65 2.34-4.28 3.81-5.84 1.48-1.56 4.04-3.54 5.69-4.4 1.65-0.85 4.24-1.94 5.75-2.41q2.75-0.85 7.75 0.65c2.75 0.82 6.24 2.55 7.75 3.84 1.51 1.29 3.73 4.55 4.92 7.25 1.35 3.04 2.44 8.15 2.85 13.41 0.38 4.67 0.17 17.95-0.45 29.5-0.62 11.55-1.79 25.5-2.6 31-0.81 5.5-2.4 13.37-3.53 17.5-1.13 4.12-3.7 11.32-5.7 16-2 4.67-5.67 12.1-8.14 16.5-2.48 4.4-7.88 11.6-12 16-4.11 4.4-9.53 9.63-12.04 11.62-2.51 1.99-6.59 4.64-9.06 5.89-2.48 1.25-6.98 3.12-10 4.15-4.21 1.43-8.38 1.87-17.75 1.85-11.14-0.01-12.95-0.28-20-2.97-4.26-1.63-10.56-4.78-14-7-4.08-2.64-7.83-6.21-10.81-10.29-2.5-3.44-5.39-8.5-6.4-11.25-1.02-2.75-2.57-8.83-3.45-13.5-0.88-4.68-2.04-15.03-2.57-23-0.65-9.58-0.63-20.27 0.04-31.5 0.55-9.35 1.68-24.2 2.49-33 0.82-8.8 2.16-20.5 2.98-26 0.81-5.5 2.36-12.7 3.44-16 1.07-3.3 2.79-7.29 3.82-8.88zm166.21 2.09c1.92-1.15 4.62-2.42 6-2.81 1.37-0.4 3.85-0.76 5.5-0.8 1.65-0.04 4.8 0.79 7 1.84 2.2 1.05 5.69 3.75 7.75 5.99 3.12 3.39 3.86 5.03 4.4 9.82 0.36 3.16 0.37 32.97 0.02 66.25-0.34 33.27-1.09 66.46-1.65 73.75-0.56 7.29-1.62 14.71-2.34 16.5-0.81 1.98-3.26 4.52-6.25 6.49-2.71 1.79-6.51 3.51-8.43 3.83-1.93 0.32-5.41 0.1-7.75-0.5q-4.25-1.08-8.75-5.57c-2.48-2.48-4.8-5.74-5.16-7.25-0.37-1.51-0.1-31.33 0.59-66.25 0.69-34.93 1.6-70.25 2.03-78.5 0.47-9.22 1.3-16.1 2.16-17.85 0.76-1.56 2.95-3.79 4.88-4.94zm94 5.26c3.57-1.81 8.97-4.13 12-5.14 4.46-1.49 7.86-1.77 18-1.5 10.48 0.29 13.71 0.78 20 3.03 4.12 1.48 9.75 4.19 12.5 6.03 2.75 1.84 7.17 5.54 9.83 8.23 2.66 2.68 6.09 7.35 7.62 10.38 1.53 3.02 3.61 8.65 4.62 12.5 1.25 4.79 1.84 10.63 1.85 18.5 0.02 10.26-0.24 12.03-2.45 16.42-1.36 2.71-3.6 5.88-4.97 7.05-1.38 1.18-4.53 2.48-7 2.9-2.57 0.43-6.21 0.32-8.5-0.27-2.38-0.61-5.51-2.57-11.45-8.6l-1.09-13c-0.6-7.15-1.49-14.58-1.98-16.5-0.49-1.93-1.92-4.49-3.18-5.7-1.27-1.21-4.33-2.91-6.8-3.77-2.48-0.87-7.09-1.56-10.25-1.55-4.18 0.01-7.46 0.8-12 2.89-3.44 1.58-7.77 4.39-9.63 6.25-1.85 1.86-3.76 4.39-4.25 5.63-0.48 1.24-0.87 4.95-0.87 8.25 0 3.3 0.61 7.24 1.36 8.75 0.75 1.51 2.89 3.51 4.75 4.45 1.86 0.93 9.58 3.29 17.14 5.25 7.56 1.95 15.44 4.26 17.5 5.12 2.06 0.86 6.67 3.53 10.25 5.93 3.57 2.4 8.41 6.19 10.75 8.43 2.34 2.24 5.78 7.11 7.66 10.82 1.87 3.71 3.94 9.67 4.59 13.25 0.88 4.82 0.91 8.57 0.12 14.5-0.65 4.85-2.2 10.36-3.93 14-1.58 3.3-5.12 8.47-7.88 11.5-2.75 3.02-7.44 7.17-10.41 9.21-2.97 2.05-10.13 5.61-15.9 7.93-9.22 3.7-11.47 4.21-18.5 4.24-4.4 0.02-10.48-0.56-13.5-1.3-3.03-0.73-7.98-2.8-11-4.6-3.03-1.8-8.39-6.36-11.93-10.13-3.53-3.77-7.23-8.65-8.22-10.85-1-2.2-1.81-5.58-1.81-7.5 0-1.93 0.89-5.41 1.98-7.75 1.1-2.35 3.43-5.15 5.23-6.27 1.79-1.1 5.05-2.52 7.25-3.15 3.17-0.91 4.83-0.85 8 0.26 2.2 0.77 6.92 4.15 10.5 7.51 3.57 3.36 7.51 6.62 8.75 7.25 1.24 0.63 3.49 0.89 5 0.58 1.51-0.32 4.55-1.31 6.75-2.22 2.2-0.9 5.71-2.78 7.8-4.17 2.09-1.4 4.45-4 5.25-5.79 0.92-2.05 1.2-4.45 0.77-6.5-0.37-1.79-1.87-4.6-3.34-6.25-1.51-1.7-5.24-3.95-8.57-5.17-3.25-1.2-11.54-3.73-18.41-5.63-6.88-1.9-15.2-4.73-18.5-6.3-3.45-1.63-8.35-5.19-11.52-8.37-3.03-3.04-6.74-8.12-8.25-11.28-1.5-3.16-3.68-9.69-4.84-14.5-1.61-6.7-1.94-10.27-1.42-15.25 0.37-3.58 1.69-9.65 2.92-13.5 1.24-3.85 3.38-8.8 4.77-11 1.38-2.2 4.05-5.75 5.93-7.9 1.87-2.14 5.88-5.79 8.91-8.11 3.02-2.32 8.42-5.7 12-7.52zm-373 12.19c3.02-1.92 8.2-4.54 11.5-5.83 5.79-2.25 6.87-2.33 55-1.82l6.75 3.24c6.08 2.93 7 3.77 9.24 8.5 1.37 2.89 2.5 7.05 2.51 9.25 0.01 2.3-1.04 6.12-2.47 9-1.53 3.07-3.95 5.94-10.03 9.9l-21.5-0.81c-20.76-0.78-21.67-0.73-26.5 1.35-2.75 1.19-6.49 3.6-8.31 5.36-1.83 1.76-4.61 5.45-6.2 8.2-1.58 2.75-3.65 7.92-4.6 11.5-1.22 4.61-1.72 10.43-1.72 20-0.01 8.06 0.89 20.55 2.21 31 1.23 9.62 2.3 22.67 2.39 29 0.15 10.1-0.08 11.93-1.93 15-1.16 1.92-3.51 4.74-5.22 6.25-1.72 1.51-4.92 3.2-7.12 3.75-2.2 0.55-5.69 0.71-7.75 0.37-2.06-0.35-4.88-1.21-6.25-1.92-1.38-0.7-3.71-2.55-5.19-4.11-1.47-1.56-3.16-4.08-3.75-5.59-0.58-1.51-1.96-11.41-3.06-22-1.1-10.59-2.73-25.1-3.63-32.25-1.15-9.21-1.44-16.5-0.99-25 0.34-6.6 1.48-15.83 2.52-20.5 1.04-4.68 3.27-12.1 4.94-16.5 1.68-4.4 4.83-10.7 6.99-14 2.17-3.3 6.81-8.67 10.31-11.93 3.5-3.25 8.83-7.49 11.86-9.41zm-537 3.94c4.12-1.94 10.65-4.3 14.5-5.24 5.07-1.24 11.54-1.73 23.5-1.79 10.56-0.04 19.2 0.45 24 1.37 4.12 0.8 10.65 2.43 14.5 3.63 6.22 1.93 7.69 2.05 13.25 1.05q6.25-1.12 10-0.17c2.06 0.53 5.32 2.01 7.25 3.29 1.92 1.29 4.49 4.12 5.71 6.3 1.21 2.18 2.3 5.98 2.41 8.46 0.12 2.47-0.31 14.17-0.95 26-0.64 11.82-1.16 26.79-1.17 45l5 10c3.83 7.66 6.11 10.92 9.75 13.93 2.61 2.17 7.56 6.22 11 9 3.44 2.79 7.13 6.53 8.2 8.32 1.08 1.79 2.21 5.05 2.52 7.25 0.33 2.31-0.05 6.11-0.9 9-0.81 2.75-2.74 6.21-4.27 7.69-1.54 1.47-4.04 3.16-5.55 3.75-1.51 0.58-5.56 1.05-9 1.03-4.46-0.01-7.5-0.66-10.6-2.25-2.39-1.22-8.01-5.47-12.5-9.44-4.48-3.97-10.06-8.81-16.65-14.28l-9.25 7.05c-5.09 3.87-12.4 8.57-16.25 10.42-3.85 1.86-9.93 4.35-13.5 5.53-3.58 1.19-10.78 2.8-16 3.59-6.35 0.96-12.65 1.22-19 0.79-6.12-0.42-11.99-1.53-16.5-3.13-3.85-1.36-10.83-4.43-15.5-6.82-4.68-2.39-11.77-7.17-15.76-10.64-3.99-3.46-9.1-8.54-11.36-11.29-2.26-2.75-5.41-7.59-6.99-10.75-1.59-3.16-3.79-9.01-4.89-13-1.44-5.21-2.01-10.35-2.01-18.25-0.01-7.83 0.58-13.31 2.03-19 1.13-4.4 3.96-11.83 6.3-16.5 2.33-4.68 6.48-11.85 9.21-15.95 2.73-4.1 8.12-10.65 11.97-14.55 3.85-3.91 9.92-9.08 13.5-11.49 3.57-2.41 9.87-5.97 14-7.91zm42 32.41c-5.23-0.23-11.98 0.04-15 0.58-3.03 0.55-8.2 2.31-11.5 3.91-3.3 1.6-8.43 5.06-11.41 7.7-2.97 2.64-7.33 7.5-9.68 10.8-2.35 3.3-5.76 9.15-7.58 13-3.03 6.41-3.31 7.81-3.32 16.63-0.01 9.62-0.01 9.63 3.99 15.36 2.2 3.15 6.25 7.41 9 9.47 2.75 2.05 7.02 4.79 9.5 6.07 3.44 1.79 6.61 2.44 13.5 2.77 4.95 0.24 11.47-0.07 14.5-0.69 3.02-0.61 8.2-2.5 11.5-4.19 3.3-1.68 8.36-5.4 11.24-8.24 3.48-3.44 6.4-7.7 8.71-12.68 1.9-4.13 3.92-10.43 4.48-14 0.55-3.58 1.31-13.7 1.67-22.5 0.62-14.88 0.53-16.12-1.22-17.64-1.03-0.9-5.71-2.61-10.38-3.79-4.68-1.18-12.78-2.33-18-2.56z"
      />
    </svg>
    <nav class="buttons" bind:this={buttons}>
      <a aria-label="Home" class="headerButton interactable noSelect" href="/"
        ><span>home</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        aria-label="portfolio"
        href="/"
        class="headerButton interactable noSelect"
        onclick={() => {
          scrollTo("#projectsSection");
        }}
        ><span>portfolio</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        aria-label="labs"
        href="/labs"
        class="headerButton interactable noSelect"
        ><span>labs</span>
        <div class="headerButtonOverlay"></div>
      </a>
      <a
        aria-label="about"
        href="/"
        onclick={() => {
          scrollTo("#aboutSection");
        }}
        class="headerButton interactable noSelect"
        ><span>about</span>
        <div class="headerButtonOverlay"></div>
      </a>
    </nav>
  </div>
  <div class="buttons_mobile" bind:this={buttonsMobile}>
    <a
      aria-label="Home"
      class="headerButton interactable noSelect"
      href="/"
      oncontextmenu={(e) => e.preventDefault()}
      ><span>home</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      aria-label="portfolio"
      href="/"
      class="headerButton interactable noSelect"
      onclick={() => {
        scrollTo("#projectsSection");
      }}
      oncontextmenu={(e) => e.preventDefault()}
      ><span>portfolio</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      aria-label="labs"
      href="/labs"
      class="headerButton interactable noSelect"
      oncontextmenu={(e) => e.preventDefault()}
      ><span>labs</span>
      <div class="headerButtonOverlay"></div>
    </a>
    <a
      aria-label="about"
      href="/"
      onclick={() => {
        scrollTo("#aboutSection");
      }}
      oncontextmenu={(e) => e.preventDefault()}
      class="headerButton interactable noSelect"
      ><span>about</span>
      <div class="headerButtonOverlay"></div>
    </a>
  </div>
  <Socials bind:container={socials}></Socials>
</header>

<style>
  .buttons_mobile {
    width: 100%;
    height: 50%;
    display: none;
    grid-auto-rows: auto;
    gap: 0.75rem;
    justify-items: end;
  }

  .buttons_mobile a {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    padding: 0;
    transform-origin: top;
  }

  .logo {
    fill: var(--color-title-text);
    cursor: none;
  }

  .card {
    aspect-ratio: unset;
  }

  a {
    text-decoration: none;
  }

  #logoHeader {
    width: 150px;
    cursor: none;
  }

  #header {
    position: fixed;
    width: fit-content;
    height: auto;
    padding: 10px;
    border-radius: 50px;
    z-index: 1000;
    text-align: center;
    margin: 5% auto;
    left: 0;
    right: 0;
    top: 80%;
    will-change: transform;
    transform: translateZ(0);
  }
</style>
