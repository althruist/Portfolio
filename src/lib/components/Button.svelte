<script>
  import { onMount } from "svelte";
  import { getCSSVariable } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { goto } from "$app/navigation";

  export let button;
  export let id = "";
  export let className = "";
  export let text = "";
  export let link; // optional external link
  export let slug; // optional, for internal navigation

  onMount(() => {
    if (className != "") className = ` ${className}`;

    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        backgroundColor: getCSSVariable("--color-secondary"),
        scale: 0.9,
        duration: 0.2,
        ease: "circ.out",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        backgroundColor: getCSSVariable("--color-primary"),
        scale: 1,
        duration: 0.2,
        ease: "circ.out",
      });
    });
  });

  function click() {
    if (slug) {
      // Internal navigation
      goto(`/projects/${slug}`);
    } else if (link) {
      // External link
      if (link === "/goback") window.history.back();
      else window.open(link, "_blank");
    }
  }
</script>

<input
  bind:this={button}
  type="button"
  {id}
  class="button interactable{className}"
  value={text}
  on:click={click}
/>