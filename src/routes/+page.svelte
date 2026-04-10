<script>
  import { onMount } from "svelte";
  import { client } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";
  import { getImage } from "$lib/logic/data.js";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
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
  import aboutVideoDay from "$lib/videos/idleday.mp4";
  import aboutVideoNight from "$lib/videos/idlenight.mp4";

  let video;
  let aboutVideo;

  let videoSource;
  let aboutVideoSource;

  const MAX_CATEGORIES = 2;

  function getCategories(post) {
    if (!post.categories) return { visible: [], hiddenCount: 0 };
    const visible = post.categories.slice(0, MAX_CATEGORIES);
    const hiddenCount = post.categories.length - visible.length;
    return { visible, hiddenCount };
  }

  function setVideo() {
    videoSource = isDarkMode() ? headerVideoNight : headerVideoDay;
    aboutVideoSource = isDarkMode() ? aboutVideoNight : aboutVideoDay;
    if (video) {
      video.load();
    }
    if (aboutVideoSource) {
      aboutVideo.load();
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
    let scrollTriggerInstance;

    setVideo();

    const setupScrollScrub = () => {
      if (!video || !aboutVideo) return;
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: video,
        start: "top top",
        end: "+=650",
        scrub: 1,
        onUpdate: (self) => {
          if (!video || !isFinite(video.duration)) return;
          video.currentTime = video.duration * self.progress;
        },
      });

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: aboutVideo,
        start: "-=400",
        end: "+=800",
        scrub: 1,
        onUpdate: (self) => {
          if (!aboutVideo || !isFinite(aboutVideo.duration)) return;
          aboutVideo.currentTime = aboutVideo.duration * self.progress;
        },
      });
    };

    if (video.readyState >= 1 && aboutVideo.readyState >= 1) {
      setupScrollScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrollScrub);
      aboutVideo.addEventListener("loadedmetadata", setupScrollScrub);
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
    <Card hasSlug={false} className="aboutCard">
      <div id="aboutLayout">
        <video
          bind:this={aboutVideo}
          muted
          playsinline
          preload="auto"
          id="aboutVideo"
        >
          <source src={aboutVideoSource} type="video/mp4" />
        </video>
        <p id="aboutText">
          I'm <span class="highlightedText">Kieran</span>, known as
          <span class="highlightedText">althruist</span>
          online. I am an 18 y/o in Malta, reading for
          <span class="highlightedText"
            >Bachelors of Science (Hons) in Digital Games Development.</span
          ><br />I like to do a variety of things; <br /><br /> Ranging from
          <span class="highlightedText">3D Art/Animation </span> (using
          Blender), <span class="highlightedText"> Music-Making, Coding </span>
          in several languages,
          <span class="highlightedText">
            Concept Art, Sound Design, Photography</span
          >.. anything creative you can think of I probably do it!
        </p>
      </div>
    </Card>
  </section>

  <section id="projectsSection">
    <h1 class="sectionTitle">- Some cool stuff I did -</h1>
    <div class="flexCards">
      {#each posts as post}
        {#if post.homepage}
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
                  <Button
                    id="readmore"
                    slug={post.slug.current}
                    text="Read More"
                  ></Button>
                </div>
              </div>
            </div>
          </Card>
        {/if}
      {/each}
    </div>
  </section>
</div>

<style>
  #mainImage {
    width: 100%;
  }

  #aboutVideo {
    width: 250px;
    height: 250px;
    margin: 20px;
    border-radius: 20px;
  }

  #aboutLayout {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
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

  #aboutText {
    font-size: 1.3rem;
  }

  .highlightedText {
    font-size: 1.8rem;
    color: var(--color-primary);
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

    #aboutLayout {
      flex-direction: row;
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
