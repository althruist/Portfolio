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
  import { goto } from "$app/navigation";

  let posts = [];

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
      '*[_type == "post"]{title,slug,mainImage{asset->{_id,url},alt},categories[]->{title},subcategories[]->{title},created,body,links}',
    );

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", welcomeHeader);
    mediaQuery.addEventListener("change", setVideo);
  });
</script>

<title>althruist:portfolio</title>
<div id="content">
  <PageHeader id="welcomeHeader">
    <div class="video-container">
      <video bind:this={video} muted playsinline preload="auto" id="homeVideo">
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


  <section id="projectsSection">
    <h1 class="sectionTitle">- Some cool stuff I did -</h1>
    <div class="flexCards">
      {#each posts as post}
      {console.log(post)}
        <Card id={post.slug.current}>
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
                <div class="infoGroup">
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
                <Button id="readmore" slug={post.slug.current} text="Read More"
                ></Button>
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
  }

  .imageArea {
    width: 30vw;
    height: 30vw;
    container-type: inline-size;
  }

  .info {
    position: absolute;
    background: linear-gradient(to bottom, var(--color-hovercard) 30%, transparent);
    z-index: 3;
    top: 0;
    left: 0;
    width: 92%;
    height: 92%;
    overflow: hidden;
    border-radius: 12px;
    align-items: center;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
    scale: 0.95;
    padding: 4%;
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
