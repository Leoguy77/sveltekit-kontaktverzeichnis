<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button } from "carbon-components-svelte"
  import tranformForCombobox from "./comboBoxTransform.ts"
  import type { person } from "$lib/shared/prismaTypes.ts"

  export let popup: string
  export let data: any
  let standortId: string

  let state: any
  if (data.person) {
    state = data.person
  } else if (data.ressource) {
    state = data.ressource
  }

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
    let alreadyThere = state.standort.filter((obj: any) => {
      if (obj.id === standortId) {
        return true
      }
    })
    if (alreadyThere.length > 0) {
      popup = ""
      return
    }

    state.standort.push({
      bezeichnung: standorte.find((s: any) => s.id === standortId).bezeichnung,
      vorwahl: standorte.find((s: any) => s.id === standortId).vorwahl,
      id: standortId,
    })
    state.standort = state.standort
    data.ressource = state
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
