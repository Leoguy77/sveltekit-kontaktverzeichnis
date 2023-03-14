<script lang="ts">
  import Ressource from "$lib/components/view/Ressource.svelte"

  export let form: any
  export let data: any
</script>

<section>
  {#if data?.user}
    <svelte:component this={Ressource} bind:form edit={true} bind:data />
  {:else}
    <svelte:component this={Ressource} bind:form edit={false} bind:data />
  {/if}
</section>

<style>
  section {
    margin: 2rem 3.5rem 0 3.5rem;
  }
</style>
