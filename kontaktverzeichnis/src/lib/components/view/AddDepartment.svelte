<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import {ComboBox,Button} from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  
  export let form: any
  export let popup: string
  let abteilungId:string

  let abteilungen:any=[]
  async function getEintragTyp() {
    const response = await fetch('/api/abteilung')
    let res = await response.json()
    for (let eintrag of res) {
      abteilungen.push({ id: eintrag.id, text: eintrag.bezeichnung })
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
      titleText="Abteilung"
      placeholder="Abteilung auswählen"
      items={abteilungen}
      shouldFilterItem={filterEintrag}
      bind:selectedId={abteilungId}
      required
    />
    <input type="hidden" name="abteilung" bind:value={abteilungId} />
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