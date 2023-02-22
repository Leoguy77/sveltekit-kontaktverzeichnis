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

  let personData = {}


</script>

<Person bind:personData={personData} />



<!-- <style>
  .center{
    display: flex;
    align-items: center;
  }
  .center-hd > form {
    width: 100%;
  }
</style> -->
