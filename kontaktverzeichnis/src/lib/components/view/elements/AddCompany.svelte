<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button } from "carbon-components-svelte"
  import tranformForCombobox from "./comboBoxTransform.ts"
  import type { person } from "$lib/shared/prismaTypes.ts"

  export let popup: string
  export let data: any
  let standortId: string

  let standorte: any = []
  ;(async () => {
    const response = await fetch("/api/standort")
    standorte = await response.json()
  })()

  function filterEintrag(item: any, value: any) {
    if (!value) return true
    return item.text.toLowerCase().includes(value.toLowerCase())
  }

  function ok() {
    data.person.standort.push({
      bezeichnung: standorte.find((s: any) => s.id === standortId).bezeichnung,
      vorwahl: standorte.find((s: any) => s.id === standortId).vorwahl,
    })
    data.person.standort = data.person.standort
    popup = ""
  }
</script>

<Popup bind:popup>
  <ComboBox
    titleText="Standort"
    placeholder="Standort auswählen"
    items={tranformForCombobox(standorte)}
    shouldFilterItem={filterEintrag}
    bind:selectedId={standortId}
    required />
  <div class="Button">
    <Button on:click={ok}>Ok</Button>
  </div>
</Popup>

<style>
  .Button {
    margin-top: 1rem;
  }
</style>
