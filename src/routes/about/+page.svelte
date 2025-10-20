<script>
    import { onMount } from "svelte";
    import { client } from "$lib/logic/data.js";
    import { renderBody, formatDateTime } from "$lib/logic/formatter";
    import { getImage } from "$lib/logic/data.js";
    import Card from "$lib/components/Card.svelte";
    import CarouselGrid from "$lib/components/CarouselGrid.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";

    let posts = [];
    let featured = [];
    let featuredBody = [];
    let featuredTitle = "";
    let featuredDate = "";
    let featuredImage = "";

    onMount(async () => {
        posts = await client.fetch(
            '*[_type == "post"]{title, slug, mainImage, categories, collaborators, link, created, body}',
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
        }
    });
</script>

<title>althruist:portfolio</title>
<div id="content">
    <!-- Welcome Card -->
    <PageHeader id="welcomeHeader">
        <div class="headerContent">
            <h1 class="emphasis">hey, i'm <span class="name">kieran</span>!</h1>
        </div>
    </PageHeader>

    <div class="flexCards">
        <!-- Example Flex Card -->
        <Card class="card" id="linksCard">
            <h2>flex card</h2>
            <p id="altText">alt text</p>
        </Card>
    </div>
</div>
