<script>
  import { playSound } from "$lib/logic/globalFunctions";
  import { onMount } from "svelte";
  import gsap from "gsap";

  import AudiotoolLogo from "$lib/images/SVG/Socials/Audiotool.svg?component";
  import YouTubeLogo from "$lib/images/SVG/Socials/YouTube.svg?component";
  import InstagramLogo from "$lib/images/SVG/Socials/Instagram.svg?component";
  import LinkedInLogo from "$lib/images/SVG/Socials/LinkedIn.svg?component";
  import GitHubLogo from "$lib/images/SVG/Socials/GitHub.svg?component";

  let { variant = "default", container = $bindable() } = $props();

  onMount(() => {
    const socialSVGs = Array.from(container.querySelectorAll(".socialSVG"));

    const cleanup = [];

    socialSVGs.forEach((svg) => {
      const parent = svg.parentElement;

      const handleEnter = () => {
        playSound("hover");

        gsap.to(parent, {
          scale: 1.3,
          duration: 0.2,
          overwrite: "auto",
        });
      };

      const handleDown = () => {
        playSound("openLink");
      };

      const handleLeave = () => {
        gsap.to(parent, {
          scale: 1,
          duration: 0.2,
          overwrite: "auto",
        });
      };

      parent.addEventListener("pointerenter", handleEnter);
      parent.addEventListener("pointerdown", handleDown);
      parent.addEventListener("pointerleave", handleLeave);

      cleanup.push(() => {
        parent.removeEventListener("pointerenter", handleEnter);
        parent.removeEventListener("pointerdown", handleDown);
        parent.removeEventListener("pointerleave", handleLeave);
        gsap.killTweensOf(parent);
      });
    });

    socialSVGs.forEach((svg) => {
      const icon = svg.querySelector(".icon");
      gsap.killTweensOf(icon);
      gsap.set(icon, { clearProps: "fill" });
    });

    return () => cleanup.forEach((fn) => fn());
  });
</script>

<div class="socials {variant}" bind:this={container}>
  <a
    aria-label="LinkedIn"
    href="https://www.linkedin.com/in/althruist/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <LinkedInLogo />
  </a>
  <a
    aria-label="Audiotool"
    href="https://www.audiotool.com/user/Akridiki"
    target="_blank"
    rel="noopener noreferrer"
  >
  <AudiotoolLogo/>
  </a>

  <a
    aria-label="YouTube"
    href="https://youtube.com/@althruistic"
    target="_blank"
    rel="noopener noreferrer"
  >
    <YouTubeLogo />
  </a>

  <a
    aria-label="Instagram"
    href="https://instagram.com/althruistic_"
    target="_blank"
    rel="noopener noreferrer"
  >
    <InstagramLogo />
  </a>
  <a
    aria-label="GitHub"
    href="https://github.com/althruist"
    target="_blank"
    rel="noopener noreferrer"
  >
  <GitHubLogo/>
  </a>
</div>

<style>
  .socials {
    display: none;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .socials.footer {
    margin-right: auto;
    display: flex;
    padding: 2rem;
    padding-top: 1rem;
  }

  .socials.getintouch {
    display: flex;
    align-self: center;
    align-items: center;
    padding: 0;
    scale: 1;
    margin: auto;
    padding-bottom: 40px;
  }

  .socials.getintouch a {
    width: 50px;
    height: 50px;
  }

  .socialSVG {
    margin: auto;
    width: 32px;
    height: 32px;
  }
</style>
