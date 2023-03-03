<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import {ComboBox,Button} from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  
  export let form: any
  export let popup: string
  let standortId:string

  let standorte:any=[]
  async function getEintragTyp() {
    const response = await fetch('/api/standort')
    let res = await response.json()
    for (let eintrag of res) {
      standorte.push({ id: eintrag.id, text: eintrag.bezeichnung })
    }
  }
  getEintragTyp()

  function filterEintrag(item:any, value:any){
    if (!value) return true;
    return item.text.toLowerCase().includes(value.toLowerCase());
  }
  
  function closePopup(){
    form=null
    setTimeout(() => {
      popup=""
    }, 50);
  }
  </script>
  
  
  <Popup bind:popup={popup} bind:form={form}>
    <form action="?/addDepartment" method="POST" class="center" use:enhance>
    <ComboBox
      titleText="Standort"
      placeholder="Standort auswählen"
      items={standorte}
      shouldFilterItem={filterEintrag}
      bind:selectedId={standortId}
      required
    />
    <input type="hidden" name="standort" bind:value={standortId} />
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