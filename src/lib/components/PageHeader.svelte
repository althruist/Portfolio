
<script>
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onMount } from "svelte";

  let {
    children,
    pageHeader = $bindable(),
    id = "",
    className = "",
    style = "",
  } = $props();

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.to(pageHeader, {
      opacity: 0,
      scrollTrigger: {
        trigger: pageHeader,
        start: "top top",
        end: "+=500",
        scrub: 0.5,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  });
</script>

<div
  bind:this={pageHeader}
  {id}
  class={`pageHeader ${className}`}
  {style}
>
  {@render children?.()}
</div>

<style>
  .pageHeader {
    background-color: var(--color-background);
    height: 80vh;
    width: 100%;
    overflow: hidden;
    color: var(--color-text);
    align-content: center;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    position: relative;
  }
</style>
