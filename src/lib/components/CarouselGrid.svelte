<script>
    import { gsap } from "gsap";
    import { onMount, tick } from "svelte";
    import Card from "./Card.svelte";
    import { getImage, getImageSize } from "$lib/logic/data";
    import { ObservablePatch } from "@sanity/client";
    import { getCSSVariable } from "$lib/logic/globalFunctions";

    let MorphSVGPlugin;

    if (typeof window !== "undefined") {
        import("gsap/MorphSVGPlugin").then((module) => {
            MorphSVGPlugin = module.default || module.MorphSVGPlugin;
            gsap.registerPlugin(MorphSVGPlugin);
        });
    }

    export let content = [];
    export let id;
    export let filter;
    export let name;

    let arrowLeft;
    let arrowRight;
    let seeMore;

    let carousel;
    let carouselContainer;
    let isAnimating = false;
    let itemWidth = 0;

    async function updateItemWidth() {
        await tick();
        if (carousel.children.length === 0) return;

        const firstItem = carousel.children[0];
        const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
        itemWidth = firstItem.offsetWidth + gap;
    }

    const scrollRight = async () => {
        if (isAnimating || carousel.children.length === 0) return;
        isAnimating = true;
        await updateItemWidth();

        const firstItem = carousel.children[0];
        const secondItem = carousel.children[1];

        const distance =
            secondItem.getBoundingClientRect().left -
            firstItem.getBoundingClientRect().left;

        const visualTarget = -distance;

        gsap.to(carousel, {
            x: visualTarget,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                carousel.appendChild(firstItem);
                gsap.set(carousel, { x: 0 });

                gsap.fromTo(
                    firstItem,
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.25,
                        ease: "sine.out",
                    },
                );

                isAnimating = false;
            },
        });
    };

    const scrollLeft = async () => {
        if (isAnimating || carousel.children.length === 0) return;
        isAnimating = true;
        await updateItemWidth();

        const lastItem = carousel.children[carousel.children.length - 1];

        gsap.fromTo(
            lastItem,
            {
                opacity: 1,
                scale: 1,
            },
            {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                ease: "sine.out",
                onComplete: () => {
                    carousel.insertBefore(lastItem, carousel.children[0]);

                    gsap.fromTo(
                        lastItem,
                        {
                            opacity: 0,
                            scale: 0.8,
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.2,
                            ease: "sine.out",
                        },
                    );

                    gsap.set(carousel, { x: -itemWidth });

                    gsap.to(carousel, {
                        x: 0,
                        duration: 0.2,
                        ease: "power2.out",
                        onComplete: () => {
                            isAnimating = false;
                        },
                    });
                },
            },
        );
    };

    let hoverTweens = new WeakMap();

    const enter = (obj) => {
        const tween = gsap
            .timeline({ repeat: -1, yoyo: true })
            .to(obj, {
                scale: 1.1,
                backgroundColor: getCSSVariable("--color-basic"),
                duration: 0.5,
                overwrite: "auto",
            })
            .to(
                obj.querySelector("path"),
                {
                    fill: getCSSVariable("--color-primary"),
                    duration: 0.5,
                    overwrite: "auto",
                },
                0,
            );

        gsap.to(obj.querySelector("#normal"), {
            duration: 0.5,
            morphSVG: obj.querySelector("#hover"),
            ease: "power2.out",
            overwrite: "auto",
        });

        hoverTweens.set(obj, tween);
    };

    const leave = (obj) => {
        const tween = hoverTweens.get(obj);
        if (tween) {
            tween.kill();
            hoverTweens.delete(obj);
        }

        gsap.to(obj, {
            scale: 1,
            backgroundColor: getCSSVariable("--color-primary"),
            duration: 0.5,
            overwrite: "auto",
        });
        gsap.to(obj.querySelector("path"), {
            fill: getCSSVariable("--color-basic"),
            duration: 0.5,
            overwrite: "auto",
        });

        gsap.to(obj.querySelector("#normal"), {
            duration: 0.5,
            morphSVG: obj.querySelector("#normalOriginal"),
            ease: "power2.out",
            overwrite: "auto",
        });
    };

    const down = (obj) => {
        const tween = hoverTweens.get(obj);
        if (tween) {
            tween.kill();
            hoverTweens.delete(obj);
        }

        if (
            obj.classList.contains("right") ||
            obj.classList.contains("seeMore")
        ) {
            gsap.to(obj, {
                x: 10,
                backgroundColor: getCSSVariable("--color-basic"),
                scale: 0.9,
                duration: 0.2,
                overwrite: "auto",
            });
        } else if (obj.classList.contains("left")) {
            gsap.to(obj, {
                x: -10,
                backgroundColor: getCSSVariable("--color-basic"),
                scale: 0.9,
                duration: 0.2,
                overwrite: "auto",
            });
        }
        gsap.fromTo(
            obj.querySelector("#normal"),
            { morphSVG: obj.querySelector("#hover") },
            {
                duration: 0.5,
                morphSVG: obj.querySelector("#click"),
                ease: "power2.out",
                overwrite: "auto",
            },
        );
        gsap.to(obj.querySelector("path"), {
            fill: getCSSVariable("--color-primary"),
            duration: 0.5,
            overwrite: "auto",
        });
    };

    const up = (obj) => {
        const tween = hoverTweens.get(obj);
        if (tween) {
            tween.kill();
            hoverTweens.delete(obj);
        }
        if (
            obj.classList.contains("right") ||
            obj.classList.contains("seeMore")
        ) {
            gsap.to(obj, {
                x: -10,
                backgroundColor: getCSSVariable("--color-primary"),
                scale: 1,
                duration: 0.5,
                overwrite: "auto",
            });
        } else if (obj.classList.contains("left")) {
            gsap.to(obj, {
                x: 10,
                backgroundColor: getCSSVariable("--color-primary"),
                scale: 1,
                duration: 0.5,
                overwrite: "auto",
            });
        }
        gsap.to(obj.querySelector("#normal"), {
            duration: 0.5,
            morphSVG: obj.querySelector("#hover"),
            ease: "power2.out",
            overwrite: "auto",
        });
        gsap.to(obj.querySelector("path"), {
            fill: getCSSVariable("--color-basic"),
            duration: 0.5,
            overwrite: "auto",
        });
    };

    let updateThemeColors = () => {
        const elements = [
            { element: arrowLeft, fill: arrowLeft?.querySelector("#normal") },
            { element: arrowRight, fill: arrowRight?.querySelector("#normal") },
            { element: seeMore, fill: seeMore?.querySelector("#normal") },
        ];

        elements.forEach(({ element, fill }) => {
            if (element) gsap.killTweensOf(element);
            if (fill) gsap.killTweensOf(fill);

            if (element)
                gsap.set(element, {
                    backgroundColor: getCSSVariable("--color-primary"),
                });
            if (fill) gsap.set(fill, { fill: getCSSVariable("--color-basic") });
        });
    };

    onMount(() => {
        if (window.matchMedia) {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", () => {
                    updateThemeColors();
                });
        }
    });
