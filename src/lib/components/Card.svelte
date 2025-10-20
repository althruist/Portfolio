<script>
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    export let card;

    export let id = "";
    export let className = "";
    export let style = "";

    let isHovering = false;

    onMount(() => {
        if (className != "") {
            className = ` ${className}`;
        }

        gsap.registerPlugin(ScrollTrigger);

        const addBounce = () => {
            card.addEventListener("mouseenter", bounceEnter);
            card.addEventListener("mouseleave", bounceLeave);
            card.addEventListener("click", bounceClick);
        };

        const removeBounce = () => {
            card.removeEventListener("mouseenter", bounceEnter);
            card.removeEventListener("mouseleave", bounceLeave);
            card.removeEventListener("click", bounceClick);
        };

        const bounceEnter = () => {
            card.style.zIndex = 2;
            gsap.to(card, { scale: 1.1, duration: 0.5, ease: "circ.out" });
        };

        const bounceLeave = () => {
            card.style.zIndex = 1;
            gsap.to(card, { scale: 1, duration: 0.5, ease: "circ.out" });
        };

        const bounceClick = () => {
            let tlClick = gsap.timeline();
            tlClick.to(card, {
                rotation: gsap.utils.random(-4, 4),
                scale: 1,
                duration: 0.1,
                ease: "sine.out",
            });
            tlClick.to(card, {
                rotation: 0,
                scale: 1.1,
                duration: 0.2,
                ease: "sine.out",
            });
        };

        if (!card.classList.contains("noBounce")) {
            addBounce();
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    if (card.classList.contains("noBounce")) {
                        removeBounce();
                    } else {
                        addBounce();
                    }
                }
            });
        });

        observer.observe(card, { attributes: true });

        if (card.classList.contains("instantShow")) return;
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            card,
            { scale: 0.9, opacity: 0, y: 50 },
            { scale: 1.1, opacity: 1, y: 0, duration: 0.3 },
        ).to(card, { scale: 1, duration: 0.5 });

        if (id == "welcomeHeader") {
            card.addEventListener("mouseenter", () => {
                if (isHovering) return;
                isHovering = true;
                gsap.to(card.querySelector(".name"), {
                    duration: 1,
                    scrambleText: {
                        text: "althruist",
                        chars: "kailetrhaunist",
                        revealDelay: 0,
                        speed: 1,
                    },
                });
            });

            card.addEventListener("mouseleave", () => {
                isHovering = false;
                gsap.to(card.querySelector(".name"), {
                    duration: 1,
                    scrambleText: {
                        text: "kieran",
                        chars: "kailetrhaunist",
                        revealDelay: 0,
                        speed: 1,
                    },
                });
            });
        }
    });
</script>

<div bind:this={card} {id} class="card{className}" {style}>
    <slot />
</div>
