<script lang="ts">
  import Popup from "$lib/components/Popup.svelte"
  import { TextInput, ComboBox, Button } from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  import tranformForCombobox from "./comboBoxTransform.ts"

  export let data: any
  export let popup: string
  let number: string
  let eintragTypen: any = []
  let standorte: any = []
  let standortId: number
  let eintragTypId: number

  function setVorwahl(standortId: number) {
    number = standorte.find((el: any) => el.id === standortId).vorwahl
  }
  $: if (standortId) {
    setVorwahl(standortId)
  }

  ;(async () => {
    let eintragTypenRequest = fetch("/api/eintragTyp")
    let standorteRequest = fetch("/api/standort")
    let res = await Promise.all([eintragTypenRequest, standorteRequest])
    eintragTypen = await res[0].json()
    standorte = await res[1].json()
  })()

  function filterEintrag(item: any, value: any) {
    if (!value) return true
    return item.text.toLowerCase().includes(value.toLowerCase())
  }

  function ok() {
    data.person.telefonEintrag.push({
      nummer: number,
      personId: data.person.id,
      ressourceId: null,
      eintragTyp: eintragTypen.find((el: any) => el.id === eintragTypId),
      standort: standorte.find((el: any) => el.id === standortId),
    })
    data.person.telefonEintrag = data.person.telefonEintrag
    popup = ""
  }
</script>

<Popup bind:popup>
  <ComboBox
    titleText="Eintrags-Typ"
    placeholder="Eintrags-Typ auswählen"
    items={tranformForCombobox(eintragTypen)}
    shouldFilterItem={filterEintrag}
    bind:selectedId={eintragTypId}
    required />
  <ComboBox
    titleText="Standort"
    placeholder="Standort auswählen"
    items={tranformForCombobox(standorte)}
    shouldFilterItem={filterEintrag}
    bind:selectedId={standortId}
    required />

  <TextInput name="number" labelText="Nummer" placeholder="Nummer eintragen" bind:value={number} required />
  <div class="Button">
    <Button on:click={ok}>Ok</Button>
  </div>
</Popup>

<style>
  .Button {
    margin-top: 1rem;
  }
</style>
