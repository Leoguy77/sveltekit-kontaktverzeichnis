<script lang="ts">
  // export let personData: any
  import {Tile,TextInput,ToastNotification} from "carbon-components-svelte"
  import TextField from "$lib/components/TextField.svelte"
  import AcceptIcon from '$lib/icons/AcceptIcon.svelte'
  import { enhance } from "$app/forms"
  import NumberTable from "./NumberTable.svelte"
  import Number from "$lib/components/start/Number.svelte"
  export let data: any
  export let form: any
  export let edit: boolean

  let Combofield:any
  if (edit){
    Combofield=TextInput
  }else{
    Combofield=TextField
  }

  let name:string
  $:{
    if(data.person.titel!=undefined){
    name=data.person.titel+" "
    }
    name+=data.person.vorname+" "+data.person.nachname
  }

  // console.log(data)
  function resetForm(){
    form=null
  }

  let telefonEintraege:any = []
  for (let eintrag of data.person.expand.telefonEintraege) {
    let standort=eintrag.expand.standort.bezeichnung
    if (telefonEintraege[standort]){
      telefonEintraege[standort].push(eintrag)
    }else{
      telefonEintraege[standort]=[eintrag]
    }
  }

</script>


{#if form?.error}
<div class="toast">
  <ToastNotification 
    title="Error"
    subtitle="{form.error}"
    timeout={5000}
  />
</div>
{:else if form?.success}
<div class="toast">
  <ToastNotification 
    title="Success"
    kind="success"
    timeout={5000}
  />
</div>
{/if}
<div class="line">
  <svg xmlns="http://www.w3.org/2000/svg" width="36" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" /> </svg>
  <h2>{name}</h2>
</div>
<div class="grid">
  {#if edit}
    <form class="g1-accept" action="?/savePerson" method="POST" use:enhance>
      <label on:click={resetForm} on:keydown>
        <input type="submit" class="hidden" name="data" value="{JSON.stringify(data.person)}"/>
        <AcceptIcon />
      </label>
    </form>
  {/if}
  <Tile light>
    <h4 class="category">Persönliche Daten</h4>
    <div class="line">
      <Combofield labelText="Titel"  bind:value={data.person.titel} />
      <Combofield labelText="Vorname" bind:value={data.person.vorname} />
      <Combofield labelText="Nachname" bind:value={data.person.nachname} />
    </div>
    <div class="line">
      <Combofield labelText="E-Mail" bind:value={data.person.email} />
      <a href="mailto:{data.person.email}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="currentColor" class="bi bi-envelope-at mail" viewBox="0 0 16 16"> <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z"/> <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"/> </svg>
      </a>
    </div>
    {#if data.person.expand.secureData}
      <div class="line">
        <Combofield labelText="Personalnummer" bind:value={data.person.expand.secureData.personalNummer} />
        <Combofield labelText="Kostenstelle" bind:value={data.person.expand.secureData.kostenstelle} />
      </div>
    {/if}
  </Tile>
  <Tile light>
    <h4 class="category">Telefon</h4>
    {#each Object.keys(telefonEintraege) as standort}
      <div class="company">
        <NumberTable data={telefonEintraege[standort]} standort={standort}/>
      </div>
    {/each}
  </Tile>
  <Tile light>
    <h4 class="category">Abteilung</h4>
  </Tile>
  <Tile light>
    <h4 class="category">Standort</h4>
  </Tile>
</div>


<style>
.company{
  margin-bottom: 1rem;
}
.toast{
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}
.hidden{
  display: none;
}
.g1-accept{
  position: absolute;
  top: 11.2rem;
  left: calc(50% - 3rem);
}
.mail{
  position: relative;
  top: 2.2rem;
  color: var(--cds-text-01);
}
.line{
  display: flex;
  gap: 1rem;
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

