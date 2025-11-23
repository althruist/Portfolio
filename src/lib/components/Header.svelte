<script>
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { isMobile, getCSSVariable } from "$lib/logic/globalFunctions.js";

	let header;
	let logoHeader;
	let socials;

	let mobileButtons;

	let home;
	let portfolio;
	let contactMe;
	let about;

	let homeMobile;
	let portfolioMobile;
	let contactMeMobile;
	let aboutMobile;

	let audiotoolSocialSVG;
	let youtubeSocialSVG;
	let instagramSocialSVG;
	let linkedinSocialSVG;
	let githubSocialSVG;

	let dropDownIsOpen = false;

	function updateThemeColors() {
		const headerButtons = [home, portfolio, about, contactMe];
		const socialSVGs = [
			audiotoolSocialSVG,
			youtubeSocialSVG,
			instagramSocialSVG,
			linkedinSocialSVG,
			githubSocialSVG,
		];

		headerButtons.forEach((button) => {
			const text = button.querySelector("span");
			gsap.killTweensOf(text);
			gsap.set(text, { color: getCSSVariable("--color-header") });
		});

		socialSVGs.forEach((svg) => {
			const icon = svg.querySelector(".icon");
			gsap.killTweensOf(icon);
			gsap.set(icon, { fill: getCSSVariable("--color-header") });
		});
	}

	onMount(() => {
		updateThemeColors();

		if (window.matchMedia) {
			window
				.matchMedia("(prefers-color-scheme: dark)")
				.addEventListener("change", () => {
					updateThemeColors();
				});
		}

		const headerButtons = [home, portfolio, about, contactMe];
		const headerButtonsMobile = [
			homeMobile,
			portfolioMobile,
			aboutMobile,
			contactMeMobile,
		];
		const socialSVGs = [
			audiotoolSocialSVG,
			youtubeSocialSVG,
			instagramSocialSVG,
			linkedinSocialSVG,
			githubSocialSVG,
		];

		headerButtons.forEach((button) => {
			const overlay = button.querySelector(".headerButtonOverlay");
			const text = button.querySelector("span");

			let isHovering = false;

			gsap.set(overlay, { yPercent: 100 });

			button.addEventListener("mouseenter", () => {
				isHovering = true;
				gsap.fromTo(
					overlay,
					{ yPercent: 100 },
					{
						yPercent: 0,
						duration: 0.4,
						ease: "power2.out",
						overwrite: "auto",
					},
				);

				gsap.to(text, {
					color: getCSSVariable("--color-basic"),
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto",
				});

				gsap.to(button, {
					scale: 0.9,
					duration: 0.2,
				});
			});

			button.addEventListener("mousedown", () => {
				isHovering = false;
				gsap.to(button, {
					scale: 0.8,
					duration: 0.1,
				});
			});

			button.addEventListener("click", () => {
				let tl = gsap.timeline();

				tl.to(button, {
					scale: 0.7,
					duration: 0.1,
					ease: "circ.out",
				});
				tl.to(button, {
					scale: 1.1,
					duration: 0.2,
					ease: "circ.Out",
				});
				if (!isHovering) {
					tl.to(button, {
						scale: 1,
						duration: 0.1,
					});
				} else if (isHovering) {
					tl.to(button, {
						scale: 0.8,
						boxShadow: "0 0 0 0px",
						duration: 0.1,
					});
				}
			});

			button.addEventListener("mouseleave", () => {
				gsap.to(button, {
					scale: 1,
					duration: 0.2,
				});

				gsap.fromTo(
					overlay,
					{ yPercent: 0 },
					{
						yPercent: -100,
						duration: 0.4,
						ease: "power2.in",
						overwrite: "auto",
					},
				);

				gsap.to(text, {
					color: getCSSVariable("--color-header"),
					duration: 0.6,
					ease: "power2.out",
					overwrite: "auto",
				});
			});
		});

		headerButtonsMobile.forEach((button) => {
			const overlay = button.querySelector(".headerButtonOverlay");
			const text = button.querySelector("span");

			let isHovering = false;

			gsap.set(overlay, { yPercent: 100, opacity: 0 });

			button.addEventListener("mouseenter", () => {
				isHovering = true;
				gsap.fromTo(
					overlay,
					{ yPercent: 100 },
					{
						yPercent: 0,
						borderRadius: "10px",
						duration: 0.4,
						opacity: 1,
						ease: "power2.out",
						overwrite: "auto",
					},
				);

				gsap.to(text, {
					color: getCSSVariable("--color-basic"),
					duration: 0.3,
					ease: "power2.out",
					overwrite: "auto",
				});

				gsap.to(button, {
					scale: 0.9,
					duration: 0.2,
				});
			});

			button.addEventListener("mousedown", () => {
				isHovering = false;
				gsap.to(button, {
					scale: 0.8,
					duration: 0.1,
				});
			});

			button.addEventListener("click", () => {
				let tl = gsap.timeline();

				tl.to(button, {
					scale: 0.7,
					duration: 0.1,
					ease: "circ.out",
				});
				tl.to(button, {
					scale: 1.1,
					duration: 0.2,
					ease: "circ.Out",
				});
				if (!isHovering) {
					tl.to(button, {
						scale: 0.9,
						duration: 0.3,
					});
				} else if (isHovering) {
					tl.to(button, {
						scale: 0.8,
						boxShadow: "0 0 0 0px",
						duration: 0.1,
					});
				}
			});

			button.addEventListener("mouseleave", () => {
				gsap.to(button, {
					scale: 1,
					duration: 0.2,
				});

				gsap.fromTo(
					overlay,
					{ yPercent: 0 },
					{
						yPercent: -100,
						duration: 0.4,
						opacity: 0,
						ease: "power2.in",
						overwrite: "auto",
					},
				);

				gsap.to(text, {
					color: getCSSVariable("--color-header"),
					duration: 0.6,
					ease: "power2.out",
					overwrite: "auto",
				});
			});
		});

		function handleResize(e) {
			if (!logoHeader) return;

			const logoBox = logoHeader.getBoundingClientRect();

			if (e.matches) {
				gsap.set(header, {
					marginTop: "5%",
					padding: "10px",
					width: logoBox.width,
					borderRadius: "50px",
				});
				mobileButtons.style.display = dropDownIsOpen ? "grid" : "none";
				socials.style.display = dropDownIsOpen ? "flex" : "none";
			} else {
				dropDownIsOpen = false;

				gsap.set(header, {
					marginTop: "10px",
					borderRadius: "20px",
					width: "90%",
					height: "auto",
					y: 0,
				});

				mobileButtons.style.display = "none";
				socials.style.display = "flex";
				gsap.set(socials, { opacity: 1 });
			}
		}

		const mediaQuery = window.matchMedia("(max-width: 1023px)");
		mediaQuery.addEventListener("change", handleResize);
		handleResize(mediaQuery);

		socialSVGs.forEach((svg) => {
			const parent = svg.parentElement;

			parent.addEventListener("mouseenter", () => {
				gsap.to(svg.querySelector(".icon"), {
					fill: getCSSVariable("--color-header"),
					duration: 0.2,
				});
				gsap.to(parent, {
					scale: 1.3,
					duration: 0.2,
				});
			});

			parent.addEventListener("mouseleave", () => {
				gsap.to(svg.querySelector(".icon"), {
					duration: 0.2,
				});
				gsap.to(parent, {
					scale: 1,
					duration: 0.2,
				});
			});
		});

		logoHeader.addEventListener("click", () => {
			gsap.fromTo(
				logoHeader,
				{ scale: 1 },
				{
					scale: 0.7,
					duration: 0.1,
					ease: "sine.out",
					repeat: 1,
					yoyo: true,
				},
			);

			if (isMobile()) {
				if (!dropDownIsOpen) {
					dropDownIsOpen = true;

					let timelineOpen = gsap.timeline();
					let timelineOpen2 = gsap.timeline();

					gsap.set(socials, { opacity: 0 });

					timelineOpen2
						.to(logoHeader, {
							y: "25",
							duration: 0.2,
							ease: "sine.inOut",
							onComplete: () => {
								mobileButtons.style.display = "grid";
							},
						})
						.to(logoHeader, {
							y: "0",
							duration: 0.5,
							ease: "sine.out",
						})
						.to(socials, {
							opacity: 1,
						});

					timelineOpen
						.to(header, {
							y: "20",
							duration: 0.1,
							ease: "sine.out",
							delay: 0.1,
						})
						.to(header, {
							marginTop: "0",
							borderRadius: 0,
							paddingLeft: 0,
							width: "100%",
							y: "0",
							height: "100%",
							duration: 0.5,
							ease: "circ.out",
						});
					let multiplier = 0;
					headerButtonsMobile.forEach((button) => {
						gsap.set(button, { opacity: 0, height: "0%" });
						multiplier++;
						gsap.to(button, {
							height: "100%",
							opacity: 1,
							duration: 0.5,
							delay: 0.1 * multiplier,
							onComplete: () => {
								socials.style.display = "flex";
							},
						});
					});
				} else {
					dropDownIsOpen = false;

					let timelineClose = gsap.timeline();
					let timelineClose2 = gsap.timeline();

					let multiplier = 0;
					let buttonsAnimated = 0;

					headerButtonsMobile.forEach((button) => {
						multiplier++;
						gsap.to(socials, {
							opacity: 0,
							duration: 0.3,
						});
						gsap.to(button, {
							height: "0%",
							opacity: 0,
							duration: 0.2,
							delay: 0.1 * multiplier,
							onComplete: () => {
								buttonsAnimated++;

								if (
									buttonsAnimated ===
									headerButtonsMobile.length
								) {
									mobileButtons.style.display = "none";
									socials.style.display = "none";

									timelineClose
										.to(header, {
											width: "100px",
											borderRadius: "50px",
											height: "auto",
											duration: 0.2,
											ease: "circ.out",
										})
										.to(header, {
											paddingLeft: "10px",
											y: "-20",
											duration: 0.2,
											ease: "circ.out",
										})
										.to(header, {
											marginTop: "5%",
											y: "0",
											duration: 0.3,
											ease: "sine.out",
										});

									timelineClose2
										.to(logoHeader, {
											y: "-20",
											duration: 0.3,
											ease: "sine.out",
											delay: 0.2,
										})
										.to(logoHeader, {
											y: "0",
											duration: 0.3,
											ease: "sine.out",
										});
								}
							},
						});
					});
				}
				return;
			}

			transition.style.display = "flex";

			gsap.to(transition, {
				opacity: "1",
				duration: 0.3,
				ease: "sine.out",
				onComplete: () => {
					location.reload();
				},
			});

			gsap.to(logoTransition, {
				opacity: "1",
				duration: 0.2,
				scale: 1,
				ease: "sine.out",
			});
		});

		let hoverAnim;
		logoHeader.addEventListener("mouseenter", () => {
			hoverAnim = gsap.to(logoHeader.querySelector(".logo"), {
				x: gsap.utils.random(50, -50),
				y: gsap.utils.random(50, -50),
				yoyo: true,
				repeat: -1,
				duration: 0.3,
				ease: "sine.inOut",
			});
		});

		logoHeader.addEventListener("mouseleave", () => {
			hoverAnim.kill();
			hoverAnim = null;

			gsap.to(logoHeader.querySelector(".logo"), {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: "circ.out",
			});
		});
	});
