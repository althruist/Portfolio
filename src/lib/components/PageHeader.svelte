<script>
    import { page } from "$app/state";
    import gsap from "gsap";
    import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    export let pageHeader;

    export let id = "";
    export let className = "";
    export let style = "";

    let isHovering = false;
    let tween;

    onMount(() => {
        if (className != "") {
            className = ` ${className}`;
        }

        gsap.registerPlugin(ScrambleTextPlugin);

        pageHeader.addEventListener("mouseenter", () => {
            if (isHovering) return;
            isHovering = true;

            gsap.to(pageHeader.querySelector(".name"), {
                duration: 1,
                scrambleText: {
                    text: "althruist",
                    chars: "kailetrhaunist",
                    revealDelay: 0,
                    speed: 1,
                },
            });

            const emphasis = pageHeader.querySelectorAll(".emphasis");

            tween = gsap.to(emphasis, {
                x: gsap.utils.random(-4, 4),
                y: gsap.utils.random(-4, 4),
                duration: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "power3.inOut",
                onRepeat: function () {
                    gsap.to(emphasis, {
                        x: gsap.utils.random(-4, 4),
                        y: gsap.utils.random(-4, 4),
                        duration: 0.1,
                        ease: "power3.inOut",
                    });
                },
            });
        });

        pageHeader.addEventListener("mouseleave", () => {
            if (tween) {
                tween.kill();
            }
            
            isHovering = false;

            gsap.to(pageHeader.querySelector(".name"), {
                duration: 1,
                scrambleText: {
                    text: "kieran",
                    chars: "kailetrhaunist",
                    revealDelay: 0,
                    speed: 1,
                },
            });
        });
    });
</script>

<div bind:this={pageHeader} {id} class="pageHeader{className}" {style}>
    <slot />
</div>
