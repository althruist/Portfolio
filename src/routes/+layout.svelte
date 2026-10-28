<script>
  import "$lib/styles/fonts.css";
  import "$lib/styles/global.css";
  import "$lib/styles/variables.css";

  import lightFavicon from "$lib/images/SVG/Favicons/Light.ico";
  import darkFavicon from "$lib/images/SVG/Favicons/Dark.ico";

  import Header from "$lib/components/Header.svelte";
  import Cursor from "$lib/components/Cursor.svelte";
  import Socials from "$lib/components/Socials.svelte";
  import { onMount } from "svelte";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { addNoise, isDarkMode, setLenis } from "$lib/logic/globalFunctions";

  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import Lenis from "lenis";

  let { children } = $props();

  let background;
  let footer;
  let content;
  let smoothWrapper;

  function setFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = src;
  }

  function updateFavicon() {
    setFavicon(isDarkMode() ? darkFavicon : lightFavicon);
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    injectAnalytics();
    injectSpeedInsights();

    const lenis = new Lenis({ duration: 1 });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    updateFavicon();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateFavicon);

    return () => {
      mediaQuery.removeEventListener("change", updateFavicon);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  });
</script>

<svelte:head>
  <meta property="og:title" content="althruist:portfolio" />
  <meta
    property="og:description"
    content="This website brings you to a library of althruist's works, ranging from music, digital arts, game development and more! You can also find althruist's contact information here. Have a look! :)"
  />
  <meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />
  <meta
    name="description"
    content="This website brings you to a library of althruist's works, ranging from music, digital arts, game development and more! You can also find althruist's contact information here. Have a look! :)"
  />
  <meta
    property="og:image"
    content="https://althruist.fyi/images/preview.jpg"
  />
  <meta property="og:url" content="https://althruist.fyi" />
  <meta property="og:type" content="website" />
  <meta content="#588ccd" data-react-helmet="true" name="theme-color" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="althruist:portfolio" />
  <meta
    name="twitter:description"
    content="This website brings you to a library of althruist's works, ranging from music, digital arts, game development and more! You can also find althruist's contact information here. Have a look! :)"
  />
  <meta name="twitter:image" content="https://althruist.fyi/preview.jpg" />
</svelte:head>

<div id="background-wrapper">
  <div bind:this={background} id="background"></div>
</div>

<Header />
<Cursor />

<div id="smooth-wrapper" bind:this={smoothWrapper}>
  <div bind:this={content} id="content">
    {@render children?.()}
    <div bind:this={footer} class="footer card" use:addNoise>
      <p class="altText noSelect">
        this website is homemade :] • © althruist 2025-2026 • <a
          href="https://github.com/althruist/Portfolio"
          target="_blank">check out the repository!</a
        >
      </p>
      <Socials variant="footer"></Socials>
    </div>
  </div>
</div>

<style>
  #background-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
  }

  #background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--background);
    background-repeat: no-repeat;
    background-size: 300%;
    z-index: -1;
    pointer-events: none;
    transition: background-position 0.5s ease-out;
    filter: blur(10px);
  }

  .footer {
    width: 100%;
    border-radius: 0;
    padding: 0;
    overflow: hidden;
    aspect-ratio: unset;
  }

  .altText {
    text-align: center;
    color: var(--color-text);
    padding-top: 1rem;
  }
</style>