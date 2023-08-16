<script lang="ts">
  import { Tile, TextInput, ToastNotification, Button, Tag } from "carbon-components-svelte"
  import TextField from "$lib/components/TextField.svelte"
  import AcceptIcon from "$lib/icons/AcceptIcon.svelte"
  import DeleteIcon from "$lib/icons/DeleteIcon.svelte"
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import NumberRow from "./elements/NumberRow.svelte"
  import AddNumber from "./elements/AddNumber.svelte"
  import AddDepartment from "./elements/AddDepartment.svelte"
  import AddCompany from "./elements/AddCompany.svelte"
  import type { person } from "$lib/shared/prismaTypes.ts"
  import { goto, invalidateAll } from "$app/navigation"
  import { addToast } from "$lib/client/store.ts"

  let popups: any = {
    AddNumber: AddNumber,
    AddDepartment: AddDepartment,
    AddCompany: AddCompany,
  }
  let popup: string = ""

  export let data: { person: person }

  export let edit: boolean

  let Combofield: any
  if (edit) {
    Combofield = TextInput
  } else {
    Combofield = TextField
  }

  let name: string = ""

  $: if (data.person) {
    name = ""
    if (data.person.titel != undefined) {
      name = data.person.titel + " "
    }
    name += data.person.vorname + " " + data.person.nachname
  }

  let telefonEintraege: any = []

  function getTelefonEintraege() {
    let telefonEintraege: any = []
    if (data.person.telefonEintrag) {
      for (let eintrag of data.person.telefonEintrag) {
        let standort = eintrag.standort.bezeichnung

        if (telefonEintraege[standort]) {
          telefonEintraege[standort].push(eintrag)
        } else {
          telefonEintraege[standort] = [eintrag]
        }
      }
    }
    return telefonEintraege
  }

  $: if (data.person.telefonEintrag) {
    telefonEintraege = getTelefonEintraege()
  }

  let departments: any = []
  $: if (data.person.abteilung) {
    departments = data.person.abteilung
  }

  let companies: any = []
  $: if (data.person.standort) {
    companies = data.person.standort
  }

  function delNumber(id: number) {
    data.person.telefonEintrag = data.person.telefonEintrag.filter((e) => e.id != id)
  }

  function delDepartment(id: number) {
    data.person.abteilung = data.person.abteilung.filter((e) => e.id != id)
  }

  function delCompany(id: number) {
    data.person.standort = data.person.standort.filter((e) => e.id != id)
  }

  async function save() {
    let res: Response
    if (data.person.id) {
      res = await fetch(`/api/person/`, {
        method: "PATCH",
        body: JSON.stringify(data.person),
      })
      invalidateAll()
    } else {
      res = await fetch(`/api/person/`, {
        method: "POST",
        body: JSON.stringify(data.person),
      })
      let userId = (await res.json()).id
      goto(`/person/${userId}`)
    }
    if (res.ok) {
      addToast({ title: "Erfolgreich", subtitle: "Person gespeichert", kind: "success", timeout: 5000 })
    } else {
      addToast({ title: "Fehler", subtitle: "Person konnte nicht gespeichert werden", kind: "error", timeout: 5000 })
    }
  }

  async function delPerson(id: number) {
    let res = await fetch(`/api/person/`, {
      method: "DELETE",
      body: JSON.stringify({ id: data.person.id }),
    })
    if (res.ok) {
      addToast({ title: "Erfolgreich", subtitle: "Person gelöscht", kind: "success", timeout: 5000 })
      goto("/")
    } else {
      addToast({ title: "Fehler", subtitle: "Person konnte nicht gelöscht werden", kind: "error", timeout: 5000 })
    }
  }
</script>

<svelte:head>
  <title>{name}</title>
</svelte:head>

