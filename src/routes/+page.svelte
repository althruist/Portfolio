<script>
  import { onMount, tick } from "svelte";
  import { getSrcSet } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";
  import { getImage } from "$lib/logic/data.js";
  import Card from "$lib/components/Card.svelte";
  import Button from "$lib/components/Button.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import {
    addNoise,
    isDarkMode,
    disableContextMenu,
    scrollTo,
  } from "$lib/logic/globalFunctions";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { goto } from "$app/navigation";
  let { data } = $props();
  const posts = $derived(data.posts);

  import deerLight from "$lib/images/deer/deerlight.png";
  import deerDark from "$lib/images/deer/deerdark.png";

  let imgElement;
  let content;

  import headerVideoDay from "$lib/videos/day.mp4";
  import headerVideoNight from "$lib/videos/night.mp4";
  import aboutVideoDay from "$lib/videos/idleday.mp4";
  import aboutVideoNight from "$lib/videos/idlenight.mp4";
  import Socials from "$lib/components/Socials.svelte";

  let video;
  let aboutVideo;

  let videoSource = $state();
  let aboutVideoSource = $state();
  let deerSource = $state();

  let labsSection;

  const MAX_CATEGORIES = 2;

  function getCategories(post) {
    if (!post.categories) return { visible: [], hiddenCount: 0 };
    const visible = post.categories.slice(0, MAX_CATEGORIES);
    const hiddenCount = post.categories.length - visible.length;
    return { visible, hiddenCount };
  }

  function setThemeMedia() {
    videoSource = isDarkMode() ? headerVideoNight : headerVideoDay;
    aboutVideoSource = isDarkMode() ? aboutVideoNight : aboutVideoDay;
    deerSource = isDarkMode() ? deerDark : deerLight;
    if (video) {
      video.load();
    }
    if (aboutVideoSource) {
      aboutVideo.load();
    }
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const v = video;
    const a = aboutVideo;
    let triggers = [];

    const setupScrollScrub = () => {
      triggers.forEach((t) => t.kill());

      triggers = [
        ScrollTrigger.create({
          trigger: v,
          start: "top top",
          end: "+=650",
          scrub: 1,
          onUpdate: (self) => {
            if (!isFinite(v.duration)) return;
            v.currentTime = v.duration * self.progress;
          },
        }),
        ScrollTrigger.create({
          trigger: a,
          start: "top+=100px bottom",
          end: "bottom+=400px bottom",
          invalidateOnRefresh: true,
          scrub: 1,
          onUpdate: (self) => {
            if (!isFinite(a.duration)) return;
            a.currentTime = a.duration * self.progress;
          },
        }),
      ];
    };

    v.addEventListener("loadedmetadata", setupScrollScrub);
    a.addEventListener("loadedmetadata", setupScrollScrub);
    if (v.readyState >= 1 && a.readyState >= 1) setupScrollScrub();

    setThemeMedia();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", setThemeMedia);

    tick().then(() => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((t) => t.kill());
      v.removeEventListener("loadedmetadata", setupScrollScrub);
      a.removeEventListener("loadedmetadata", setupScrollScrub);
      mediaQuery.removeEventListener("change", setThemeMedia);
    };
  });
</script>

<title>althruist:portfolio</title>
<div id="content">
  <PageHeader id="heroHeader" className="heroHeader">
    <div class="video-container">
      <video bind:this={video} muted playsinline preload="auto" id="homeVideo">
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
    <div class="headerContent">
      <div id="textAreaHeader">
        <h1 class="noSelect">
          heya, i'm <span class="name">Kieran</span>!
        </h1>
        <h2 id="headline" class="noSelect">
          <span>a multidisciplinary game developer</span>
        </h2>
      </div>

  <div id="buttonArea">
    <Button
      id="scrollButtonHeader"
      text="let's go!"
      arrowIcon
      --padding="15px"
      --padding-left="15px"
      --padding-right="15px"
      --font-size="2rem"
      onclick={() => scrollTo("#projectsSection")}
    ></Button>
  </div>
