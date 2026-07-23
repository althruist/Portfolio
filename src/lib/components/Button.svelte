<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getCSSVariable, playSound } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { goto } from "$app/navigation";

  const dispatch = createEventDispatcher();

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
  } = $props();

  $effect(() => {
    if (button) {
      gsap.to(button, {
        backgroundColor: active
          ? getCSSVariable("--color-secondary")
          : getCSSVariable("--color-primary"),
        duration: 0.2,
        ease: "circ.out",
      });
    }
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
  onmousedown={() => {
    if (id == "readmore") {
      playSound("openCard");
    } else if (className == "goBack") {
      playSound("closeCard");
    } else {
      playSound("click");
    }
    gsap.to(button, {
      backgroundColor: getCSSVariable("--color-primary"),
      scale: 0.8,
      duration: 0.2,
      ease: "circ.out",
    });
  }}
  onmouseenter={() => {
    playSound("hover");
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
  onmouseup={() => {
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
  onmouseleave={() => {
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
  onclick={(e) => {
    click();
    dispatch("click", e);
  }}
/>

<style>
  input {
    white-space: normal;
    word-wrap: break-word;
    text-align: center;
  }
</style>
