<script lang="ts">
  import { enhance } from "$app/forms"
  import AddIcon from '$lib/icons/AddIcon.svelte'
  import {
    ContentSwitcher,
    Switch,
    Search,
    Button,
    Link,
    DataTable,
    Loading,
    OverflowMenu,
    OverflowMenuItem
  } from "carbon-components-svelte"



  import Person from "$lib/components/person/Person.svelte";

  export let form: any
  export let data: any

</script>
<section>
  {#if data.user}
    <Person bind:form={form} edit={true} bind:data={data} />
    {:else}
    <Person bind:form={form} edit={false} bind:data={data} />
  {/if}
</section>



<style>
  section{
    margin: 2rem 2rem 0 2rem;
  }
  .center{
    display: flex;
    align-items: center;
  }
  .center-hd > form {
    width: 100%;
  }
</style>