{#if popup}
  <svelte:component this={popups[popup]} bind:popup bind:data />
{/if}
<div class="head">
  <div class="line">
    <svg xmlns="http://www.w3.org/2000/svg" width="36" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path
        fill-rule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
    </svg>
    <h2>{name}</h2>
  </div>
  {#if edit}
    <button
      class="blank-btn"
      on:click={() => {
        delPerson(data.person.id)
      }}>
      <DeleteIcon size={24} />
    </button>
  {/if}
</div>
<div class="grid">
  <Tile>
    <h4 class="category">Persönliche Daten</h4>
    <div class="line">
      <Combofield labelText="Titel" bind:value={data.person.titel} />
      <Combofield labelText="Vorname" bind:value={data.person.vorname} />
      <Combofield labelText="Nachname" bind:value={data.person.nachname} />
    </div>
    <div class="line">
      <Combofield labelText="E-Mail" bind:value={data.person.email} />
      <a href="mailto:{data.person.email}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="currentColor" class="bi bi-envelope-at mail" viewBox="0 0 16 16">
          <path
            d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
          <path
            d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
        </svg>
      </a>
    </div>
    {#if edit}
      <div class="line">
        <Combofield labelText="Personalnummer" bind:value={data.person.personalnummer} />
        <Combofield labelText="Kostenstelle" bind:value={data.person.kostenstelle} />
      </div>
    {/if}
  </Tile>
  <Tile>
    {#if edit}
      <div class="top-right-button">
        <Button
          on:click={() => {
            popup = "AddNumber"
          }}
          icon={AddIcon}
          size="small"
          kind="ghost"
          iconDescription="Nummer hinzufügen" />
      </div>
    {/if}
    <h4 class="category">Telefon</h4>
    {#each Object.keys(telefonEintraege) as standort}
      <div class="company">
        <p>{standort}:</p>
        <table>
          {#each telefonEintraege[standort] as number}
            <NumberRow {number}>
              {#if edit}
                <button
                  class="blank-btn"
                  on:click={() => {
                    delNumber(number.id)
                  }}>
                  <DeleteIcon size={14} />
                </button>
              {/if}
            </NumberRow>
          {/each}
        </table>
      </div>
    {/each}
  </Tile>
  <Tile>
    {#if edit}
      <div class="top-right-button">
        <Button
          on:click={() => {
            popup = "AddDepartment"
          }}
          icon={AddIcon}
          size="small"
          kind="ghost"
          iconDescription="Abteilung hinzufügen" />
      </div>
    {/if}
    <h4 class="category">Abteilung</h4>
    {#each departments as abteilung (abteilung.id)}
      <div class="departments">
        <a href={`/abteilung/${abteilung.id}`}>
          <Tag interactive>{abteilung.bezeichnung}</Tag>
        </a>
        {#if edit}
          <button
            class="blank-btn"
            on:click={() => {
              delDepartment(abteilung.id)
            }}>
            <DeleteIcon size={14} />
          </button>
        {/if}
      </div>
    {/each}
  </Tile>
  <Tile>
    {#if edit}
      <div class="top-right-button">
        <Button
          on:click={() => {
            popup = "AddCompany"
          }}
          icon={AddIcon}
          size="small"
          kind="ghost"
          iconDescription="Standort hinzufügen" />
      </div>
    {/if}
    <h4 class="category">Standort</h4>
    {#each companies as standort (standort.id)}
      <div class="departments">
        <Tag>{standort.bezeichnung}</Tag>
        {#if edit}
          <button
            class="blank-btn"
            on:click={() => {
              delCompany(standort.id)
            }}>
            <DeleteIcon size={14} />
          </button>
        {/if}
      </div>
    {/each}
  </Tile>
  {#if edit}
    <Button on:click={save}>Speichern</Button>
  {/if}
</div>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .line {
    display: flex;
    gap: 1rem;
  }
  .blank-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
  }
  .departments {
    display: flex;
    align-items: center;
  }
  .company {
    margin-bottom: 1rem;
  }
  .top-right-button {
    position: relative;
    right: calc(-100% + 2rem);
    height: 0px;
    width: 0px;
  }
  .mail {
    position: relative;
    top: 2.2rem;
    color: var(--cds-text-01);
  }
  .category {
    margin-bottom: 1rem;
  }
  @media all and (min-width: 955px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }

  @media all and (max-width: 955px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 1rem;
    }
  }
</style>
