<script lang="ts">
  export let personData: any
  import {Tile} from "carbon-components-svelte"
</script>


<Tile light>Content</Tile>
{#if personData?.name}
  <Link>{personData?.name}</Link>
{/if} 

<style>

</style>

