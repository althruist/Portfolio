<script>
  import Button from "$lib/components/Button.svelte";
  import { getImage } from "$lib/logic/data.js";
  import { renderBody, formatDateTime } from "$lib/logic/formatter";

  export let data;

  const project = data.project;

  console.log(project);
</script>

<title>althruist:{project.title}</title>
<div id="content">
  <img
    id="mainImage"
    loading="lazy"
    fetchpriority="low"
    src={getImage(project.mainImage.asset._id)}
    alt={project.mainImage.alt}
  />
  <Button text="Go Back" className="goBack" link="/goback"></Button>
  <p id="date">{formatDateTime(project.created)}</p>
  <h1 id="title">{project.title}</h1>
  <div id="postCategories">
    {#each project.categories as category}
      <p class="tag">{category.title}</p>
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
    padding: 10%;
  }
  img {
    border-radius: 20px;
  }

  #date {
    font-size: larger;
    color: var(--color-primary);
    opacity: 0.5;
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

  #postCategories {
    gap: 3rem;
  }
</style>
