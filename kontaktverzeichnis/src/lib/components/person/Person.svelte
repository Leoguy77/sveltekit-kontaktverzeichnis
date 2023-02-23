<script lang="ts">
  // export let personData: any
  import {Tile,TextInput} from "carbon-components-svelte"
  import TextField from "$lib/components/TextField.svelte";
  export let data: any
  export let edit: boolean

  let Combofield:any
  if (edit){
    Combofield=TextInput
  }else{
    Combofield=TextField
  }

  
  let name=""
  $:{
    if(data.person.titel){
    name=data.person.titel+" "
    }
    name+=data.person.vorname+" "+data.person.nachname
  }
  
</script>


<div class="line">
  <svg xmlns="http://www.w3.org/2000/svg" width="36" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" /> </svg>
  <h2>{name}</h2>
</div>
<div class="grid">
  <Tile light>
    <h4 class="category">Persönliche Daten</h4>
    <div class="line">
      <Combofield labelText="Titel"  bind:value={data.person.titel} />
      <Combofield labelText="Vorname" bind:value={data.person.vorname} />
      <Combofield labelText="Nachname" value={data.person.nachname} />
    </div>
    <div class="line">
      <Combofield labelText="E-Mail" value={data.person.email} />
    </div>
    <!-- {#if data.person.expand}
    <div class="line">

    </div> -->
  </Tile>
  <Tile light></Tile>
  <Tile light>Content</Tile>
  <Tile light>Content</Tile>
</div>



<!-- {#if personData?.name}
  <Link>{personData?.name}</Link>
{/if}  -->

<style>
.line{
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}
.category{
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}
</style>

