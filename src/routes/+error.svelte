<script>
    import { page } from "$app/state";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";

    let message = "";
    let historyAvailable;

    switch (page.status) {
        default:
            message = page.error.message;
        case 404:
            message = "Sorry, this page doesn't seem like it exists. :(";
    }
    if (typeof window !== "undefined") {
        historyAvailable = window.history.length > 1;
    }
</script>

<Card style="text-align: center;">
    <h1>{page.status}</h1>
    <hr />
    <h4>{message}</h4>
    <div class="selectorButtons">
        <Button text="Home" link="/"></Button>
        {#if historyAvailable}
            <Button text="Go Back" className="outline" link="/goback"></Button>
        {/if}
    </div>
</Card>

<style>
    h1 {
        font-size: 100px;
    }

    .selectorButtons{
        margin-top: 40px;
        margin-bottom: 20px;
    }
</style>
