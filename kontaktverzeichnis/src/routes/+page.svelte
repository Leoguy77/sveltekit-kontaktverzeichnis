<script async lang="ts">
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import SearchTable from "$lib/components/start/SearchTable.svelte"
  import DepartmentTable from "$lib/components/start/DepartmentTable.svelte"
  import NewDepartment from "$lib/components/start/NewDepartment.svelte"
  import { ContentSwitcher, Switch, Search, Button, OverflowMenu, OverflowMenuItem, Loading } from "carbon-components-svelte"
  import { goto } from "$app/navigation"
  import { navigating, page } from "$app/stores"
  import { browser } from "$app/environment"

  export let data: any

  // Helper Functions
  function paramToSortDirection(param: string | null): "none" | "ascending" | "descending" | undefined {
    if (!param) {
      return undefined
    }
    switch (param) {
      case "ascending":
        return "ascending"
      case "descending":
        return "descending"
      default:
        return "none"
    }
  }

  function setUrlParams(urlParam: UrlParam) {
    if (urlParam.searchStr) {
      $page.url.searchParams.set("q", urlParam.searchStr)
    } else {
      $page.url.searchParams.delete("q")
    }
    if (urlParam.sortDirection !== "none") {
      $page.url.searchParams.set("sortDirection", urlParam.sortDirection)
    } else {
      $page.url.searchParams.delete("sortDirection")
    }
    if (urlParam.page !== 1) {
      $page.url.searchParams.set("page", urlParam.page.toString())
    } else {
      $page.url.searchParams.delete("page")
    }
    if (browser) {
      goto(`?${$page.url.searchParams.toString()}`, { keepFocus: true, invalidateAll: true })
    }
  }

  // URL Params
  interface UrlParam {
    searchStr: string
    sortDirection: "none" | "ascending" | "descending"
    page: number
  }

  let urlParam: UrlParam = {
    searchStr: $page.url.searchParams.get("q") || "",
    sortDirection: paramToSortDirection($page.url.searchParams.get("sortDirection")) || "none", //TODO:
    page: parseInt($page.url.searchParams.get("page") || "1"), //TODO:
  }

  $: if (urlParam) {
    setUrlParams(urlParam)
  }

  // Departement Search
  let selectedSearch: number
  let departmentSearchTxt: string
  let departments: any

  async function loadDepartment() {
    const response = await fetch("/api/abteilung")
    departments = await response.json()
    departments = departments.map((department: any) => {
      return {
        id: department.id,
        name: department.bezeichnung,
        mitarbeiter: department._count.person + department._count.ressource,
      }
    })
  }

  $: if (selectedSearch) {
    if (!departments) {
      loadDepartment()
    }
  }

  // Normal Search

  let searchResult: any
  $: searchResult = data.searchResult

  // Popups
  let popups: any = {
    NewDepartment: NewDepartment,
  }
  let popup: string = ""
</script>

<svelte:head>
  <title>Kontaktverzeichnis</title>
</svelte:head>
{#if popup}
  <svelte:component this={popups[popup]} bind:popup />
{/if}
<div class="center-hd">
  <div class="contentSwitcher">
    <ContentSwitcher bind:selectedIndex={selectedSearch}>
      <Switch text="Allgemeine Suche" />
      <Switch text="Abteilungen" />
    </ContentSwitcher>
  </div>
  <div class="center-hd w100">
    <div class="search">
      {#if selectedSearch == 0}
        <Search
          name="entitiySearchTxt"
          placeholder="Kontaktverzeichnis durchsuchen..."
          bind:value={urlParam.searchStr}
          on:clear={() => {
            searchResult = undefined
          }} />
      {:else}
        <Search
          name="departmentSearchTxt"
          placeholder="Abteilungen durchsuchen..."
          bind:value={departmentSearchTxt}
          on:clear={() => {
            departmentSearchTxt = ""
          }} />
      {/if}
    </div>
    {#if data.user}
      {#if selectedSearch === 0}
        <div class="add">
          <OverflowMenu icon={AddIcon}>
            <OverflowMenuItem href="/person/new" text="Person erstellen" />
            <OverflowMenuItem href="/ressource/new" text="Ressource erstellen" />
          </OverflowMenu>
        </div>
      {:else if selectedSearch === 1}
        <div class="add2">
          <Button
            icon={AddIcon}
            on:click={() => {
              popup = "NewDepartment"
            }}
            size="small"
            kind="ghost"
            iconDescription="Abteilung erstellen" />
        </div>
      {/if}
    {/if}
    {#if $navigating}
      <div class="loading">
        <Loading withOverlay={false} />
      </div>
    {:else}
      <section class="rs-table">
        {#if selectedSearch == 0}
          {#if searchResult}
            <SearchTable bind:searchResult bind:page={urlParam.page} bind:sortDirection={urlParam.sortDirection} />
          {/if}
        {:else if selectedSearch == 1}
          {#if departments}
            <DepartmentTable bind:departments bind:searchTxt={departmentSearchTxt} />
          {/if}
        {/if}
      </section>
    {/if}
  </div>
</div>

<style>
  section.rs-table {
    width: calc(100% - 6rem);
  }
  @media all and (min-width: 955px) {
    .add {
      position: absolute;
      top: 213px;
      left: calc(100% - 12rem);
      margin-right: 3rem;
      z-index: 10;
    }
    .add2 {
      position: absolute;
      top: 217px;
      left: calc(100% - 12rem + 2px);
      margin-right: 3rem;
      z-index: 10;
    }
  }

  @media all and (max-width: 955px) {
    .add {
      display: none;
    }
    .add2 {
      display: none;
    }
  }
  .w100 {
    width: 100%;
  }
  .search {
    width: 550px;
    display: flex;
  }
  .contentSwitcher {
    width: 350px;
  }
  .center-hd {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 3rem;
    align-items: center;
  }
  :global(.bx--content-switcher-btn) {
    display: flex;
    justify-content: center;
  }
  .loading {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
  }
</style>
