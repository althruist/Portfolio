<script>
  import { getCSSVariable } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";

  export let button;

  export let id = "";
  export let className = "";
  export let text = "";
  export let link;

  let isHovering = false;

  onMount(() => {
    if (className != "") {
      className = ` ${className}`;
    }

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
    if (link == "/goback") {
      window.history.back();
      return;
    }
    window.open(link, "_blank");
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