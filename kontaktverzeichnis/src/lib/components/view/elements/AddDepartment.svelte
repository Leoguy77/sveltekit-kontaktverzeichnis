<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button } from "carbon-components-svelte"
  import tranformForCombobox from "./comboBoxTransform.ts"
  import type { person } from "$lib/shared/prismaTypes.ts"

  export let popup: string
  export let data: any
  let abteilungId: string

  let state: any
  if (data.person) {
    state = data.person
  } else if (data.ressource) {
    state = data.ressource
  }

  let abteilungen: any = []
  ;(async () => {
    const response = await fetch("/api/abteilung")
    abteilungen = await response.json()
  })()

  function filterEintrag(item: any, value: any) {
    if (!value) return true
    return item.text.toLowerCase().includes(value.toLowerCase())
  }

  function ok() {
    let alreadyThere = state.abteilung.filter((obj: any) => {
      if (obj.id === abteilungId) {
        return true
      }
    })
    if (alreadyThere.length > 0) {
      popup = ""
      return
    }

    state.abteilung.push({
      bezeichnung: abteilungen.find((s: any) => s.id === abteilungId).bezeichnung,
      id: abteilungId,
    })
    state.abteilung = state.abteilung
    data.ressource = state
    popup = ""
  }
</script>

<Popup bind:popup>
  <ComboBox
    titleText="Abteilung"
    placeholder="Abteilung auswählen"
    items={tranformForCombobox(abteilungen)}
    shouldFilterItem={filterEintrag}
    bind:selectedId={abteilungId}
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
