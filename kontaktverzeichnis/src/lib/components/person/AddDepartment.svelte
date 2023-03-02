<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import {TextInput,Button} from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  
  export let form: any
  export let popup: string
  let bezeichnung:string
  
  function closePopup(){
    setTimeout(() => {
      popup=""
    }, 50);
  }
  </script>
  
  
  <Popup bind:popup={popup} bind:form={form}>
    <form action="?/addDepartment" method="POST" class="center" use:enhance>
      
    <TextInput name="department" labelText="Bezeichnung" placeholder="Bezeichnung eintragen" bind:value={bezeichnung} />
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