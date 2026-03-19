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

  let posts = [];
  let featured = [];
  let featuredBody = [];
  let featuredTitle = "";
  let featuredDate = "";
  let featuredImage = "";
  let featuredLink = "";

  let imgElement;
  let content;

  import headerVideoDay from "$lib/videos/day.mp4";
  import headerVideoNight from "$lib/videos/night.mp4";
  let video;
  let videoSource;

  function setVideo() {
    videoSource = isDarkMode() ? headerVideoNight : headerVideoDay;
    if (video) {
      video.load();
    }
  }

  onMount(async () => {
    gsap.registerPlugin(ScrollTrigger);

    const duration = video.duration;
    let scrollTriggerInstance;

    setVideo();

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
      '*[_type == "post"]{title,slug,mainImage{asset->{_id,url},alt},categories[]->{title},collaborators,created,body,links}',
    );

    featured = await client.fetch(
      '*[_type == "featured"]{title, mainImage, categories, collaborators, link, updated, body}',
    );

    if (featured.length > 0) {
      const post = featured[0];
      featuredTitle = post.title;
      featuredDate = formatDateTime(post.updated);
      featuredBody = post.body;
      featuredImage = getImage(post.mainImage.asset._ref);
      featuredLink = post.link;
    }

    if (!featuredLink) {
      imgElement.style.cursor = "auto";
      featuredLink = "Image";
    } else {
      imgElement.style.cursor = "pointer";
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", welcomeHeader);
    mediaQuery.addEventListener("change", setVideo);
  });

  const travelFeaturedLink = () => {
    if (featuredLink != "Image") {
      location.href = featuredLink;
    } else {
      return;
    }
  };
</script>

<title>althruist:portfolio</title>
<div id="content">
  <PageHeader id="welcomeHeader" fetchpriority="high">
    <div class="video-container">
      <video bind:this={video} muted playsinline preload="auto" id="homeVideo" fetchpriority="high">
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
    <div class="headerContent">
      <h1 class="emphasis">
        Hiya, i'm <span class="name">Kieran</span>!
      </h1>
      <h2 class="emphasis">
        Everything I create carries meaning, intention and emotion. It's meant
        to feel personal, ranging from Games, 3D Renders and Music!
      </h2>
    </div>
  </PageHeader>

  <section id="aboutSection">
    <h1>Who am I?</h1>
  </section>

  <Card class="mainCard" id="currentProject">
    <p id="date">Current Project • {featuredDate}</p>
    <h1 class="emphasis">{featuredTitle}</h1>
    <img
      bind:this={imgElement}
      id="img"
      loading="lazy"
      fetchpriority="low"
      src={featuredImage}
      alt="preview"
      aria-label={featuredLink}
      title={featuredLink}
      on:click={travelFeaturedLink}
    />
    <div id="body" class="post-body">
      {@html renderBody(featuredBody)}
    </div>
  </Card>

  <section id="projectsSection">
    <h1>Some cool stuff I did</h1>
    <div class="flexCards">
      {#each posts as post}
        {console.log(post)}
        <Card id={post.slug.current}>
          <img
            id="mainImage"
            loading="lazy"
            fetchpriority="low"
            src={getImage(post.mainImage.asset._id)}
            alt={post.mainImage.alt}
          />
          <p id="date">{formatDateTime(post.created)}</p>
          <div id="postCategories">
            {#each post.categories as category}
              <div>
                <p>{category.title}</p>
              </div>
            {/each}
          </div>
          <h1 class="projectTitle">{post.title}</h1>
          <div class="post-body">
            {@html renderBody(post.body)}
          </div>
          <div class="postButtons">
            {#each post.links as button}
              <Button
                link={button.url}
                text={button.label}
                className="postButton"
              ></Button>
            {/each}
          </div>
        </Card>
      {/each}
    </div>
  </section>
  <!-- <CarouselGrid content={posts} filter="music" name="Music"></CarouselGrid>
  <CarouselGrid content={posts} filter="renders" name="Renders"></CarouselGrid>
  <CarouselGrid content={posts} filter="games" name="Games"></CarouselGrid> -->
</div>

<style>
  #mainImage {
    width: 100%;
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
</style>
