<script lang="ts">
  import type { PageData } from "./$types.ts"
  import Ressource from "$lib/components/view/Ressource.svelte"

  export let data: any
</script>

<section>
  {#if data?.user}
    <svelte:component this={Ressource} edit={true} bind:data />
  {:else}
    <svelte:component this={Ressource} edit={false} bind:data />
  {/if}
</section>

<style>
  section {
    margin: 2rem 3.5rem 0 3.5rem;
  }
</style>
