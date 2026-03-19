<script>
  import { page } from "$app/state";
  import { isMobile } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";

  export let pageHeader;

  export let id = "";
  export let className = "";
  export let style = "";

  onMount(() => {
    if (className != "") {
      className = ` ${className}`;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(pageHeader, {
      opacity: 0,
      scrollTrigger: {
        start: "top top",
        end: "+=500",
        scrub: 0.5,
      },
    });
  });
</script>

<div bind:this={pageHeader} {id} class="pageHeader{className}" fetchpriority=high {style}>
  <slot />
</div>

<style>
  div {
    overflow: hidden;
    position: relative;
  }
</style>
