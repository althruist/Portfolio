<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

    gsap.registerPlugin(MorphSVGPlugin);

    let pointerWrapper;

    onMount(() => {
        pointerWrapper.style.display = "none";

        function updateCursor(e) {
            if (!pointerWrapper) {
                return;
            }
            if (e.pointerType === "mouse") {
                pointerWrapper.style.display = "block";
            } else if (e.pointerType === "touch") {
                pointerWrapper.style.display = "none";
            }
        }

        window.addEventListener("pointermove", updateCursor);

        let mouseX = 0,
            mouseY = 0;
        let currentX = 0,
            currentY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            const { width: w, height: h } =
                pointerWrapper.getBoundingClientRect();
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            pointerWrapper.style.transform = `translate(${currentX - w / 2}px, ${currentY - h / 2}px)`;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        const attachListeners = () => {
            document.querySelectorAll(".interactable").forEach((el) => {
                if (!el.dataset.listenerAdded) {
                    el.addEventListener("mouseenter", () => {
                        gsap.killTweensOf(pointerWrapper);
                        gsap.killTweensOf("#cursorPath");

                        gsap.to("#cursorPath", {
                            duration: 0.5,
                            morphSVG: "#hoverPath",
                            ease: "power2.out",
                        });

                        gsap.to(pointerWrapper, {
                            duration: 0.3,
                            width: 70,
                            height: 70,
                            ease: "circ.out",
                        });
                    });

                    el.addEventListener("mouseleave", () => {
                        gsap.killTweensOf(pointerWrapper);
                        gsap.killTweensOf("#cursorPath");

                        gsap.to("#cursorPath", {
                            duration: 0.3,
                            morphSVG: "#cursorPathOriginal",
                            ease: "power2.inOut",
                        });

                        gsap.to(pointerWrapper, {
                            opacity: 1,
                            duration: 0.2,
                            width: 50,
                            height: 50,
                            ease: "circ.out",
                        });
                    });

                    el.addEventListener("click", () => {
                        gsap.killTweensOf(pointerWrapper);
                        gsap.killTweensOf("#cursorPath");

                        gsap.set("#cursorPath", {
                            opacity: 1,
                            morphSVG: "#hoverPath",
                        });

                        gsap.to("#cursorPath", {
                            duration: 0.5,
                            morphSVG: "#clickPath",
                            ease: "power2.out",
                            onComplete: () => {
                                gsap.to("#cursorPath", {
                                    duration: 0.5,
                                    morphSVG: "#hoverPath",
                                    ease: "power2.out",
                                    onComplete: () => {
                                        gsap.to("#cursorPath", {
                                            duration: 0.3,
                                            morphSVG: "#cursorPathOriginal",
                                            ease: "power2.inOut",
                                        });

                                        gsap.to(pointerWrapper, {
                                            opacity: 1,
                                            duration: 0.2,
                                            width: 25,
                                            height: 25,
                                            ease: "circ.out",
                                            onComplete: () => {
                                                gsap.to(pointerWrapper, {
                                                    opacity: 1,
                                                    duration: 0.5,
                                                    width: 50,
                                                    height: 50,
                                                    ease: "power2.out",
                                                });
                                            },
                                        });
                                    },
                                });

                                gsap.to(pointerWrapper, {
                                    duration: 0.3,
                                    width: 70,
                                    height: 70,
                                    ease: "circ.out",
                                });
                            },
                        });

                        gsap.to(pointerWrapper, {
                            opacity: 0,
                            duration: 0.3,
                            width: 100,
                            height: 100,
                            ease: "circ.out",
                        });
                    });

                    el.dataset.listenerAdded = "true";
                }
            });
        };

        attachListeners();
        const observer = new MutationObserver(attachListeners);
        observer.observe(document.body, { childList: true, subtree: true });
    });
</script>

<div bind:this={pointerWrapper} class="pointer-wrapper">
    <svg viewBox="0 0 1080 1080">
        <path
            id="cursorPath"
            d="M540,0 C241.8,0,0,241.8,0,540 s241.8,540,540,540,540-241.8,540-540S838.2,0,540,0Z"
            fill="var(--color-cursor)"
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
            xmlns="http://www.w3.org/2000/svg"
            class="cls-1"
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
        width: 50px;
        height: 50px;
        pointer-events: none;
        transform-origin: 50% 50%;
        z-index: 9999;
    }

    .pointer-wrapper svg {
        width: 100%;
        height: 100%;
    }
</style>
