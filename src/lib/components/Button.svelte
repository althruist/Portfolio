<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getCSSVariable, playSound } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { goto } from "$app/navigation";

  import Arrow from "$lib/images/SVG/Arrows/arrow.svg";

  let {
    button = $bindable(),
    id = "",
    className = "",
    text = "",
    link,
    slug,
    disableNavigation = false,
    active = false,
    newTab = true,
    style = "",
    onpointerenter,
    onpointerdown,
    onpointerleave,
    onpointerup,
    onclick,
    bounceIntensity = 1,
    selectable,
    arrowIcon = false,
  } = $props();

  function resetColors() {
    gsap.set(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : selectable
          ? getCSSVariable("--color-button-unselected")
          : getCSSVariable("--color-primary"),
      color: active
        ? getCSSVariable("--color-button-text-selected")
        : getCSSVariable("--color-text"),
    });
  }

  $effect(() => {
    if (button) {
      gsap.to(button, {
        color: active
          ? getCSSVariable("--color-button-text-selected")
          : getCSSVariable("--color-text"),

        backgroundColor: active
          ? getCSSVariable("--color-secondary")
          : selectable
            ? getCSSVariable("--color-button-unselected")
            : getCSSVariable("--color-primary"),
        duration: 0.2,
        ease: "circ.out",
      });
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", resetColors);
  });

  function click() {
    if (disableNavigation) return;
    if (slug) {
      goto(`/projects/${slug}`);
    } else if (link) {
      if (link.startsWith("/")) {
        if (link === "/goback") {
          window.history.back();
        } else {
          goto(link);
        }
      } else if (newTab) {
        window.open(link, "_blank");
      } else {
        window.location.href = link;
      }
    }
  }
</script>

<button
  bind:this={button}
  type="button"
  {id}
  class="button interactable {className} {active ? 'active' : ''}"
  {style}
  onpointerdown={() => {
    onpointerdown?.();
    if (id == "readmore") {
      playSound("openCard");
    } else if (className == "goBack") {
      playSound("closeCard");
    } else {
      playSound("click");
    }
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : selectable
          ? getCSSVariable("--color-button-unselected")
          : getCSSVariable("--color-primary"),
      scale: 1 + -0.2 * bounceIntensity,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  onpointerenter={() => {
    onpointerenter?.();
    playSound("hover");
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : selectable
          ? getCSSVariable("--color-button-hover-selectable")
          : getCSSVariable("--color-secondary"),
      scale: 1 + -0.1 * bounceIntensity,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  onpointerup={() => {
    onpointerup?.();
    gsap
      .timeline()
      .to(button, {
        backgroundColor: getCSSVariable("--color-secondary"),
        scale: 1 + 0.2 * bounceIntensity,
        duration: 0.24,
        ease: "circ.out",
      })
      .to(button, {
        scale: 1.0,
        duration: 0.2,
        ease: "sine.out",
      })
      .call(resetColors);
  }}
  onpointerleave={() => {
    onpointerleave?.();
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : selectable
          ? getCSSVariable("--color-button-unselected")
          : getCSSVariable("--color-primary"),
      scale: 1,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  onclick={() => {
    onclick?.();
    click();
  }}
>
  <span>{text}</span>

  {#if arrowIcon}
    <Arrow />
  {/if}
</button>

<style>
  .button {
    text-align: center;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    padding: var(--padding, var(--padding-card));
    font-size: var(--font-size, 20px);
    font-weight: var(--font-weight, bold);
    padding-left: var(--padding-left, 40px);
    padding-right: var(--padding-right, 40px);
    border-radius: var(--border-radius, 25px);
    border: var(--border, 0px);
    background-color: var(--background-color, var(--color-primary));
    color: var(--color, var(--color-text));
    width: var(--width, auto);
    height: var(--height, auto);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    gap: 0.3rem;
  }

  .button.outline {
    background-color: var(--color-card);
    color: var(--color-primary);
  }

  .button :global(svg) {
    flex-shrink: 0;
    transform: rotate(-90deg);
    width: 2.5rem;
  }
</style>
