<script>
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getImage } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";
  import { scrollTo } from "$lib/logic/globalFunctions.js";
  import gsap from "gsap";
  import { onMount } from "svelte";

  export let data;

  let mainImage;
  const project = data.project;

  function onEnter() {
    gsap.to(mainImage, {
      filter: "blur(10px)",
      duration: 0.3,
    });
  }

  function onLeave() {
    gsap.to(mainImage, {
      filter: "blur(0px)",
      duration: 0.3,
    });
  }

  let activeSection = "";

  onMount(async () => {
    await import("@google/model-viewer");

    let TOC = document.querySelector(".tableOfContents");
    let TOCTitle = document.querySelector("#tocTitle");

    TOC.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 1024) {
        gsap.to(TOC, {
          top: "82%",
          duration: 0.3,
          ease: "circ.out",
        });
        gsap.to(TOCTitle, {
          marginTop: "15px",
          duration: 0.4,
          ease: "circ.out",
        });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth < 1024) {
        gsap.set(TOCTitle, {
          marginTop: "15px",
        });
      } else {
        gsap.set(TOCTitle, {
          marginTop: "-7px",
        });
      }
    });

    TOC.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 1024) {
        gsap.to(TOC, {
          top: "95%",
          duration: 0.3,
          ease: "circ.out",
        });
        gsap.to(TOCTitle, {
          marginTop: "-7px",
          duration: 0.4,
          ease: "circ.out",
        });
      }
    });

    const sections = document.querySelectorAll("section");

    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  });
</script>

<title>althruist:{project.title}</title>

<img
  id="mainImage"
  bind:this={mainImage}
  loading="lazy"
  fetchpriority="low"
  src={getImage(project.mainImage.asset._id)}
  alt={project.mainImage.alt}
/>
<div id="content">
  <Button
    text="Go Back"
    className="goBack"
    link="/goback"
    on:mouseenter={onEnter}
    on:mouseleave={onLeave}
  ></Button>
  <p id="date">{formatDateTime(project.created)}</p>
  <h1 id="title">{project.title}</h1>
  <div id="postCategories">
    {#if project.featured}
      <p class="tag" id="featured">Featured</p>
    {/if}
    {#each project.categories as category}
      <p class="tag">{category.title}</p>
    {/each}
  </div>
  <div id="postSubCategories">
    {#each project.subcategories as subcategory}
      <p class="tag1">{subcategory.title}</p>
    {/each}
  </div>
  <Card className="noBounce tableOfContents">
    <h3 class="altText" id="tocTitle">Table Of Contents</h3>
    <div class="tofButtons">
      {#each project.body as body}
        {#if body._type === "section"}
          <Button
            text={body.sectiontitle}
            className="tofButton"
            active={activeSection ===
              body.sectiontitle.toString().replaceAll(" ", "")}
            on:click={() => {
              scrollTo(`#${body.sectiontitle.toString().replaceAll(" ", "")}`);
            }}
          ></Button>
        {/if}
      {/each}
    </div>
  </Card>
  <div class="post-body">
    {@html renderBody(project.body)}
  </div>
  <div class="postButtons">
    {#each project.links as button}
      <Button link={button.url} text={button.label} className="postButton"
      ></Button>
    {/each}
  </div>
</div>

<style>
  #content {
    padding: 10%;
    padding-top: 4%;
    padding-bottom: 4%;
  }

  #mainImage {
    border-radius: 0;
    width: 100%;
    height: 500px;
    object-fit: cover;
  }

  #date {
    font-size: larger;
  }

  #title {
    font-size: 300%;
    margin-top: 0;
    margin-bottom: 15px;
    width: 100%;
  }

  .tag {
    width: auto !important;
    padding: 10px !important;
    background-color: var(--color-primary) !important;
    color: var(--color-text) !important;
    font-weight: bold;
    margin-bottom: 0;
  }

  .tag1 {
    padding: 20px !important;
    background-color: var(--color-card) !important;
    color: var(--color-text) !important;
    font-weight: bold;
    text-align: center;
    border-radius: 3px;
    border: 1px solid var(--color-card-outline);
    align-items: center;
    display: flex;
    margin-bottom: 0;
  }

  #postCategories,
  #postSubCategories {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 1rem;
    align-items: flex-start;
  }

  @media (min-width: 1024px) {
    #title {
      font-size: 300%;
    }
  }
</style>
