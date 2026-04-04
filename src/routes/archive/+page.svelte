<script>
  import { onMount } from "svelte";
  import { client } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";
  import { getImage } from "$lib/logic/data.js";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  // import CarouselGrid from "$lib/components/CarouselGrid.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import { isDarkMode } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { goto } from "$app/navigation";

  let posts = [];

  let imgElement;
  let content;

  let selectedCategory = "All";

  $: allCategories = [
    "All",
    ...new Set(posts.flatMap((p) => p.categories?.map((c) => c.title) || [])),
  ];

  $: filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) =>
          post.categories?.some((cat) => cat.title === selectedCategory),
        );

  import headerVideoDay from "$lib/videos/day.mp4";
  import headerVideoNight from "$lib/videos/night.mp4";
  let video;
  let videoSource;

  const MAX_CATEGORIES = 2;

  function getCategories(post) {
    if (!post.categories) return { visible: [], hiddenCount: 0 };
    const visible = post.categories.slice(0, MAX_CATEGORIES);
    const hiddenCount = post.categories.length - visible.length;
    return { visible, hiddenCount };
  }

  function setVideo() {
    videoSource = isDarkMode() ? headerVideoNight : headerVideoDay;
    if (video) {
      video.load();
    }
  }

  function animateIn(e) {
    const info = e.currentTarget.querySelector(".info");
    const img = info.parentElement.querySelector("#mainImage");
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

    gsap.to(img, {
      filter: "blur(10px)",
      ease: "power2.out",
      duration: 0.3,
    });
  }

  function animateOut(e) {
    const info = e.currentTarget.querySelector(".info");
    const button = info.querySelector("input");
    const img = info.parentElement.querySelector("#mainImage");

    gsap.to(info, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        if (button) button.disabled = true;
      },
    });

    gsap.to(img, {
      filter: "blur(0px)",
      ease: "power2.out",
      duration: 0.3,
    });

    if (button) button.disabled = true;
  }

  onMount(async () => {
    gsap.registerPlugin(ScrollTrigger);

    const duration = video.duration;
    let scrollTriggerInstance;

    setVideo();

    const exposure = isDarkMode() ? 1.8 : 1;
    document
      .querySelectorAll("model-viewer")
      .forEach((v) => (v.exposure = exposure));

    const setupScrollScrub = () => {
      if (!video) return;
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      const videoDuration = video.duration;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: video,
        start: "top top",
        end: "+=650",
        scrub: 1,
        onUpdate: (self) => {
          if (video) video.currentTime = videoDuration * self.progress;
        },
      });
    };

    if (video.readyState >= 1) {
      setupScrollScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrollScrub);
    }

    posts = await client.fetch(
      '*[_type == "post"]{title,slug,mainImage{asset->{_id,url},alt},categories[]->{title},homepage,featured,subcategories[]->{title},created,body,links}',
    );

    posts.sort((a, b) => {
      if ((b.featured === true) !== (a.featured === true)) {
        return (b.featured === true) - (a.featured === true);
      }

      return new Date(b.created) - new Date(a.created);
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", welcomeHeader);
    mediaQuery.addEventListener("change", setVideo);
  });
</script>

<title>althruist:archive</title>
<div id="content">
  <PageHeader id="welcomeHeader">
    <div class="video-container">
      <video bind:this={video} muted playsinline preload="auto" id="homeVideo">
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
    <div class="headerContent">
      <h1 class="emphasis">Archive</h1>
    </div>
  </PageHeader>

  <!-- <CarouselGrid content={posts} filter="music" name="Music"></CarouselGrid>
  <CarouselGrid content={posts} filter="renders" name="Renders"></CarouselGrid>
  <CarouselGrid content={posts} filter="games" name="Games"></CarouselGrid> -->

  <section id="projectsSection">
    <h1 class="sectionTitle">- {selectedCategory} -</h1>

    <!-- Category Filter Bar -->
    <div class="categoryFilters">
      {#each allCategories as category}
        <Button
          text={category}
          active={selectedCategory === category}
          disableNavigation={true}
          on:click={() => (selectedCategory = category)}
        />
      {/each}
    </div>

    <!-- Cards Grid -->
    <div class="flexCards">
      {#each filteredPosts as post}
        <Card id={post.slug.current}>
          <div
            class="imageArea"
            on:mouseenter={animateIn}
            on:mouseleave={animateOut}
            role="button"
            tabindex="0"
          >
            <img
              id="mainImage"
              loading="lazy"
              fetchpriority="low"
              src={getImage(post.mainImage.asset._id)}
              alt={post.mainImage.alt}
            />
            <div class="info">
              <div class="infoContent">
                <div class="infoGroup">
                  <p id="date">{formatDateTime(post.created)}</p>
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
                <Button id="readmore" slug={post.slug.current} text="Read More"
                ></Button>
              </div>
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
  }

  .sectionTitle {
    font-family: "Althite";
    font-size: 2rem;
    margin: auto;
    padding: 20px;
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

  .categoryFilters {
    justify-content: center;
    display: flex;
    gap: 3rem;
    width: 100%;
    flex-wrap: wrap;
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
    border-radius: 20px;
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

  @media (min-width: 1024px) {
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
