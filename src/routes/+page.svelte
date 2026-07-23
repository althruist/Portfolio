<script>
  import { onMount, tick } from "svelte";
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

  import deerLight from "$lib/images/deer/deerlight.png";
  import deerDark from "$lib/images/deer/deerdark.png";

  let posts = [];

  let imgElement;
  let content;

  import headerVideoDay from "$lib/videos/day.mp4";
  import headerVideoNight from "$lib/videos/night.mp4";
  import aboutVideoDay from "$lib/videos/idleday.mp4";
  import aboutVideoNight from "$lib/videos/idlenight.mp4";
  import Socials from "$lib/components/Socials.svelte";

  let video;
  let aboutVideo;

  let videoSource;
  let aboutVideoSource;
  let deerSource;

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

    setThemeMedia();

    const animateCard = () => {
      const x = Math.random() * 500;
      const y = Math.random() * 500;
      const duration = 0.02;

      if (!labsSection) return;
      gsap.to(labsSection, {
        backgroundPosition: `${x}px ${y}px`,
        duration,
        ease: "linear",
        onComplete: animateCard,
      });
    };

    animateCard();

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
        start: "top+=100px bottom",
        end: "bottom+=400px bottom",
        invalidateOnRefresh: true,
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
    mediaQuery.addEventListener("change", setThemeMedia);
    await tick();
    ScrollTrigger.refresh();
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
      <h1 class="emphasis noSelect">
        Heya, i'm <span class="name">Kieran</span>!
      </h1>
      <h2 class="emphasis noSelect">
        A Game Developer, Musician, Content Creator<br />
        <span>(& a lil' bit of everything else :])</span>
      </h2>
    </div>
  </PageHeader>

  <section id="projectsSection">
    <h1 class="sectionTitle noSelect">highlighted projects</h1>
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
              <div class="info noSelect">
                <div class="infoContent noSelect">
                  <div class="infoGroup noSelect">
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
                    <h1 class="projectTitle noSelect">{post.title}</h1>
                  </div>
                  <Button
                    id="readmore"
                    slug={post.slug.current}
                    text="read more"
                  ></Button>
                </div>
              </div>
            </div>
          </Card>
        {/if}
      {/each}
    </div>
  </section>

  <section id="aboutSection">
    <h1 class="sectionTitle noSelect">who am i?</h1>
    <Card hasSlug={false} className="aboutCard">
      <div id="aboutLayout">
        <video
          bind:this={aboutVideo}
          muted
          playsinline
          preload="auto"
          disablepictureinpicture
          controlslist="nodownload noplaybackrate"
          on:contextmenu|preventDefault
          id="aboutVideo"
        >
          <source src={aboutVideoSource} type="video/mp4" />
        </video>
        <p class="noSelect aboutText">
          I'm <span class="highlightedText">Kieran</span>, known as
          <span class="highlightedText">althruist</span>
          online. I am from Malta and I'm currently reading for a
          <span class="highlightedText"
            >Bachelor of Science (Hons) in Digital Games Development</span
          >. <br /><br /> Ever since I got my
          <span class="highlightedText"> first laptop (9 years ago!)</span>, I
          have been experimenting with my craft in
          <span class="highlightedText">
            game development, Blender and music</span
          >. Now that I'm studying for the very thing I've always wished for,
          i'm expanding my own brand/identity and slowly creating the things I
          always envisioned during car rides!
        </p>

        <h1>my work ethic</h1>
        <div id="valuesSection">
          <Card className="valuesCard"
            ><h1>originality</h1>
            <p>
              I believe that game development is an art. I build my projects
              with original assets, slowly evolving to my own style.
            </p></Card
          >
          <Card className="valuesCard"
            ><h1>handcrafted quality</h1>
            <p>
              I value the human aspect when designing anything, including games.
              While I might use modern tools like AI for troubleshooting, I
              never use generative AI to create assets for me.
            </p></Card
          >
          <Card className="valuesCard"
            ><h1>modular architecture</h1>
            <p>
              Efficiency matters, so when I work on projects, I try my best to
              make things as modular and reusable as possible, allowing me to
              make robust frameworks that scale across multiple projects.
            </p></Card
          >
        </div>
        <p class="aboutText">
          I've always been a creative nerd. When I was younger, playing games
          made up most of my free time. This passion started off playing <span
            class="highlightedText">Minecraft</span
          >
          on my PlayStation 4, where I loved making new buildings and exploring (I
          still do!). Then I moved on to
          <span class="highlightedText">Roblox</span>
          which I still work on from time to time making small projects. It's also
          my first time seeing what coding is like!
        </p>
        <br />
        <p class="aboutText">
          Nowadays, in my free time, I like to either work on different projects
          on Blender, take photos, play games, make music, hang out with friends
          or take a walk, usually in nature areas!
        </p>
        <div id="intouchSection">
          <h1 id="intouch">want to get in touch?</h1>
          <Socials variant="getintouch"></Socials>
        </div>
      </div>
    </Card>
  </section>

  <section id="labs" class="card" bind:this={labsSection}>
    <img
      id="deerImg"
      src={deerSource}
      alt="Deer"
      on:contextmenu|preventDefault
    />
    <h1 class="sectionTitle noSelect" id="wanttoknowmoresection">
      want to know more about what i do?
    </h1>
    <Button text="go to labs" link="/labs" id="gotolabs"></Button>
  </section>
</div>

<style>
  #mainImage {
    width: 100%;
  }

  #aboutVideo {
    width: 90%;
    height: 250px;
    margin: 20px;
    border-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  #aboutSection h1 {
    font-family: Althite;
  }

  #aboutLayout {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  #labs {
    margin-top: 30px;
    margin-bottom: 30px;
    aspect-ratio: unset;
    width: 100%;
    border-radius: 0;
    padding: 0;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .sectionTitle {
    font-family: "Althite";
    font-size: 6vw;
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
    padding: 20px;
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

  #aboutLayout video {
    width: 100%;
    height: auto;
    margin: 0;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 60%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  #deerImg {
    display: none;
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

    #intouchSection{
      display: flex;
    }

    #intouch {
      font-size: 8rem;
      line-height: 1;
      margin-left: 20px;
      width:60%;
    }

    .projectTitle {
      font-size: 14cqw;
      margin: 0;
      width: 100%;
      word-wrap: break-word;
      text-align: left;
    }

    #labs {
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
  }
</style>
