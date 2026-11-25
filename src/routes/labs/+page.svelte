<script>
  import { onMount, tick } from "svelte";
  import { formatDateTime } from "$lib/logic/formatter";
  import { getImage, getSrcSet } from "$lib/logic/data.js";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { isDarkMode } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  import headerVideoDay from "$lib/videos/labsday.mp4";
  import headerVideoNight from "$lib/videos/labsnight.mp4";

  let { data } = $props();
  const posts = $derived(data.posts);

  let selectedCategory = $state("All");

  const allCategories = $derived([
    "All",
    ...new Set(posts.flatMap((p) => p.categories?.map((c) => c.title) || [])),
  ]);

  const filteredPosts = $derived(
    selectedCategory === "All"
      ? posts
      : posts.filter((post) =>
          post.categories?.some((cat) => cat.title === selectedCategory),
        ),
  );

  let video;
  let videoSource = $state();

  const MAX_CATEGORIES = 2;

  function getCategories(post) {
    if (!post.categories) return { visible: [], hiddenCount: 0 };
    const visible = post.categories.slice(0, MAX_CATEGORIES);
    const hiddenCount = post.categories.length - visible.length;
    return { visible, hiddenCount };
  }

  async function setVideo() {
    videoSource = isDarkMode() ? headerVideoNight : headerVideoDay;
    await tick();
    video?.load();
  }

  function animateIn(e) {
    const info = e.currentTarget.querySelector(".info");
    const button = info.querySelector("input");

    gsap.to(info, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        if (button) button.disabled = false;
      },
    });
  }

  function animateOut(e) {
    const info = e.currentTarget.querySelector(".info");
    const button = info.querySelector("input");

    gsap.to(info, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        if (button) button.disabled = true;
      },
    });
    if (button) button.disabled = true;
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const v = video;
    let trigger;

    const setupScrollScrub = () => {
      trigger?.kill();

      trigger = ScrollTrigger.create({
        trigger: v,
        start: "top top",
        end: "+=950",
        scrub: 1,
        onUpdate: (self) => {
          if (!isFinite(v.duration)) return;
          v.currentTime = v.duration * self.progress;
        },
      });
    };

    v.addEventListener("loadedmetadata", setupScrollScrub);
    if (v.readyState >= 1) setupScrollScrub();

    setVideo();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", setVideo);

    return () => {
      trigger?.kill();
      v.removeEventListener("loadedmetadata", setupScrollScrub);
      mediaQuery.removeEventListener("change", setVideo);
    };
  });
</script>

<title>althruist:labs</title>
<div id="content">
  <PageHeader id="heroHeader" className="heroHeader">
    <div class="video-container">
      <video bind:this={video} muted playsinline preload="auto" id="homeVideo">
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
    <div class="headerContent">
      <h1 class="noSelect">labs</h1>
      <h2 class="noSelect">all my projects in one spot!</h2>
    </div>
  </PageHeader>

  <section id="projectsSection">
    <Card className="categoryFilters noBounce">
      {#each allCategories as category}
        <Button
          text={category}
          active={selectedCategory === category}
          disableNavigation={true}
          onclick={() => (selectedCategory = category)}
          className="categoryButton"
          bounceIntensity="0.3"
          selectable="true"
        />
      {/each}
    </Card>

    <div class="flexCards">
      {#each filteredPosts as post}
        <Card id={post.slug.current}>
          <div
            class="imageArea"
            onmouseenter={animateIn}
            onmouseleave={animateOut}
            role="button"
            tabindex="0"
          >
            <img
              id="mainImage"
              loading="lazy"
              fetchpriority="low"
              src={getImage(post.mainImage.asset._id, 800)}
              srcset={getSrcSet(post.mainImage.asset._id)}
              alt={post.mainImage.alt}
            />
            <div class="info">
              <div class="infoContent">
                <div class="infoGroup">
                  <p class="date">{formatDateTime(post.created)}</p>
                  <div id="postCategories">
                    {#if post.featured}
                      <div>
                        <p id="featured">Featured</p>
                      </div>
                    {/if}
                    {#if post.categories && post.categories.length > 0}
                      {#each getCategories(post).visible as category}
                        <div>
                          <p>{category.title}</p>
                        </div>
                      {/each}

                      {#if getCategories(post).hiddenCount > 0}
                        <div>
                          <p>+{getCategories(post).hiddenCount}</p>
                        </div>
                      {/if}
                    {/if}
                  </div>
                  <h1 class="projectTitle">{post.title}</h1>
                </div>
              </div>
              <Button
                className="projectHitArea"
                slug={post.slug.current}
                text={`Open ${post.title}`}
              />
            </div>
          </div>
        </Card>
      {/each}
    </div>
  </section>
</div>

<style>
  #mainImage {
    width: 100%;
    transition: filter 0.3s ease-out;
  }

  .sectionTitle {
    font-family: "Althite";
    font-size: 2rem;
    margin: auto;
    padding: var(--padding-card);
    text-align: center;
    white-space: nowrap;
  }

  #postCategories {
    width: 20%;
  }

  #postCategories p {
    display: flex;
    height: 5cqh;
    align-items: center;
    justify-content: center;
  }

  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .video-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .imageArea {
    width: 30vw;
    height: 30vw;
    container-type: inline-size;
  }

  .info {
    position: absolute;
    background: linear-gradient(
      to bottom,
      var(--color-hovercard) 30%,
      transparent
    );
    z-index: 3;
    top: 0;
    left: 0;
    width: 92%;
    height: 92%;
    overflow: hidden;
    border-radius: var(--radius-card);
    align-items: center;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
    scale: 0.95;
    padding: 4%;
    opacity: 0;
  }

  .projectTitle {
    font-size: 40cqw;
    margin: 0;
    width: 100%;
    word-wrap: break-word;
    text-align: left;
  }

  .infoContent {
    width: 100%;
    scale: 0.9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  @media (hover: hover) {
    .imageArea:hover #mainImage {
      filter: blur(10px);
    }
  }

  @media (min-width: 1064px) {
    .sectionTitle {
      font-family: "Althite";
      font-size: 4rem;
      margin: auto;
      padding: 40px;
      text-align: center;
      white-space: nowrap;
    }

    .projectTitle {
      font-size: 14cqw;
      margin: 0;
      width: 100%;
      word-wrap: break-word;
      text-align: left;
    }
  }
</style>
