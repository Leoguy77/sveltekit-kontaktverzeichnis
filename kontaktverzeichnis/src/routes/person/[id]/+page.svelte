<script lang="ts">
  import type { PageData } from "./$types.ts"
  import Person from "$lib/components/view/Person.svelte"

  export let data: PageData
</script>

<section>
  {#if data?.user}
    <svelte:component this={Person} edit={true} bind:data />
  {:else}
    <svelte:component this={Person} edit={false} bind:data />
  {/if}
</section>

<style>
  section {
    margin: 2rem 3.5rem 0 3.5rem;
  }
</style>
