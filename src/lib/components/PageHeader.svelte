<script>
  import { page } from "$app/state";
  import { isMobile } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";

  export let pageHeader;
  export let foregroundImg;

  export let id = "";
  export let className = "";
  export let style = "";

  let isHovering = false;
  let tween;

  onMount(() => {
    if (className != "") {
      className = ` ${className}`;
    }

    gsap.registerPlugin(ScrambleTextPlugin);
    gsap.registerPlugin(ScrollTrigger);

    const windowSize = () => {
      if (window.innerWidth <= 424) {
        gsap.set(foregroundImg, {
          position: "absolute",
          scale: 0.4,
          top: "-5vh",
          left: "0vw",
        });
      } else {
        gsap.set(foregroundImg, {
          position: "absolute",
          scale: 0.8,
          top: "4vh",
          left: "50vw",
        });
      }
    };

    window.addEventListener("resize", windowSize);

    gsap.to(".foreground", {
      y: -750,
      x: -1000,
      scrollTrigger: {
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    pageHeader.addEventListener("mouseenter", () => {
      if (isHovering) return;
      isHovering = true;
      gsap.to(pageHeader.querySelector(".name"), {
        duration: 1,
        scrambleText: {
          text: "althruist",
          chars: "kailetrhaunist",
          revealDelay: 0,
          speed: 1,
        },
      });

      gsap.to(foregroundImg, {
        opacity: 0.5,
        duration: 0.3,
      });
    });

    gsap.to(pageHeader, {
      opacity: 0,
      scrollTrigger: {
        start: "top top",
        end: '+=500',
        scrub: 0.5,
      },
    });

    pageHeader.addEventListener("mouseleave", () => {
      if (tween) {
        tween.kill();
      }

      isHovering = false;

      gsap.to(pageHeader.querySelector(".name"), {
        duration: 1,
        scrambleText: {
          text: "Kieran",
          chars: "KailEtrHaunIst",
          revealDelay: 0,
          speed: 1,
        },
      });

      gsap.to(foregroundImg, {
        opacity: 1,
        duration: 0.3,
      });
    });
  });
</script>

<div bind:this={pageHeader} {id} class="pageHeader{className}" {style}>
  <slot />
</div>
