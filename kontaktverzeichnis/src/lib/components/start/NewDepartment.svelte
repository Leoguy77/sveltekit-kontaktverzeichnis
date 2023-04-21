<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button, Form, TextInput } from "carbon-components-svelte"
  import { enhance } from "$app/forms"

  export let form: any
  export let popup: string

  let standorte: any = []
  let standortId: string = ""
  let filterEintrag: any = (item: any, value: string) => {
    return item.bezeichnung.toLowerCase().includes(value.toLowerCase())
  }
  function closePopup() {
    popup = ""
  }
</script>

<Popup bind:popup bind:form>
  <div class="Popup">
    <h4>Neue Abteilung</h4>
    <br />
    <form action="?/addDepartment" method="POST" class="center" use:enhance>
      <div class="TextInput">
        <TextInput
          class="TextInput"
          labelText="Bezeichnung"
          helperText="Name der Abteilung"
          placeholder="Abteilungsname"
          required
          size="xl"
          id="test" />
      </div>
    </form>
    <div class="Button">
      <Button type="submit" on:click={closePopup}>OK</Button>
    </div>
  </div>
</Popup>

<style>
  form {
    margin-bottom: 1vh;
  }
  .Button {
    text-align: right;
  }
  .Popup {
    width: 28vw;
  }
</style>