</script>

<div
    class="carousel-wrapper card noBounce"
    bind:this={carouselContainer}
    {id}
>
    {#if name}
        <div class="carouselHeader interactable">
            <div class="titleDIV"><h1 class="carouselTitle">{name}</h1></div>
            <button
                class="titleDIV seeMore"
                id="seeMore"
                aria-label="See more {filter} content!"
                href={filter}
                bind:this={seeMore}
                on:mouseenter={() => enter(seeMore)}
                on:mouseleave={() => leave(seeMore)}
                on:mousedown={() => down(seeMore)}
                on:mouseup={() => up(seeMore)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="rightArrow"
                    viewBox="0 0 1080 1080"
                >
                    <path
                        id="normal"
                        d="M853.4,672.4l-473.9,273.6c-102,58.9-229.4-14.7-229.4-132.4V266.4c0-117.7,127.4-191.3,229.4-132.4l473.9,273.6c102,58.9,102,206,0,264.9Z"
                    />
                    <path
                        id="normalOriginal"
                        d="M853.4,672.4l-473.9,273.6c-102,58.9-229.4-14.7-229.4-132.4V266.4c0-117.7,127.4-191.3,229.4-132.4l473.9,273.6c102,58.9,102,206,0,264.9Z"
                        fill="none"
                        style="display:none"
                    />
                    <path
                        id="hover"
                        d="M853.4,672.4l-473.9,273.6c-1,.6-2,1.2-3.1,1.7-132.4,72.7-255.7-109.6-139.8-206.4l35.7-29.8c106.9-89.3,106.9-253.6,0-342.9l-35.7-29.8c-115.9-96.8,7.4-279.1,139.8-206.4,1,.6,2,1.1,3.1,1.7l473.9,273.6c102,58.9,102,206,0,264.9h0Z"
                        fill="none"
                        style="display:none"
                    />
                    <path
                        id="click"
                        d="M968.8,599.9l-12.5,6.9c-120,66-193.9,188.1-193.9,320.2h0c0,87.5,76.9,158,168.5,152.8,83.2-4.8,149.1-70.6,149.1-151.1V153.2c0-86.6-75.3-156.8-166-153-41,1.7-78,18.3-105.1,44.2-28.7,27.4-46.5,65.2-46.5,107v1.7c0,132.1,73.9,254.2,193.9,320.2l12.5,6.9c48.4,26.6,48.4,93.1,0,119.8Z"
                        fill="none"
                        style="display:none"
                    />
                </svg>
            </button>
        </div>
    {/if}
    <div class="arrows">
        <button
            bind:this={arrowLeft}
            aria-label="Scroll Left"
            class="arrow left interactable"
            on:mouseenter={() => enter(arrowLeft)}
            on:mouseleave={() => leave(arrowLeft)}
            on:mousedown={() => down(arrowLeft)}
            on:mouseup={() => up(arrowLeft)}
            on:click={scrollLeft}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="leftArrow"
                viewBox="0 0 1080 1080"
            >
                <path
                    id="normal"
                    d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
                />
                <path
                    id="normalOriginal"
                    d="M226.6,672.4l473.9,273.6c102,58.9,229.4-14.7,229.4-132.4V266.4c0-117.7-127.4-191.3-229.4-132.4L226.6,407.6c-102,58.9-102,206,0,264.9Z"
                    fill="none"
                    style="display:none"
                />
                <path
                    id="hover"
                    d="M267,672.5c-102-58.9-102-206,0-264.9l473.9-273.6c1-.6,2-1.2,3.1-1.7,132.4-72.7,255.7,109.6,139.8,206.4l-35.7,29.8c-106.9,89.3-106.9,253.6,0,342.9l35.7,29.8c115.9,96.8-7.4,279.1-139.8,206.4-1-.6-2-1.1-3.1-1.7l-473.9-273.6h0Z"
                    fill="none"
                    style="display:none"
                />
                <path
                    id="click"
                    d="M111.2,599.9l12.5,6.9c120,66,193.9,188.1,193.9,320.2h0c0,87.5-76.9,158-168.5,152.8C65.9,1075,0,1009.1,0,928.6V153.2C0,66.6,75.3-3.7,166,.1c41,1.7,78,18.3,105.1,44.2,28.7,27.4,46.5,65.2,46.5,107v1.7c0,132.1-73.9,254.2-193.9,320.2l-12.5,6.9c-48.4,26.6-48.4,93.1,0,119.8Z"
                    fill="none"
                    style="display:none"
                />
            </svg></button
        >
        <button
            bind:this={arrowRight}
            aria-label="Scroll Right"
            class="arrow right interactable"
            on:mouseenter={() => enter(arrowRight)}
            on:mouseleave={() => leave(arrowRight)}
            on:mousedown={() => down(arrowRight)}
            on:mouseup={() => up(arrowRight)}
            on:click={scrollRight}
            ><svg
                xmlns="http://www.w3.org/2000/svg"
                id="rightArrow"
                viewBox="0 0 1080 1080"
            >
                <path
                    id="normal"
                    d="M853.4,672.4l-473.9,273.6c-102,58.9-229.4-14.7-229.4-132.4V266.4c0-117.7,127.4-191.3,229.4-132.4l473.9,273.6c102,58.9,102,206,0,264.9Z"
                />
                <path
                    id="normalOriginal"
                    d="M853.4,672.4l-473.9,273.6c-102,58.9-229.4-14.7-229.4-132.4V266.4c0-117.7,127.4-191.3,229.4-132.4l473.9,273.6c102,58.9,102,206,0,264.9Z"
                    fill="none"
                    style="display:none"
                />
                <path
                    id="hover"
                    d="M853.4,672.4l-473.9,273.6c-1,.6-2,1.2-3.1,1.7-132.4,72.7-255.7-109.6-139.8-206.4l35.7-29.8c106.9-89.3,106.9-253.6,0-342.9l-35.7-29.8c-115.9-96.8,7.4-279.1,139.8-206.4,1,.6,2,1.1,3.1,1.7l473.9,273.6c102,58.9,102,206,0,264.9h0Z"
                    fill="none"
                    style="display:none"
                />
                <path
                    id="click"
                    d="M968.8,599.9l-12.5,6.9c-120,66-193.9,188.1-193.9,320.2h0c0,87.5,76.9,158,168.5,152.8,83.2-4.8,149.1-70.6,149.1-151.1V153.2c0-86.6-75.3-156.8-166-153-41,1.7-78,18.3-105.1,44.2-28.7,27.4-46.5,65.2-46.5,107v1.7c0,132.1,73.9,254.2,193.9,320.2l12.5,6.9c48.4,26.6,48.4,93.1,0,119.8Z"
                    fill="none"
                    style="display:none"
                />
            </svg></button
        >
    </div>

    <div class="carousel" bind:this={carousel}>
        {#each content as post}
            {#if post.categories && post.categories.some((category) => category.title.toLowerCase() === filter.toLowerCase())}
                <Card className="gridItem interactable">
                    <img class = "postImg"
                        src={getImage(post.mainImage.asset._id)}
                        alt={post.mainImage.alt}
                        width={getImageSize(post.mainImage.asset._id)[0]}
                        height={getImageSize(post.mainImage.asset._id)[1]}
                    />
                    <div class="content">
                        <p class="gridContentTitle">{post.title}</p>
                    </div>
                </Card>
            {/if}
        {/each}
    </div>
</div>

<style>
    .carousel-wrapper {
        position: relative;
        overflow: hidden;
        width: 90%;
        margin: auto;
        margin-top: 20px;
        border-radius: 20px;
        background-image: var(--frosting);
        background-color: transparent;
    }

    .carousel {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 350px;
        gap: 1rem;
    }

    .arrows {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        width:100%;
        height:50px;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: 3;
    }

    .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: auto;
        background-color: var(--color-primary);
        border-radius: 20px;
        cursor: pointer;
        padding: 0.5rem 1rem;
        font-size: 1.5rem;
        border: 1px var(--color-card-outline) solid;
        box-shadow: 0px 0px 20px 2px var(--color-shadow);
        width: 50px;
        height: 100%;
    }

    .arrow.left {
        left: 1rem;
    }

    .arrow.right {
        right: 1rem;
    }

    .arrow svg {
        width: 110%;
        height: 110%;
        fill: var(--color-basic);
    }

    .titleDIV {
        background-color: var(--color-header);
        width: 250px;
        height: 50px;
        border-radius: 50px;
        margin: 20px;
        margin-left: 0;
        border: 0;
    }

    .titleDIV.seeMore {
        background-color: var(--color-primary);
    }

    .carouselTitle {
        display: flex;
        color: var(--color-basic);
        text-align: center;
        width: 100%;
        height: 100%;
        margin: 0;
        justify-content: center;
        align-items: center;
    }

    .carouselHeader {
        display: flex;
    }

    #seeMore {
        width: 48px;
        border-radius: 20px;
    }

    #seeMore svg {
        scale: 0.7;
        fill: var(--color-basic);
    }

    .postImg {
        aspect-ratio: 1/1;
        width: 100%;
        height: 100%;
    }
</style>
