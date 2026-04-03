<script>
  import { onMount, tick } from "svelte";
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
  let featuredCategories = {};

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

    // featured = await client.fetch(
    //   '*[_type == "featured"]{title, mainImage, categories, collaborators, link, updated, body}',
    // );

    // if (featured.length > 0) {
    //   const post = featured[0];
    //   featuredTitle = post.title;
    //   featuredDate = formatDateTime(post.updated);
    //   featuredBody = post.body;
    //   featuredImage = getImage(post.mainImage.asset._ref);
    //   featuredLink = post.link;
    //   featuredCategories = post.categories;
    // }

    // if (!featuredLink) {
    //   imgElement.style.cursor = "auto";
    //   featuredLink = "Image";
    // } else {
    //   imgElement.style.cursor = "pointer";
    // }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", welcomeHeader);
    mediaQuery.addEventListener("change", setVideo);
  });

  // const travelFeaturedLink = () => {
  //   if (featuredLink != "Image") {
  //     location.href = featuredLink;
  //   } else {
  //     return;
  //   }
  // };
</script>

<title>althruist:portfolio</title>
<div id="content">
  <PageHeader id="welcomeHeader" fetchpriority="high">
    <div class="video-container">
      <video
        bind:this={video}
        muted
        playsinline
        preload="auto"
        id="homeVideo"
        fetchpriority="high"
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
    <div class="headerContent">
      <h1 class="emphasis">
        Hiya, i'm <span class="name">Kieran</span>!
      </h1>
      <h2 class="emphasis">
        A Game Developer, Musician, Content Creator<br />
        <span>(& a lil' bit of everything else :])</span>
      </h2>
    </div>
  </PageHeader>

  <section id="aboutSection">
    <h1 class="sectionTitle">- Who am I? -</h1>
    <Card hasSlug={false} className="aboutCard"
      ><p>
        I'm Kieran, known as althruist online. I am an 18 y/o in Malta, reading
        for Bachelors of Science (Hons) in Digital Games Development.<br />I
        like to do a variety of things; Ranging from 3D Art/Animation (using
        Blender), Music-Making, Coding in several languages, Concept Art, Sound
        Design, Photography.. anything creative you can think of I probably do
        it!
      </p></Card
    >
  </section>

  <!-- <Card class="mainCard" id="currentProject">
    <div id="postCategories">
      {#each featuredCategories as fCategory}
      {console.log(fCategory)}
        <div>
          <p>{fCategory.title}</p>
        </div>
      {/each}
    </div>
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
  </Card> -->

  <section id="projectsSection">
    <h1 class="sectionTitle">- Some cool stuff I did -</h1>
    <div class="flexCards">
      {#each posts as post}
        <Card id={post.slug.current} project={post} hasSlug={true}>
          <div class="imageArea">
            <img
              id="mainImage"
              loading="lazy"
              fetchpriority="low"
              src={getImage(post.mainImage.asset._id)}
              alt={post.mainImage.alt}
            />
            <div class="info">
              <div class="infoContent">
                <p id="date">{formatDateTime(post.created)}</p>
                <div id="postCategories">
                  {#each post.categories as category}
                    <div>
                      <p>{category.title}</p>
                    </div>
                  {/each}
                </div>
                <h1 class="projectTitle">{post.title}</h1>
              </div>
            </div>
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

  .sectionTitle {
    font-family: "Althite";
    font-size: 2rem;
    margin: auto;
    padding: 20px;
    text-align: center;
    white-space: nowrap;
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
  }

  .info {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.512);
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20px;
    align-items: center;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
  }

  .projectTitle {
    font-size: 280%;
    margin: 0;
    box-sizing: border-box;
    width: 100%;
    word-wrap: break-word;
  }

  .infoContent {
    width: 100%;
    scale: 0.9;
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
  }
</style>
