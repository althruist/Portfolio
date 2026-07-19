<script>
  import { page } from "$app/state";
  import Button from "$lib/components/Button.svelte";
  import Card from "$lib/components/Card.svelte";

  let message = "";

  switch (page.status) {
    default:
      message = page.error.message;
    case 404:
      message = "Sorry, this page doesn't exist. :(";
  }
</script>

<br />
<br />
<br />
<br />
<br />
<br />

<Card className="fourohfour" style="text-align: center;">
  <h1>{page.status}</h1>
  <hr />
  <h4>{message}</h4>
  <div class="selectorButtons">
    <Button text="Take me back!" link="/goback"></Button>
  </div>
</Card>

<br />
<br />
<br />
<br />

<style>
  h1 {
    font-size: 14vw;
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 7vw;
    }
  }

  .selectorButtons {
    margin-top: 40px;
    margin-bottom: 20px;
  }
</style>
