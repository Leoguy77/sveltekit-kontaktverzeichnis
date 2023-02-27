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
  import { invalidateAll } from '$app/navigation';


  import Person from "$lib/components/person/Person.svelte";

  export let form: any
  export let data: any

  // $:{
  //   console.log(data.person.expand.telefonEintraege)
  // }


  // $:if (form?.success){
  //   reload()
  //   console.log("success")
  // }

  // async function reload(){
  //   await invalidateAll()
  // }

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
    margin: 2rem 2rem 0 2rem;
  }
</style>
