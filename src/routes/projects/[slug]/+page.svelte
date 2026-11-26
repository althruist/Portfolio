<script>
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";
  import CarouselGrid from "$lib/components/CarouselGrid.svelte";
  import { getImage, getSrcSet } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";
  import { scrollTo } from "$lib/logic/globalFunctions.js";
  import gsap from "gsap";
  import { onMount } from "svelte";

  let { data } = $props();

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

  let screenshots = project.screenshots;

  let activeSection = $state("");

  onMount(() => {
    import("@google/model-viewer").catch(() => {});

    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeSection = entry.target.id;
        });
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  });
</script>

<title>althruist:{project.title}</title>

<img
  id="mainImage"
  bind:this={mainImage}
  loading="lazy"
  fetchpriority="low"
  src={getImage(project.mainImage.asset._id, 800)}
  srcset={getSrcSet(project.mainImage.asset._id)}
  alt={project.mainImage.alt}
/>
<div id="content">
  <div id="slugHeader">
    <Button
      text="go back"
      className="goBack"
      link="/goback"
      onpointerenter={onEnter}
      onpointerleave={onLeave}
    ></Button>
    <p class="date">{formatDateTime(project.created)}</p>
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
    {#if project.screenshots}
      <CarouselGrid content={screenshots} filter="music" name="Music"
      ></CarouselGrid>
    {/if}
  </div>
  <div id="layout">
    <aside id="tableofcontents">
      <div class="postButtons">
        {#each project.links as button}
          <Button link={button.url} text={button.label} className="postButton"
          ></Button>
        {/each}
      </div>
      {#each project.body as body}
        {#if body._type === "section"}
          <Button
            text={body.sectiontitle}
            className="tocButton"
            disableNavigation={true}
            active={activeSection ===
              body.sectiontitle.toString().replaceAll(" ", "")}
            bounceIntensity="0.3"
            onclick={() => {
              scrollTo(`#${body.sectiontitle.toString().replaceAll(" ", "")}`);
            }}
            selectable="true"
          ></Button>
        {/if}
      {/each}
    </aside>

    <div class="post-body">
      <div class="postButtons inBody">
        {#each project.links as button}
          <Button link={button.url} text={button.label} className="postButton"
          ></Button>
        {/each}
      </div>
      {@html renderBody(project.body)}
    </div>
  </div>
</div>

<style>
  #slugHeader {
    padding: 5%;
    padding-top: 4%;
    padding-bottom: 0;
  }

  .post-body {
    white-space: pre-line;
    width: 100%;
  }

  #mainImage {
    border-radius: 0;
    width: 100%;
    height: 500px;
    object-fit: cover;
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
    padding: var(--padding-card) !important;
    background-color: var(--color-card) !important;
    color: var(--color-text) !important;
    font-weight: bold;
    text-align: center;
    border-radius: 3px;
    border: 1px solid var(--color-card-outline);
    align-items: center;
    display: flex;
    margin-top: 0;
    margin-bottom: 0;
  }

  #postCategories,
  #postSubCategories {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 0.5rem;
    align-items: flex-start;
    margin-top: 20px;
  }

  .postButtons {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 5rem), 1fr));
    gap: 1rem;
    margin: 0px 10px 10px;
  }

  .inBody {
    display: grid;
    margin: 0;
    margin-top: 60px;
  }

  #tableofcontents {
    display: none;
  }

  #layout {
    padding: 5%;
    padding-top: 0;
  }

  @media (min-width: 1064px) {
    #title {
      font-size: 300%;
    }

    #slugHeader {
      padding: 10%;
      padding-top: 4%;
      padding-bottom: 0;
    }

    .inBody {
      display: none;
    }

    .post-body {
      width: 95%;
    }

    #content {
      padding: 0;
    }

    #tableofcontents {
      display: block;
      position: sticky;
      top: 10rem;
      max-height: calc(100dvh - 20rem - 1rem);
      width: 100%;
    }

    #layout {
      display: grid;
      grid-template-columns: 21rem minmax(0, 1fr);
      gap: 4rem;
      align-items: start;
      margin-top: 2.5rem;
      padding: 2%;
    }
  }
</style>