</div>

  </PageHeader>

  <section id="projectsSection">
    <h1 class="sectionTitle noSelect">highlighted projects</h1>
    <div class="flexCards">
      {#each posts as post}
        <Card id={post.slug.current} className="projectCard tooltip">
          <div class="imageArea">
            <img
              id="mainImage"
              loading="lazy"
              fetchpriority="low"
              src={getImage(post.mainImage.asset._id, 800)}
              srcset={getSrcSet(post.mainImage.asset._id)}
              alt={post.mainImage.alt}
            />
            <div class="info noSelect">
              <div class="infoContent noSelect">
                <div class="infoGroup noSelect">
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
              <h1 class="projectTitle noSelect">{post.title}</h1>
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

  <section id="aboutSection">
    <h1 class="sectionTitle noSelect">who am i?</h1>
    <Card hasSlug={false} className="aboutCard">
      <div id="aboutLayout">
        <div id="aboutInfo">
          <div id="aboutIntro">
            <h1 class="aboutText">I'm Kieran!</h1>
            <h3 class="aboutText">
              maltese | game developer | degree student | generalist
            </h3>
          </div>
          <p class="aboutText">
            I'm currently reading for a <span class="highlightedText"
              >Bachelor of Science (Hons) in Digital Games Development</span
            >. Around 2017 (back when I got my first laptop at 10!), I started
            playing and experimenting with
            <span class="highlightedText">Roblox</span>
            and its engine <span class="highlightedText">Roblox Studio</span>,
            alongside <span class="highlightedText">Blender</span> and
            <span class="highlightedText">music</span>. Now that I'm studying
            for the things I've always wished for, I'm expanding my own
            brand/identity and slowly creating the things I always envisioned
            during car rides!
          </p>
          <p class="aboutText">
            Throughout the years, I picked up <span class="highlightedText"
              >Unity</span
            >
            and a bit of <span class="highlightedText">Unreal Engine</span>,
            <span class="highlightedText">A-Frame</span>
            and <span class="highlightedText">Godot</span>. Some of my games
            have been acknowledged by
            <span class="highlightedText">MCAST</span>, developers of
            <span class="highlightedText">A-Frame</span>, primary school
            teachers and Malta's Prime Minister!
          </p>
          <p class="aboutText">
            Currently, I'm working on improving my craft, learning just about
            anything related but not limited to game development (music, art,
            code, photography, etc!). I'm also working on a few 'secret
            projects' that are yet to be published, which you should look out
            for! :)
          </p>
        </div>
        <video
          bind:this={aboutVideo}
          muted
          playsinline
          preload="auto"
          disablepictureinpicture
          controlslist="nodownload noplaybackrate"
          oncontextmenu={disableContextMenu}
          id="aboutVideo"
        >
          <source src={aboutVideoSource} type="video/mp4" />
        </video>
      </div>
    </Card>
  </section>

  <Card id="labs" bind:this={labsSection}>
    <img
      id="deerImg"
      src={deerSource}
      alt="Deer"
      oncontextmenu={disableContextMenu}
    />
    <h1 class="sectionTitle noSelect" id="wanttoknowmoresection">
      want to know more about what i do?
    </h1>
    <Button text="go to labs" link="/labs" id="gotolabs"></Button>
  </Card>

  <section id="contactme" class="card" use:addNoise>
    <div id="contactmeinteractive">
      <h1 class="sectionTitle">wanna have a chat?</h1>
      <Socials variant="getintouch" />
    </div>
  </section>
</div>