</script>

<header bind:this={header} id="header" class="card noBounce">
	<div id="left">
		<svg
			bind:this={logoHeader}
			id="logoHeader"
			version="1.2"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1000 1000"
		>
			<path
				id="Color Fill 1"
				fill-rule="evenodd"
				class="logo interactable"
				d="m553.9 225.8c27.9 3.4 72.2 35.2 95 48.7 84 50.1 173.4 96.9 236.2 168.2-2.6 46.3-58.8 78.4-93.7 93.7-15.5 6.9-38 14.2-47.5 27-9.6 13-13.7 29.4-26.9 38.5q-11.6 5.8-23.1 11.6c-16.8 20.5-35.7 45.4-57.8 60.3-14.8 10-28.6 24.5-43.7 32.1q-9 2.6-17.9 5.1c-19.9 17.7-36.2 59.2-68.1 62.9-40.5 4.8-58.9-43.3-80.9-62.9q-8.9-2.5-17.9-5.1c-15.1-7.6-28.9-22.1-43.7-32.1-22-14.9-41-39.8-57.8-60.3q-11.5-5.8-23.1-11.6c-13.2-9.1-17.3-25.5-26.9-38.5-9.5-12.8-32-20.1-47.5-27-35-15.4-88.7-46.8-93.7-91.1 73.6-87.1 207-159.8 314.5-213.1q9 25 18 50.1c8.3 12.3 22.7 18.4 28.2 34.6 6 17.9 9.9 48.3 14.1 64.2q2 24.4 3.9 48.8 0.6-1.3 1.3-2.6c7.6-10.9 18.8-35.9 14.1-56.5-1.4-6.3-8.4-14.3-5.1-25.6q15.4-23.8 30.8-47.5c-7.4-43.8 5.7-40.6 19.2-71.9z"
			/>
		</svg>
		<nav class="buttons">
			<a
				bind:this={home}
				aria-label="Home"
				class="headerButton interactable"
				href="/"
				><span>Home</span>
				<div class="headerButtonOverlay"></div>
			</a>
			<a
				bind:this={portfolio}
				aria-label="portfolio"
				class="headerButton interactable"
				href="/portfolio"
				><span>Portfolio</span>
				<div class="headerButtonOverlay"></div>
			</a>
			<a
				bind:this={about}
				aria-label="about"
				class="headerButton interactable"
				href="/about"
				><span>About</span>
				<div class="headerButtonOverlay"></div>
			</a>
			<a
				bind:this={contactMe}
				aria-label="contactMe"
				class="headerButton interactable"
				href="/contactme"
				><span>Contact</span>
				<div class="headerButtonOverlay"></div>
			</a>
		</nav>
	</div>
	<div class="buttons_mobile" bind:this={mobileButtons}>
		<a
			bind:this={homeMobile}
			aria-label="Home"
			class="headerButton interactable"
			href="/"
			><span>Home</span>
			<div class="headerButtonOverlay"></div>
		</a>
		<a
			bind:this={portfolioMobile}
			aria-label="portfolio"
			class="headerButton interactable"
			href="/portfolio"
			><span>Portfolio</span>
			<div class="headerButtonOverlay"></div>
		</a>
		<a
			bind:this={aboutMobile}
			aria-label="about"
			class="headerButton interactable"
			href="/about"
			><span>About</span>
			<div class="headerButtonOverlay"></div>
		</a>
		<a
			bind:this={contactMeMobile}
			aria-label="contactMe"
			class="headerButton interactable"
			href="/contactme"
			><span>Contact</span>
			<div class="headerButtonOverlay"></div>
		</a>
	</div>
	<div class="socials" bind:this={socials}>
		<a
			aria-label="LinkedIn"
			href="https://www.linkedin.com/in/althruist/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg
				bind:this={linkedinSocialSVG}
				class="socialSVG interactable"
				id="linkedinLogo"
				version="1.2"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -5 375 375"
			>
				<path
					class="icon"
					d="M337.1,0H26.5C12,0,.2,11.7,0,26.2v311.6c.2,14.5,12,26.2,26.5,26.2h310.8c14.6,0,26.4-11.7,26.6-26.2h0V26.2c-.2-14.5-12.1-26.2-26.6-26.2h-.4,0ZM108,310.2h-54.1v-173.7h54.1v173.7ZM80.9,112.7c-17.3,0-31.3-14-31.3-31.3s14-31.3,31.3-31.3,31.3,14,31.3,31.3h0c0,17.3-14,31.3-31.3,31.3h0,0ZM310.1,310.2h-53.9v-84.5c0-20.1-.4-46.1-28.1-46.1s-32.4,21.9-32.4,44.6v86h-53.9v-173.7h51.8v23.7h.7c10-16.9,28.2-28.1,49-28.1s1.5,0,2.2,0h-.1c54.6,0,64.7,35.9,64.7,82.7v95.3h0Z"
				/>
			</svg>
		</a>
		<a
			aria-label="Audiotool"
			href="https://www.audiotool.com/user/Akridiki"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg
				bind:this={audiotoolSocialSVG}
				class="socialSVG interactable"
				id="audiotoolLogo"
				version="1.2"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -5 375 375"
			>
				<path
					class="icon"
					d="m185.5 36.5c7.7 0.2 18.1 1.1 23 2 4.9 0.9 13.3 3 18.5 4.7 5.2 1.7 14.4 5.5 20.5 8.4 6.1 3 15.1 8.3 20 11.9 4.9 3.5 13.7 11.2 19.5 17.2 5.8 5.9 13.1 14.6 16.2 19.3 3.1 4.7 7.7 12.5 10.2 17.5 2.4 5 6 13.7 7.9 19.5 1.9 5.8 4.3 15 5.3 20.5 1.7 9.1 1.9 15.9 1.9 74.5 0 58.8-0.2 65-1.7 69.8-1 2.8-3.3 7.3-5.1 10-1.9 2.6-5.7 6.6-8.5 9-3.5 2.8-7.4 4.9-11.9 6.2-3.8 1.1-8.8 2-11.3 2-2.5 0-7.4-0.8-11-1.9-3.6-1.1-8.7-3.6-11.5-5.7-2.7-2-6.6-5.6-12-12.2l-8.5 4.3c-4.7 2.4-13.2 5.9-19 7.8-5.8 1.9-15 4.3-20.5 5.3-7 1.3-14.7 1.9-25.5 1.8-10.1 0-18.7-0.6-24.5-1.7-4.9-0.9-13.9-3.2-20-5.2-6.1-1.9-15.6-5.9-21.3-8.8-5.6-2.8-14.1-8-19-11.4-4.8-3.4-13.4-11-19.2-17-5.8-5.9-13.3-14.9-16.6-19.8-3.3-4.9-8.1-13.3-10.6-18.5-2.5-5.2-5.9-13.8-7.6-19-1.7-5.2-3.8-13.6-4.7-18.5-0.9-4.9-1.9-14.8-2.2-22-0.4-10.4-0.1-15.5 1.6-25.7 1.2-7.1 3.5-17.2 5.2-22.5 1.7-5.4 5.1-13.8 7.4-18.8 2.4-4.9 7.1-13.3 10.6-18.5 4-6 10.7-14 18.3-21.6 8.5-8.5 15.1-14.1 22.1-18.7 5.5-3.6 13.8-8.3 18.5-10.5 4.7-2.2 12.8-5.3 18-7 5.2-1.7 13.8-3.8 19-4.6 5.2-0.9 10.6-1.8 12-2 1.4-0.3 8.8-0.3 16.5-0.1zm-23.5 81c-3 0.9-8.7 3.4-12.5 5.3-4.8 2.5-9.5 6.1-15.1 11.7-6 5.9-9 10-12.1 16-2.2 4.4-4.8 10.9-5.8 14.5-1.4 4.7-1.9 9.8-1.8 18 0 9.4 0.5 12.9 2.5 19 1.3 4.1 4.2 10.7 6.3 14.5 2.2 4 6.9 10 11 14 3.8 3.9 9.9 8.7 13.5 10.8 3.6 2.1 10.1 4.9 14.5 6.3 6.8 2.2 9.9 2.7 20 2.7 10.9 0 12.8-0.3 21-3.1 4.9-1.8 11.5-4.7 14.5-6.4 3-1.8 8.9-6.7 13-10.8 5.7-5.7 8.5-9.5 11.7-16 2.3-4.7 5-11.4 5.9-15 1.2-4.4 1.7-10.1 1.7-17.5-0.1-8.7-0.6-12.5-2.5-18.5-1.3-4.1-4-10.4-6-14-2-3.6-6.1-9.2-9-12.4-2.9-3.3-7.8-7.6-10.8-9.6-3-2.1-7.5-4.7-10-6-2.5-1.3-7.4-3.1-11-4.1-3.6-1.1-10.3-2.1-15-2.3-4.7-0.3-10.7-0.1-13.5 0.3-2.7 0.4-7.5 1.6-10.5 2.6z"
				/>
			</svg>
		</a>

		<a
			aria-label="YouTube"
			href="https://youtube.com/@althruistic"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg
				bind:this={youtubeSocialSVG}
				class="socialSVG interactable"
				id="youtubeLogo"
				version="1.2"
				xmlns="https://www.w3.org/2000/svg"
				viewBox="-0.5 -0.6 25 25"
			>
				<path
					class="icon"
					d="M23.498 6.186a3 3 0 0 0-2.113-2.121C19.43 3.5 12 3.5 12 3.5s-7.43 0-9.385.565A3 3 0 0 0 .502 6.186C0 8.165 0 12 0 12s0 3.835.502 5.814a3 3 0 0 0 2.113 2.121C4.57 20.5 12 20.5 12 20.5s7.43 0 9.385-.565a3 3 0 0 0 2.113-2.121C24 15.835 24 12 24 12s0-3.835-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"
				/>
			</svg>
		</a>

		<a
			aria-label="Instagram"
			href="https://instagram.com/althruistic_"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg
				bind:this={instagramSocialSVG}
				class="socialSVG interactable"
				id="instagramLogo"
				version="1.2"
				xmlns="https://www.w3.org/2000/svg"
				viewbox="-2 -2 28 28"
			>
				<path
					class="icon"
					d="M11.9962 0.0078125C8.73824 0.0078125 8.32971 0.021622 7.05019 0.080003C5.77333 0.138241 4.90129 0.341051 4.13824 0.637622C3.34938 0.944146 2.68038 1.35434 2.01343 2.02124C1.34652 2.68819 0.936333 3.35719 0.629809 4.14605C0.333238 4.9091 0.130429 5.78115 0.0721905 7.058C0.0138095 8.33753 0 8.74605 0 12.0041C0 15.262 0.0138095 15.6705 0.0721905 16.9501C0.130429 18.2269 0.333238 19.099 0.629809 19.862C0.936333 20.6509 1.34652 21.3199 2.01343 21.9868C2.68038 22.6537 3.34938 23.0639 4.13824 23.3705C4.90129 23.667 5.77333 23.8698 7.05019 23.9281C8.32971 23.9864 8.73824 24.0002 11.9962 24.0002C15.2542 24.0002 15.6627 23.9864 16.9422 23.9281C18.2191 23.8698 19.0911 23.667 19.8542 23.3705C20.643 23.0639 21.312 22.6537 21.979 21.9868C22.6459 21.3199 23.0561 20.6509 23.3627 19.862C23.6592 19.099 23.862 18.2269 23.9202 16.9501C23.9786 15.6705 23.9924 15.262 23.9924 12.0041C23.9924 8.74605 23.9786 8.33753 23.9202 7.058C23.862 5.78115 23.6592 4.9091 23.3627 4.14605C23.0561 3.35719 22.6459 2.68819 21.979 2.02124C21.312 1.35434 20.643 0.944146 19.8542 0.637622C19.0911 0.341051 18.2191 0.138241 16.9422 0.080003C15.6627 0.021622 15.2542 0.0078125 11.9962 0.0078125ZM7.99748 12.0041C7.99748 14.2125 9.78776 16.0028 11.9962 16.0028C14.2047 16.0028 15.995 14.2125 15.995 12.0041C15.995 9.79557 14.2047 8.00529 11.9962 8.00529C9.78776 8.00529 7.99748 9.79557 7.99748 12.0041ZM5.836 12.0041C5.836 8.60181 8.594 5.84381 11.9962 5.84381C15.3984 5.84381 18.1564 8.60181 18.1564 12.0041C18.1564 15.4062 15.3984 18.1642 11.9962 18.1642C8.594 18.1642 5.836 15.4062 5.836 12.0041ZM18.3998 7.03996C19.1949 7.03996 19.8394 6.39548 19.8394 5.60043C19.8394 4.80538 19.1949 4.16086 18.3998 4.16086C17.6048 4.16086 16.9603 4.80538 16.9603 5.60043C16.9603 6.39548 17.6048 7.03996 18.3998 7.03996Z"
				/>
			</svg>
		</a>
		<a
			aria-label="GitHub"
			href="https://github.com/althruist"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg
				bind:this={githubSocialSVG}
				class="socialSVG interactable"
				id="githubLogo"
				version="1.2"
				xmlns="https://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
			>
				<path
					class="icon"
					d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
				/>
			</svg>
		</a>
	</div>
</header>

<style>
	.logo {
		fill: var(--color-header);
		cursor: pointer;
	}

	#logoHeader {
		width: 80px;
	}
</style>
