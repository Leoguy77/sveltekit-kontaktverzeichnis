<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import {TextInput,ComboBox,Button} from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  
  export let form: any
  export let popup: string
  let number:string
  let standortId:string
  let eintragTypId:string
  
  function setVorwahl(vorwahl:string){
    number=vorwahl
  }
  $:{setVorwahl(vorwahlen[standortId])}
  
  let EintragTypen:any=[]
  async function getEintragTyp() {
    const response = await fetch('/api/eintragTyp')
    let res = await response.json()
    for (let eintrag of res) {
      EintragTypen.push({ id: eintrag.id, text: eintrag.bezeichner })
    }
  }
  getEintragTyp()
  
  let vorwahlen:any=[]
  let standorte:any=[]
  async function getStandorte() {
    const response = await fetch('/api/standort')
    let res = await response.json()
    for (let standort of res) {
      standorte.push({ id: standort.id, text: standort.bezeichnung })
      vorwahlen[standort.id]=standort.vorwahl
    }
  }
  getStandorte()
  
  function filterEintrag(item:any, value:any){
    if (!value) return true;
    return item.text.toLowerCase().includes(value.toLowerCase());
  }
  
  function closePopup(){
    setTimeout(() => {
      popup=""
    }, 50);
  }
  </script>
  
  
  <Popup bind:popup={popup} bind:form={form}>
    <form action="?/addNumber" method="POST" class="center" use:enhance>
      <ComboBox
      titleText="Eintrags-Typ"
      placeholder="Eintrags-Typ auswählen"
      items={EintragTypen}
      shouldFilterItem={filterEintrag}
      bind:selectedId={eintragTypId}
    />
    <ComboBox 
      titleText="Standort"
      placeholder="Standort auswählen"
      items={standorte}
      shouldFilterItem={filterEintrag}
      bind:selectedId={standortId}
    />
  
    <input type="hidden" name="eintragTyp" bind:value={eintragTypId} />
    <input type="hidden" name="standort" bind:value={standortId} />
    <TextInput name="number" labelText="Nummer" placeholder="Nummer eintragen" bind:value={number} />
    <div class="Button">
      <Button type="submit" on:click={closePopup} >Ok</Button>
    </div>
  </form>
  
  </Popup>
  
  <style>
  .Button{
    margin-top: 1rem;
  }
  </style>