<style>
  #aboutSection h1 {
    font-family: Althite;
    font-size: 3rem;
  }

  #aboutLayout {
    display: grid;
    width: 100%;
    grid-template-columns: minmax(0, 1fr) clamp(80px, 24vw, 150px);
    gap: 20px 12px;
    align-items: center;
    padding: var(--padding-card);
    box-sizing: border-box;
  }

  #aboutInfo {
    display: contents;
  }

  #aboutIntro {
    grid-column: 1;
    grid-row: 1;
    min-width: 0;
  }

  #aboutIntro h1 {
    font-size: clamp(2rem, 7vw, 4rem) !important;
    padding: 0;
    margin: 0 0 12px;
  }

  #aboutIntro h3 {
    font-size: clamp(0.85rem, 2.5vw, 1.2rem);
    padding: 0;
    margin: 0;
  }

  #aboutVideo {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    height: auto;
    aspect-ratio: 4/6;
    object-fit: cover;
    border-radius: 20px;
    padding: 0;
    margin: 0;
    align-self: center;
    min-width: 0;
  }

  #aboutInfo > p {
    grid-column: 1 / -1;
    padding: 0;
    min-width: 0;
  }

  :global(#labs) {
    margin-top: 30px;
    margin-bottom: 30px;
    aspect-ratio: unset;
    width: var(--width-card);
    padding: var(--padding-card);
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .sectionTitle {
    font-family: "Althite";
    font-size: 10vw;
    margin: auto;
    padding: 40px;
    text-align: center;
    white-space: wrap;
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

  .aboutText {
    font-size: 1.3rem;
    padding: var(--padding-card);
    margin-top: 0;
    margin-bottom: 0;
  }

  .highlightedText {
    font-size: 1.5rem;
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
    border-radius: var(--radius-card);
    align-items: center;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
    padding: 4%;
  }

  .info:focus-within {
    outline: 2px solid currentColor;
    outline-offset: -4px;
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

  #deerImg {
    display: none;
  }

  #mainImage {
    width: 100%;
    transition: filter 0.3s ease-out;
  }

  #contactme {
    width: 100%;
    border-radius: 0;
    padding: 50px;
    box-sizing: border-box;
    aspect-ratio: unset;
  }

  #contactmeinteractive h1 {
    padding-left: 0;
    padding-right: 0;
    line-height: 1.1;
  }

  #buttonArea {
    width: 30%;
    display: none;
    justify-content: center;
    align-items: center;
  }

  #textAreaHeader {
    width: 100%;
  }

  .headerContent {
    display: flex;
  }

  :global(#scrollButtonHeader) {
    display: none;
    margin: auto;
  }

  @media (hover: hover) {
    .info {
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }

    .imageArea:hover .info,
    .info:focus-within {
      opacity: 1;
    }

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

    #aboutInfo {
      display: block;
    }

    #aboutIntro h1 {
      font-size: 5rem !important;
      padding: var(--padding-card);
      padding-top: 40px;
      padding-bottom: 0;
      margin: 0;
    }

    #aboutIntro h3 {
      font-size: 1.3rem;
      padding: var(--padding-card);
      margin: 0;
    }

    #aboutInfo > p {
      padding: var(--padding-card);
    }

    #aboutLayout {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0;
      padding: 0;
      width: 100%;
    }

    #aboutVideo {
      aspect-ratio: auto;
      border-radius: var(--radius-card);
      width: 30%;
      height: auto;
      align-self: stretch;
      object-fit: cover;
      flex-shrink: 0;
      box-sizing: border-box;
      margin: 0;
      mask-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 1) 60%,
        rgba(0, 0, 0, 0) 100%
      );
    }

    #buttonArea {
      display: flex;
    }

    :global(#scrollButtonHeader) {
      display: inline-flex;
    }

    #deerImg {
      display: block;
      width: 300px;
      aspect-ratio: 1/1;
      mask-image: linear-gradient(rgba(0, 0, 0, 255) 0%, rgba(0, 0, 0, 0) 100%);
      user-select: none;
      -webkit-user-drag: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .projectTitle {
      font-size: 14cqw;
      margin: 0;
      width: 100%;
      word-wrap: break-word;
      text-align: left;
    }

    :global(#labs) {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
    }

    #wanttoknowmoresection {
      text-align: left;
      width: 30%;
      margin: 0;
      text-wrap-mode: wrap;
      text-wrap-style: auto;
      line-height: 65px;
    }

    #aboutSection h1 {
      font-family: Althite;
      font-size: 3rem;
    }

    #contactmeinteractive {
      width: 50%;
    }

    #headline {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>