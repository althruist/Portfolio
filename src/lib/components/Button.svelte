<script>
    import gsap from "gsap";
    import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    export let button;

    export let id = "";
    export let className = "";
    export let text = "";
    export let link;

    let isHovering = false;

    onMount(() => {
        if (className != "") {
            className = ` ${className}`;
        }
    })

    function click(){
        if(link == "/goback"){
            window.history.back();
            return;
        }
        window.location.href = link;
    }
</script>

<input bind:this={button} type="button" {id} class="button interactable{className}" value={text} on:click={click}>
