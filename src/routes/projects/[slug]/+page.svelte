<script>
  import Button from "$lib/components/Button.svelte";
  import { getImage } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";

  export let data;

  const project = data.project;
</script>

<title>althruist:{project.title}</title>
<img
  id="mainImage"
  loading="lazy"
  fetchpriority="low"
  src={getImage(project.mainImage.asset._id)}
  alt={project.mainImage.alt}
/>
<div id="content">
  <Button text="Go Back" className="goBack" link="/goback"></Button>
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
    padding: 4%;
    padding-bottom: 0;
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
    font-size: 5rem;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .tag {
    padding: 10px !important;
    background-color: var(--color-primary) !important;
    color: var(--color-text) !important;
    font-weight: bold;
    text-align: center;
  }

  .tag1 {
    padding: 10px !important;
    background-color: var(--color-card) !important;
    color: var(--color-text) !important;
    font-weight: bold;
    text-align: center;
    border-radius: 3px;
    border: 1px solid var(--color-card-outline);
  }

  #postCategories {
    gap: 3rem;
  }
  #postSubCategories {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    width: 16%;
    gap: 3rem;
  }
</style>
