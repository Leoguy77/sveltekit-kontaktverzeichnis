<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button, Form, TextInput } from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  import { goto } from "$app/navigation"

  export let form: any
  export let popup: string

  let formData: any
  let department: string
  let standorte: any = []
  let standortId: string = ""
  let filterEintrag: any = (item: any, value: string) => {
    return item.bezeichnung.toLowerCase().includes(value.toLowerCase())
  }

  async function submitForm() {
    let result = await fetch("/api/abteilung", {
      method: "POST",
      body: JSON.stringify({
        bezeichnung: department,
      }),
    })
    const json = await result.json()
    await goto("/abteilung/id/" + json.id)
  }
</script>

<Popup bind:popup bind:form>
  <div class="Popup">
    <h4>Neue Abteilung</h4>
    <br />
    <form class="center" on:submit|preventDefault={submitForm}>
      <div class="TextInput">
        <TextInput
          labelText="Bezeichnung"
          helperText="Name der Abteilung"
          placeholder="Abteilungsname"
          required
          size="xl"
          id="test"
          bind:value={department} />
      </div>
      <div class="Button">
        <Button type="submit">OK</Button>
      </div>
      
    </form>
  </div>
</Popup>

<style>
  .TextInput {
    margin-bottom: 1vh;
  }
.Button{
  text-align: right;
}
  .Popup {
    width: 28vw;
  }
</style>
