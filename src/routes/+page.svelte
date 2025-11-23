<script>
    import { onMount } from "svelte";
    import { client } from "$lib/logic/data.js";
    import { renderBody, formatDateTime } from "$lib/logic/formatter";
    import { getImage } from "$lib/logic/data.js";
    import Card from "$lib/components/Card.svelte";
    import CarouselGrid from "$lib/components/CarouselGrid.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { isDarkMode } from "$lib/logic/globalFunctions";

    let posts = [];
    let featured = [];
    let featuredBody = [];
    let featuredTitle = "";
    let featuredDate = "";
    let featuredImage = "";
    let featuredLink = "";

    let imgElement;
    let fgElement;

    onMount(async () => {
        const welcomeHeader = () => {
            if (isDarkMode()) {
                fgElement.src =
                    "https://althruist.fyi/images/ForegroundDark.webp";
            } else {
                fgElement.src =
                    "https://althruist.fyi/images/ForegroundLight.webp";
            }
        };

        welcomeHeader();

        posts = await client.fetch(
            '*[_type == "post"]{title,slug,mainImage{asset->{_id,url},alt},categories[]->{title},collaborators,link,created,body}',
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
    <PageHeader id="welcomeHeader" foregroundImg={fgElement}>
        <div class="headerContent">
            <h1 class="emphasis">
                hiya, i'm <span class="name">kieran</span>!
            </h1>
            <h2 class="emphasis">thanks for checking out my website!</h2>
            <img
                class="foreground"
                src="/src/lib/images/Assets/HeaderImages/Light/ForegroundLight.webp"
                alt="bird"
                draggable="false"
                loading="lazy"
                bind:this={fgElement}
            />
        </div>
    </PageHeader>

    <Card class="mainCard" id="currentProject">
        <p id="date">Current Project • {featuredDate}</p>
        <h1 class="emphasis">{featuredTitle}</h1>
        <img
            bind:this={imgElement}
            id="img"
            loading="lazy"
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

    <div class="flexCards">
        <!-- <Card class="card" id="linksCard">
            <h2>flex card</h2>
            <p id="altText">alt text</p>
        </Card> -->

        {#each posts as post}
            <Card id={post.slug.current}>
                <div id="postCategories">
                    {#each post.categories as category}
                        <div>
                            <p>{category.title}</p>
                        </div>
                    {/each}
                </div>
                <img id="mainImage" loading="lazy" src={getImage(post.mainImage.asset._id)} />
                <p id="date">{formatDateTime(post.created)}</p>
                <h1>{post.title}</h1>
                {#if post.link}
                    <a href={post.link} target="_blank">{post.link}</a>
                {/if}
                <div class="post-body">
                    {@html renderBody(post.body)}
                </div>
            </Card>
        {/each}
    </div>
    <CarouselGrid content={posts} filter="music" name="Music"></CarouselGrid>
    <CarouselGrid content={posts} filter="renders" name="Renders"
    ></CarouselGrid>
    <CarouselGrid content={posts} filter="games" name="Games"></CarouselGrid>
</div>

<style>
    #mainImage {
        width: 100%;
    }
</style>
