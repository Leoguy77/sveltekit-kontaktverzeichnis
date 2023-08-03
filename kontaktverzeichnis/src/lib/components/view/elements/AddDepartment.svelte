<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { ComboBox, Button } from "carbon-components-svelte"
  import tranformForCombobox from "./comboBoxTransform.ts"
  import type { person } from "$lib/shared/prismaTypes.ts"

  export let popup: string
  export let data: any
  let abteilungId: string

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
    let alreadyThere = data.person.abteilung.filter((obj: any) => {
      if (obj.id === abteilungId) {
        return true
      }
    })
    if (alreadyThere.length > 0) {
      popup = ""
      return
    }

    data.person.abteilung.push({
      bezeichnung: abteilungen.find((s: any) => s.id === abteilungId).bezeichnung,
      id: abteilungId,
    })
    data.person.abteilung = data.person.abteilung
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
