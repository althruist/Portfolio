<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";

    let pointerWrapper;
    let ring;

    onMount(() => {
        let morphReady = false;
        import("gsap/MorphSVGPlugin").then((m) => {
            gsap.registerPlugin(m.default || m.MorphSVGPlugin);
            morphReady = true;
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

        let hovering = false;
        let clickTl;

        const setHover = (on) => {
            if (on === hovering) return;
            hovering = on;
            clickTl?.kill();
            gsap.killTweensOf(ring);
            gsap.killTweensOf(path);

            if (on) {
                morph("#hoverPath", { duration: 0.5, ease: "power2.out" });
                gsap.to(ring, { scale: 1.4, duration: 0.3, ease: "circ.out" });
            } else {
                morph("#cursorPathOriginal", {
                    duration: 0.3,
                    ease: "power2.inOut",
                });
                gsap.to(ring, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.2,
                    ease: "circ.out",
                });
            }
        };

        const onOver = (e) => setHover(!!e.target.closest?.(".interactable"));
        const onOut = (e) => {
            if (!e.relatedTarget) setHover(false);
        };

        const onClick = (e) => {
            if (!e.target.closest?.(".interactable")) return;

            clickTl?.kill();
            gsap.killTweensOf(ring);
            gsap.killTweensOf(path);

            if (morphReady) gsap.set(path, { opacity: 1, morphSVG: "#hoverPath" });

            clickTl = gsap.timeline();
            clickTl
                .to(ring, { opacity: 0, scale: 2, duration: 0.3, ease: "circ.out" }, 0)
                .to(ring, { scale: 1.4, duration: 0.3, ease: "circ.out" }, 0.5)
                .to(ring, { opacity: 1, scale: 0.5, duration: 0.2, ease: "circ.out" }, 1)
                .to(ring, { scale: 1, duration: 0.5, ease: "power2.out" }, 1.2);

            if (morphReady) {
                clickTl
                    .to(path, { morphSVG: "#clickPath", duration: 0.5, ease: "power2.out" }, 0)
                    .to(path, { morphSVG: "#hoverPath", duration: 0.5, ease: "power2.out" }, 0.5)
                    .to(path, { morphSVG: "#cursorPathOriginal", duration: 0.3, ease: "power2.inOut" }, 1);
            }
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerover", onOver, { passive: true });
        document.addEventListener("pointerout", onOut, { passive: true });
        document.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerover", onOver);
            document.removeEventListener("pointerout", onOut);
            document.removeEventListener("click", onClick);
            clickTl?.kill();
            gsap.killTweensOf([pointerWrapper, ring, path]);
        };
    });
</script>

<div
    bind:this={pointerWrapper}
    class="pointer-wrapper"
    style="display: none"
>
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
    </svg>
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
    }

    .pointer-wrapper svg {
        width: 100%;
        height: 100%;
        transform-origin: 50% 50%;
    }
</style>