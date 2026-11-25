<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { text } from "@sveltejs/kit";

  let pointerWrapper;
  let ring;
  let textboxText;

  onMount(() => {
    let morphReady = false;
    let disposed = false;

    import("gsap/MorphSVGPlugin").then((m) => {
      if (disposed) return;

      gsap.registerPlugin(m.default || m.MorphSVGPlugin);
      morphReady = true;
      setHover(cursorState, true);
    });

    const path = ring.querySelector("#cursorPath");
    const morph = (to, vars) => {
      if (morphReady) gsap.to(path, { morphSVG: to, ...vars });
    };

    gsap.set(pointerWrapper, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(pointerWrapper, "x", {
      duration: 0.25,
      ease: "power3",
    });
    const yTo = gsap.quickTo(pointerWrapper, "y", {
      duration: 0.25,
      ease: "power3",
    });

    let shown = false;
    const onMove = (e) => {
      if (e.pointerType === "touch") {
        if (shown) {
          gsap.set(pointerWrapper, { display: "none" });
          shown = false;
        }
        return;
      }
      if (!shown && e.pointerType === "mouse") {
        gsap.set(pointerWrapper, {
          display: "block",
          x: e.clientX,
          y: e.clientY,
        });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    let cursorState = "default";
    let clickTl;

    const setHover = (state, force = false) => {
      if (state === cursorState && !force) return;
      cursorState = state;

      gsap.to(pointerWrapper, {
        xPercent: state === "tooltip" ? -420 : -50,
        yPercent: state === "tooltip" ? -80 : -50,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: "auto",
      });

      clickTl?.kill();
      gsap.killTweensOf(ring);
      gsap.killTweensOf(path);
      gsap.killTweensOf(textboxText);

      const shapes = {
        default: "#cursorPathOriginal",
        hover: "#hoverPath",
        tooltip: "#tooltipPath",
      };

      morph(shapes[state], {
        duration: state === "tooltip" ? 0.5 : 0.3,
        ease: "power2.inOut",
      });

      gsap.to(ring, {
        opacity: 1,
        scale: state === "tooltip" ? 3 : state === "hover" ? 1.4 : 1,
        duration: 0.3,
        ease: "circ.out",
      });

      gsap.to(textboxText, {
        opacity: state === "tooltip" ? 1 : 0,
        delay: state === "tooltip" ? 0.3 : 0,
        duration: state === "tooltip" ? 0.4 : 0.05,
      });
    };

    const getHoverState = (target) => {
      if (!(target instanceof Element)) return "default";

      if (target.closest(".tooltip")) return "tooltip";
      if (target.closest(".interactable")) return "hover";
      return "default";
    };

    const onOver = (e) => {
      if (e.pointerType === "touch") return;
      setHover(getHoverState(e.target));
    };

    const onOut = (e) => {
      if (e.pointerType === "touch") return;
      setHover(getHoverState(e.relatedTarget));
    };

    const onClick = (e) => {
      if (e.target.closest?.(".tooltip")) return;
      if (!e.target.closest?.(".interactable")) return;

      clickTl?.kill();
      gsap.killTweensOf(ring);
      gsap.killTweensOf(textboxText);
      gsap.killTweensOf(path);

      if (morphReady) gsap.set(path, { opacity: 1, morphSVG: "#hoverPath" });

      clickTl = gsap.timeline();
      clickTl
        .to(ring, { opacity: 0, scale: 2, duration: 0.3, ease: "circ.out" }, 0)
        .to(ring, { scale: 1.4, duration: 0.3, ease: "circ.out" }, 0.5)
        .to(
          ring,
          { opacity: 1, scale: 0.5, duration: 0.2, ease: "circ.out" },
          1,
        )
        .to(ring, { scale: 1, duration: 0.5, ease: "power2.out" }, 1.2);

      if (morphReady) {
        clickTl
          .to(
            path,
            { morphSVG: "#clickPath", duration: 0.5, ease: "power2.out" },
            0,
          )
          .to(
            path,
            { morphSVG: "#hoverPath", duration: 0.5, ease: "power2.out" },
            0.5,
          )
          .to(
            path,
            {
              morphSVG: "#cursorPathOriginal",
              duration: 0.3,
              ease: "power2.inOut",
            },
            1,
          );
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick);
      clickTl?.kill();
      gsap.killTweensOf([pointerWrapper, ring, path]);
    };
  });
</script>

<div bind:this={pointerWrapper} class="pointer-wrapper" style="display: none">
  <svg bind:this={ring} viewBox="0 0 1080 1080">
    <path
      id="cursorPath"
      d="M540,0 C241.8,0,0,241.8,0,540 s241.8,540,540,540,540-241.8,540-540S838.2,0,540,0Z"
      fill="var(--color-secondary)"
    />
    <path
      id="cursorPathOriginal"
      d="M540,0 C241.8,0,0,241.8,0,540 s241.8,540,540,540,540-241.8,540-540S838.2,0,540,0Z"
      fill="none"
      style="display:none"
    />
    <path
      id="hoverPath"
      d="M540,0C241.8,0,0,241.8,0,540s241.8,540,540,540,540-241.8,540-540S838.2,0,540,0ZM540,1040.6c-276.5,0-500.6-224.1-500.6-500.6S263.5,39.5,540,39.5s500.6,224.1,500.6,500.6-224.1,500.6-500.6,500.6Z"
      fill="none"
      style="display:none"
    />
    <path
      id="clickPath"
      d="M540,0C241.8,0,0,241.8,0,540s241.8,540,540,540,540-241.8,540-540S838.2,0,540,0ZM540,1069.7c-292.5,0-529.7-237.1-529.7-529.7S247.5,10.3,540,10.3s529.7,237.1,529.7,529.7-237.1,529.7-529.7,529.7Z"
      fill="none"
      style="display:none"
    />
    <g>
      <path
        d="M738.027,693.832L102.939,693.836C80.89,693.836 59.743,685.077 44.152,669.485C28.56,653.894 19.801,632.747 19.801,610.698L19.801,109.302C19.801,63.386 57.023,26.164 102.939,26.164L1884.586,26.164C1930.502,26.164 1967.724,63.386 1967.724,109.302L1967.724,451.106C1967.724,459.024 1964.24,466.54 1958.198,471.657C1952.157,476.774 1944.169,478.973 1936.36,477.67C1927.26,476.115 1917.908,475.316 1908.37,475.316C1815.978,475.316 1740.968,550.327 1740.968,642.719C1740.968,649.801 1741.409,656.781 1742.264,663.633C1743.201,671.286 1740.812,678.974 1735.702,684.748C1730.592,690.522 1723.251,693.828 1715.541,693.828L1208.027,693.832L738.027,693.832Z"
        fill="none"
        id="tooltipPath"
      />
    </g>
  </svg>
  <p bind:this={textboxText} id="textboxText">read more</p>
</div>

<style>
  .pointer-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    pointer-events: none;
    z-index: 9999;
    will-change: transform;
    overflow: visible;
  }

  .pointer-wrapper svg {
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    overflow: visible;
  }

  #textboxText {
    width: 100%;
    font-weight: 700;
    position: absolute;
    top: -31px;
    left: -5px;
    width: 130px;
    font-size: 1.21rem;
    opacity: 0;
  }
</style>
