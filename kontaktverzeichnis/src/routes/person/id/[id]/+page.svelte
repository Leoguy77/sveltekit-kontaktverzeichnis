<script lang="ts">
  import Person from "$lib/components/view/Person.svelte";

  export let form: any
  export let data: any


</script>
<section>
  {#if data?.user}
    <svelte:component this={Person} bind:form={form} edit={true} bind:data={data}/>
  {:else}
    <svelte:component this={Person} bind:form={form} edit={false} bind:data={data}/>
  {/if}
</section>



<style>
  section{
    margin: 2rem 3.5rem 0 3.5rem;
  }
</style>
