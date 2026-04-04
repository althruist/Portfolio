<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getCSSVariable } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { goto } from "$app/navigation";

  const dispatch = createEventDispatcher();

  export let button;
  export let id = "";
  export let className = "";
  export let text = "";
  export let link;
  export let slug;
  export let disableNavigation = false;
  export let active = false;

  $: if (button) {
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : getCSSVariable("--color-primary"),
      duration: 0.2,
      ease: "circ.out",
    });
  }

  function click() {
    if (disableNavigation) return;
    if (slug) {
      goto(`/projects/${slug}`);
    } else if (link) {
      if (link === "/goback") window.history.back();
      else window.open(link, "_blank");
    }
  }
</script>

<input
  bind:this={button}
  type="button"
  {id}
  class="button interactable {className} {active ? 'active' : ''}"
  value={text}
  on:mousedown={() => {
    gsap.to(button, {
      backgroundColor: getCSSVariable("--color-primary"),
      scale: 0.8,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  on:mouseenter={() => {
    dispatch("mouseenter");
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-primary")
        : getCSSVariable("--color-secondary"),
      scale: 0.9,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  on:mouseup={() => {
    gsap
      .timeline()
      .to(button, {
        backgroundColor: getCSSVariable("--color-secondary"),
        scale: 1.2,
        duration: 0.24,
        ease: "circ.out",
      })
      .to(button, {
        scale: 1.0,
        duration: 0.2,
        ease: "sine.out",
      });
  }}
  on:mouseleave={() => {
    dispatch("mouseleave");
    gsap.to(button, {
      backgroundColor: active
        ? getCSSVariable("--color-secondary")
        : getCSSVariable("--color-primary"),
      scale: 1,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  on:click={(e) => {
    click();
    dispatch("click", e);
  }}
/>
