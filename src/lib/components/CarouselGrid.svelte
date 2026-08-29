<script>
  import { gsap } from "gsap";
  import { onMount, tick, onDestroy } from "svelte";
  import Card from "./Card.svelte";
  import { getImage } from "$lib/logic/data";
  import { ObservablePatch } from "@sanity/client";
  import { getCSSVariable, playSound } from "$lib/logic/globalFunctions";

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

    // Dynamically import Observer inside onMount to ensure it only loads on the client
    const observerModule = await import("gsap/Observer");
    Observer = observerModule.default || observerModule.Observer;
    gsap.registerPlugin(Observer);

    const morphModule = await import("gsap/MorphSVGPlugin");
    MorphSVGPlugin = morphModule.default || morphModule.MorphSVGPlugin;
    gsap.registerPlugin(MorphSVGPlugin);

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="leftArrow"
        viewBox="0 0 1080 1080"
      >
        <path
          id="normal"
          d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
        />
        <path
          id="normalOriginal"
          d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
          fill="none"
          style="display:none"
        />
        <path
          id="hover"
          d="M267,672.5c-102-58.9-102-206,0-264.9l473.9-273.6c1-.6,2-1.2,3.1-1.7,132.4-72.7,255.7,109.6,139.8,206.4l-35.7,29.8c-106.9,89.3-106.9,253.6,0,342.9l35.7,29.8c115.9,96.8-7.4,279.1-139.8,206.4-1-.6-2-1.1-3.1-1.7l-473.9-273.6h0Z"
          fill="none"
          style="display:none"
        />
        <path
          id="click"
          d="M409.677,658.944C475.94,698.719 518.565,768.385 523.816,845.491C529.067,922.597 496.281,997.398 436.021,1045.79C409.714,1066.796 381.484,1080.117 352.094,1080.117L254.043,1080.117C113.833,1080.117 0,966.285 0,826.075C0,825.984 0,254.043 0,254.043C0,113.833 113.833,0 254.043,0C254.08,0 352.095,0 352.095,0C382.196,0 411.081,13.791 437.885,35.451C496.947,83.322 528.945,156.993 523.616,232.831C518.286,308.67 476.3,377.142 411.124,416.283C363.5,444.927 315.56,473.717 278.267,496.113C263.535,504.96 254.523,520.886 254.523,538.07C254.523,555.255 263.535,571.18 278.267,580.027C315.178,602.193 362.517,630.623 409.677,658.944Z"
          fill="none"
          style="display:none"
        />
      </svg></button
    >
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="leftArrow"
        viewBox="0 0 1080 1080"
      >
        <path
          id="normal"
          d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
        />
        <path
          id="normalOriginal"
          d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
          fill="none"
          style="display:none"
        />
        <path
          id="hover"
          d="M267,672.5c-102-58.9-102-206,0-264.9l473.9-273.6c1-.6,2-1.2,3.1-1.7,132.4-72.7,255.7,109.6,139.8,206.4l-35.7,29.8c-106.9,89.3-106.9,253.6,0,342.9l35.7,29.8c115.9,96.8-7.4,279.1-139.8,206.4-1-.6-2-1.1-3.1-1.7l-473.9-273.6h0Z"
          fill="none"
          style="display:none"
        />
        <path
          id="click"
          d="M409.677,658.944C475.94,698.719 518.565,768.385 523.816,845.491C529.067,922.597 496.281,997.398 436.021,1045.79C409.714,1066.796 381.484,1080.117 352.094,1080.117L254.043,1080.117C113.833,1080.117 0,966.285 0,826.075C0,825.984 0,254.043 0,254.043C0,113.833 113.833,0 254.043,0C254.08,0 352.095,0 352.095,0C382.196,0 411.081,13.791 437.885,35.451C496.947,83.322 528.945,156.993 523.616,232.831C518.286,308.67 476.3,377.142 411.124,416.283C363.5,444.927 315.56,473.717 278.267,496.113C263.535,504.96 254.523,520.886 254.523,538.07C254.523,555.255 263.535,571.18 278.267,580.027C315.178,602.193 362.517,630.623 409.677,658.944Z"
          fill="none"
          style="display:none"
        />
      </svg></button
    >
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
          src={getImage(screenshot.asset._ref)}
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
    border-radius: 20px;
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

  .arrow svg {
    width: 110%;
    height: 110%;
    fill: var(--color-basic);
  }

  .arrow.right svg {
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

  @media (min-width: 1024px) {
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
