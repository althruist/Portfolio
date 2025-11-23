<script>
	import "$lib/styles/fonts.css";
	import "$lib/styles/global.css";

	import lightFavicon from "$lib/images/SVG/Favicons/Light.ico";
	import darkFavicon from "$lib/images/SVG/Favicons/Dark.ico";

	import Header from "$lib/components/Header.svelte";
	import Cursor from "$lib/components/Cursor.svelte";
	import gsap from "gsap";

	import { onMount } from "svelte";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
	import Page from "./+page.svelte";
	import { isDarkMode } from "$lib/logic/globalFunctions";

	let { children } = $props();

	let background;
	let transition;
	let logoTransition;
	let circlePointer;

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

	onMount(async () => {
		const gsapModule = await import("gsap");
		const gsap = gsapModule.default;

		injectAnalytics();
		injectSpeedInsights();

		const { ScrollSmoother } = await import("gsap/ScrollSmoother");

		gsap.registerPlugin(ScrollSmoother);

		ScrollSmoother.create({
			smoothWrapper,
			content,
			smooth: 1,
			effects: true,
		});

		updateFavicon();
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", updateFavicon);

		transition.style.display = "flex";

		gsap.to(transition, {
			opacity: "0",
			duration: 0.5,
			ease: "sine.out",
			onComplete: () => {
				transition.style.display = "none";
			},
		});

		gsap.to(logoTransition, {
			opacity: "0",
			duration: 0.2,
			scale: 1.5,
			ease: "sine.out",
		});
	});
</script>

<svelte:head>
	<meta property="og:title" content="althruist:portfolio" />
	<meta
		property="og:description"
		content="This website brings you to a library of althruist's works, ranging from music, digital arts, game development and more! You can also find althruist's contact information here. Have a look! :)"
	/>
	<meta name="description" content="This website brings you to a library of althruist's works, ranging from music, digital arts, game development and more! You can also find althruist's contact information here. Have a look! :)">
	<meta property="og:image" content="https://althruist.fyi/images/preview.jpg" />
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

<div bind:this={transition} id="transition">
	<svg
		bind:this={logoTransition}
		id="logoTransition"
		version="1.2"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1000 1000"
	>
		<path
			id="Color Fill 2"
			fill-rule="evenodd"
			class="logo transition"
			d="m553.9 225.8c27.9 3.4 72.2 35.2 95 48.7 84 50.1 173.4 96.9 236.2 168.2-2.6 46.3-58.8 78.4-93.7 93.7-15.5 6.9-38 14.2-47.5 27-9.6 13-13.7 29.4-26.9 38.5q-11.6 5.8-23.1 11.6c-16.8 20.5-35.7 45.4-57.8 60.3-14.8 10-28.6 24.5-43.7 32.1q-9 2.6-17.9 5.1c-19.9 17.7-36.2 59.2-68.1 62.9-40.5 4.8-58.9-43.3-80.9-62.9q-8.9-2.5-17.9-5.1c-15.1-7.6-28.9-22.1-43.7-32.1-22-14.9-41-39.8-57.8-60.3q-11.5-5.8-23.1-11.6c-13.2-9.1-17.3-25.5-26.9-38.5-9.5-12.8-32-20.1-47.5-27-35-15.4-88.7-46.8-93.7-91.1 73.6-87.1 207-159.8 314.5-213.1q9 25 18 50.1c8.3 12.3 22.7 18.4 28.2 34.6 6 17.9 9.9 48.3 14.1 64.2q2 24.4 3.9 48.8 0.6-1.3 1.3-2.6c7.6-10.9 18.8-35.9 14.1-56.5-1.4-6.3-8.4-14.3-5.1-25.6q15.4-23.8 30.8-47.5c-7.4-43.8 5.7-40.6 19.2-71.9z"
		/>
	</svg>
</div>

<div id="background-wrapper">
	<div bind:this={background} id="background"></div>
</div>

<Header />
<Cursor />

<div id="smooth-wrapper" bind:this={smoothWrapper}>
	<div bind:this={content} id="content">{@render children?.()}</div>
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

	#logoTransition {
		width: 50vh;
		height: 50vh;
	}

	#transition {
		background-color: black;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 10000;
		opacity: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.transition {
		fill: #fff;
	}
</style>
