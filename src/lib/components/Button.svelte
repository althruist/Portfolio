<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getCSSVariable, playSound } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { goto } from "$app/navigation";

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
    onpointerenter,
    onpointerdown,
    onpointerleave,
    onpointerup,
    onclick,
    bounceIntensity = 1,
    selectable,
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

<input
  bind:this={button}
  type="button"
  {id}
  class="button interactable {className} {active ? 'active' : ''}"
  value={text}
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
      backgroundColor: active ? getCSSVariable("--color-secondary") : selectable
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
      backgroundColor: active ? getCSSVariable("--color-secondary") : selectable ? getCSSVariable("--color-button-hover-selectable") : getCSSVariable("--color-secondary"),
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
      });
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
/>

<style>
  input {
    white-space: normal;
    word-wrap: break-word;
    text-align: center;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
  }

  .button {
    padding: var(--padding-card);
    font-size: 20px;
    font-weight: bold;
    padding-left: 40px;
    padding-right: 40px;
    border-radius: 25px;
    border: 0px;
    background-color: var(--color-primary);
    color: var(--color-text);
    cursor: pointer;
  }

  .button.outline {
    background-color: var(--color-card);
    color: var(--color-primary);
  }
</style>
