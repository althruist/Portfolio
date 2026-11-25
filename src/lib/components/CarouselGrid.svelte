<script>
  import { gsap } from "gsap";
  import { onMount, tick, onDestroy } from "svelte";
  import Card from "./Card.svelte";
  import { getImage, getSrcSet } from "$lib/logic/data";
  import { ObservablePatch } from "@sanity/client";
  import { getCSSVariable, playSound } from "$lib/logic/globalFunctions";

  import Arrow from "$lib/images/SVG/Arrows/arrow.svg?component";

  let MorphSVGPlugin;
  let Observer;

  let { content = [], id, filter, name } = $props();

  let arrowLeft = $state();
  let arrowRight = $state();
  let carousel = $state();
  let carouselContainer = $state();
  let modalElement = $state();
  let imagePreview = $state();

  let touchObserver = null;

  let autoScrollTimer = null;
  let inactivityTimer = null;

  const SCROLL_INTERVAL = 2000;
  const RESUME_DELAY = 5000;

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      scrollRight();
    }, SCROLL_INTERVAL);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  function handleUserInteraction() {
    stopAutoScroll();
    inactivityTimer = setTimeout(() => {
      startAutoScroll();
    }, RESUME_DELAY);
  }

  async function previewImageOpen(e, imgSrc) {
    e.preventDefault();
    if (imagePreview) imagePreview.src = imgSrc;
    handleUserInteraction();

    await tick();
    modalElement?.showModal();

    gsap.fromTo(
      modalElement,
      { "--backdrop-opacity": 0, "--backdrop-blur": "0px" },
      {
        "--backdrop-opacity": 0.4,
        "--backdrop-blur": "6px",
        duration: 0.4,
        ease: "power2.out",
      },
    );

    let tl = gsap.timeline();
    tl.fromTo(
      imagePreview,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.1, ease: "circ.out" },
    );
    tl.to(imagePreview, { scale: 0.9, duration: 0.2, ease: "circ.inOut" });
  }

  const scrollRight = async () => {
    if (!carousel || carousel.children.length < 2) return;

    const firstItem = carousel.children[0];
    const secondItem = carousel.children[1];
    const distance =
      secondItem.getBoundingClientRect().left -
      firstItem.getBoundingClientRect().left;

    gsap.killTweensOf(carousel);
    const currentX = Number(gsap.getProperty(carousel, "x"));

    gsap.to(firstItem, {
      opacity: 0,
      scale: 0.8,
      duration: 0.1,
      rotate: 0,
      ease: "circ.out",
      overwrite: "auto",
      onComplete: () => {
        carousel.appendChild(firstItem);

        gsap.set(carousel, { x: currentX + distance });
        gsap.to(carousel, {
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        let timeline = gsap.timeline();
        timeline.fromTo(
          firstItem,
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1.1,
            duration: 0.25,
            ease: "circ.out",
            overwrite: "auto",
          },
        );
        timeline.to(firstItem, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "sine.out",
          overwrite: "auto",
        });
      },
    });
  };

  const scrollLeft = async () => {
    if (!carousel || carousel.children.length < 2) return;

    const firstItem = carousel.children[0];
    const secondItem = carousel.children[1];
    const distance =
      secondItem.getBoundingClientRect().left -
      firstItem.getBoundingClientRect().left;
    const lastItem = carousel.children[carousel.children.length - 1];

    gsap.killTweensOf(carousel);
    const currentX = Number(gsap.getProperty(carousel, "x"));
    carousel.insertBefore(lastItem, carousel.children[0]);

    gsap.set(carousel, { x: currentX - distance });
    gsap.to(carousel, {
      x: 0,
      duration: 0.5,
      rotate: 0,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.fromTo(
      lastItem,
      { opacity: 0, rotate: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "sine.out",
        overwrite: "auto",
      },
    );
  };

  let hoverTweens = new WeakMap();

  const enter = (obj) => {
    if (!obj) return;
    playSound("hover");
    const tween = gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(obj, {
        scale: 1.1,
        backgroundColor: getCSSVariable("--color-basic"),
        duration: 0.5,
        overwrite: "auto",
      })
      .to(
        obj.querySelector("path"),
        {
          fill: getCSSVariable("--color-primary"),
          duration: 0.5,
          overwrite: "auto",
        },
        0,
      );

    gsap.to(obj.querySelector("#normal"), {
      duration: 0.5,
      morphSVG: obj.querySelector("#hover"),
      ease: "power2.out",
      overwrite: "auto",
    });

    hoverTweens.set(obj, tween);
  };

  const leave = (obj) => {
    if (!obj) return;
    const tween = hoverTweens.get(obj);
    if (tween) {
      tween.kill();
      hoverTweens.delete(obj);
    }

    gsap.to(obj, {
      scale: 1,
      backgroundColor: getCSSVariable("--color-primary"),
      duration: 0.5,
      overwrite: "auto",
    });
    gsap.to(obj.querySelector("path"), {
      fill: getCSSVariable("--color-basic"),
      duration: 0.5,
      overwrite: "auto",
    });

    gsap.to(obj.querySelector("#normal"), {
      duration: 0.5,
      morphSVG: obj.querySelector("#normalOriginal"),
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const down = (obj) => {
    if (!obj) return;
    playSound("click");
    const tween = hoverTweens.get(obj);
    if (tween) {
      tween.kill();
      hoverTweens.delete(obj);
    }

    handleUserInteraction();

    if (obj.classList.contains("right")) {
      gsap.to(obj, {
        x: 10,
        backgroundColor: getCSSVariable("--color-basic"),
        scale: 0.9,
        duration: 0.2,
        overwrite: "auto",
      });
    } else if (obj.classList.contains("left")) {
      gsap.to(obj, {
        x: -10,
        backgroundColor: getCSSVariable("--color-basic"),
        scale: 0.9,
        duration: 0.2,
        overwrite: "auto",
      });
    }
    gsap.fromTo(
      obj.querySelector("#normal"),
      { morphSVG: obj.querySelector("#hover") },
      {
        duration: 0.5,
        morphSVG: obj.querySelector("#click"),
        ease: "power2.out",
        overwrite: "auto",
      },
    );
    gsap.to(obj.querySelector("path"), {
      fill: getCSSVariable("--color-primary"),
      duration: 0.5,
      overwrite: "auto",
    });
  };

  const up = (obj) => {
    if (!obj) return;
    const tween = hoverTweens.get(obj);
    if (tween) {
      tween.kill();
      hoverTweens.delete(obj);
    }
    if (obj.classList.contains("right")) {
      gsap.to(obj, {
        x: -10,
        backgroundColor: getCSSVariable("--color-primary"),
        scale: 1,
        duration: 0.5,
        overwrite: "auto",
      });
    } else if (obj.classList.contains("left")) {
      gsap.to(obj, {
        x: 10,
        backgroundColor: getCSSVariable("--color-primary"),
        scale: 1,
        duration: 0.5,
        overwrite: "auto",
      });
    }
    gsap.to(obj.querySelector("#normal"), {
      duration: 0.5,
      morphSVG: obj.querySelector("#hover"),
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(obj.querySelector("path"), {
      fill: getCSSVariable("--color-basic"),
      duration: 0.5,
      overwrite: "auto",
    });
  };

  let updateThemeColors = () => {
    const elements = [
      { element: arrowLeft, fill: arrowLeft?.querySelector("#normal") },
      { element: arrowRight, fill: arrowRight?.querySelector("#normal") },
    ];

    elements.forEach(({ element, fill }) => {
      if (element) gsap.killTweensOf(element);
      if (fill) gsap.killTweensOf(fill);

      if (element)
        gsap.set(element, {
          backgroundColor: getCSSVariable("--color-primary"),
        });
      if (fill) gsap.set(fill, { fill: getCSSVariable("--color-basic") });
    });
  };

  onMount(async () => {
    startAutoScroll();

    const observerModule = await import("gsap/Observer");
    Observer = observerModule.default || observerModule.Observer;
    gsap.registerPlugin(Observer);

    const morphModule = await import("gsap/MorphSVGPlugin");
    MorphSVGPlugin = morphModule.default || morphModule.MorphSVGPlugin;
    gsap.registerPlugin(MorphSVGPlugin);

    console.log("Arrow SVG:", arrowLeft.querySelector("svg"));

    console.log("Morph targets:", {
      normal: arrowLeft.querySelector("#normal"),
      hover: arrowLeft.querySelector("#hover"),
      click: arrowLeft.querySelector("#click"),
      original: arrowLeft.querySelector("#normalOriginal"),
    });

    if (carousel) {
      touchObserver = Observer.create({
        target: carousel,
        type: "touch,pointer",
        tolerance: 150,
        preventDefault: true,
        onLeft: () => {
          handleUserInteraction();
          scrollRight();
        },
        onRight: () => {
          handleUserInteraction();
          scrollLeft();
        },
      });
    }

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", updateThemeColors);
    }
  });

  onDestroy(() => {
    stopAutoScroll();
    touchObserver?.kill();
  });
</script>

<Card className="carousel-wrapper noBounce" bind:this={carouselContainer} {id}>
  <div class="arrows">
    <button
      bind:this={arrowLeft}
      aria-label="Scroll Left"
      class="arrow left interactable"
      onpointerenter={() => enter(arrowLeft)}
      onpointerleave={() => leave(arrowLeft)}
      onpointerdown={() => down(arrowLeft)}
      onpointerup={() => up(arrowLeft)}
      onclick={scrollLeft}
    >
      <Arrow />
    </button>
    <button
      bind:this={arrowRight}
      aria-label="Scroll Right"
      class="arrow right interactable"
      onpointerenter={() => enter(arrowRight)}
      onpointerleave={() => leave(arrowRight)}
      onpointerdown={() => down(arrowRight)}
      onpointerup={() => up(arrowRight)}
      onclick={scrollRight}
    >
      <Arrow />
    </button>
  </div>

  <div class="carousel" bind:this={carousel}>
    {#each content as screenshot}
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a
        href="#"
        onclick={(e) => {
          previewImageOpen(e, getImage(screenshot.asset._ref));
          playSound("openCard");
        }}
        onpointerenter={(e) => {
          playSound("cardHover");
          gsap.to(e.currentTarget, {
            scale: 0.9,
            rotate: gsap.utils.random(-2, 2),
            duration: 0.1,
            ease: "circ.out",
          });
        }}
        onpointerleave={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1,
            rotate: 0,
            duration: 0.1,
            ease: "circ.out",
          });
        }}
        draggable="false"
      >
        <img
          class="gridImg noSelect"
          src={getImage(screenshot.asset._ref, 800)}
          srcset={getSrcSet(screenshot.asset._ref)}
          alt={screenshot.alt}
          oncontextmenu={(e) => e.preventDefault()}
          draggable="false"
        />
      </a>
    {/each}
  </div>
</Card>

<dialog
  bind:this={modalElement}
  id="imagepreview"
  onclick={() => {
    modalElement?.close();
    playSound("closeCard");
  }}
>
  <img
    bind:this={imagePreview}
    src=""
    alt="Preview"
    class="modal-preview-img noSelect"
    oncontextmenu={(e) => e.preventDefault()}
    draggable="false"
  />
  <h3>Click anywhere to Close</h3>
</dialog>

<style>
  .carousel {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;
    gap: 1rem;
  }

  .arrows {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: 100%;
    height: 50px;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 3;
  }

  .arrow {
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: auto;
    background-color: var(--color-primary);
    border-radius: var(--radius-card);
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    border: 1px var(--color-card-outline) solid;
    box-shadow: 0px 0px 20px 2px var(--color-shadow);
    width: 50px;
    height: 100%;
  }

  .arrow.left {
    left: 1rem;
  }

  .arrow.right {
    right: 1rem;
  }

  .arrow.right :global(svg) {
    transform: scaleX(-1);
  }

  .gridImg {
    display: block;
    position: relative;
    overflow: hidden;
    aspect-ratio: unset;
    width: 100%;
    aspect-ratio: 1/1;
  }

  dialog {
    background-color: transparent;
    border: 0;
    overflow: hidden;
    --backdrop-opacity: 0;
    --backdrop-blur: 0px;
    padding: 0;
  }

  dialog img {
    width: 100%;
  }

  dialog::backdrop {
    background-color: color-mix(
      in srgb,
      var(--color-background) 50%,
      transparent
    );
    backdrop-filter: blur(var(--backdrop-blur));
    -webkit-backdrop-filter: blur(var(--backdrop-blur));
  }
  dialog h3 {
    text-align: center;
    color: var(--color-text);
  }

  @media (min-width: 1064px) {
    dialog img {
      width: 90vh;
      height: auto;
      margin: auto;
    }
    .carousel {
      grid-auto-columns: calc((100% - 1rem) / 2);
      width: 100%;
    }

    .arrow {
      display: block;
    }
  }
</style>