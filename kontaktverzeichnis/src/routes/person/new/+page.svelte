<script lang="ts">
  import { enhance } from "$app/forms"
  import AddIcon from '$lib/components/AddIcon.svelte'
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

  let selectedIndex: number

  export let form: any
  export let data: any
  let loading = false

  $: if (form?.data || form?.nodata) {
    loading = false
  }

  function search() {
    loading = true
    form = null
  }

  function sortName(a:any,b:any){
    if(a.name < b.name) { return -1 }
    if(a.name > b.name) { return 1 }
    return 0
  }
</script>

<div class="center-hd">

</div>


<!-- <style>
  .center{
    display: flex;
    align-items: center;
  }
  .center-hd > form {
    width: 100%;
  }
</style> -->
