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

  interface PageState {
    entitiySearchTxt: string
    departmentSearchTxt: string
    entityTableState: {
      page: number
      sortDirection: "none" | "ascending" | "descending"
      sortKey: string | undefined
    }
    departmentTableState: {
      page: number
      sortDirection: "none" | "ascending" | "descending"
      sortKey: string | undefined
    }
    departments: any
    searchResult: any
    selectedSearch: number
  }

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

  let pageData: PageState = {
    entitiySearchTxt: "",
    departmentSearchTxt: "",
    entityTableState: {
      page: parseInt($page.url.searchParams.get("page") || "1"),
      sortDirection: paramToSortDirection($page.url.searchParams.get("sortDirection")) || "none",
      sortKey: $page.url.searchParams.get("sortKey") || undefined,
    },
    departmentTableState: {
      page: parseInt($page.url.searchParams.get("page") || "1"),
      sortDirection: paramToSortDirection($page.url.searchParams.get("sortDirection")) || "none",
      sortKey: $page.url.searchParams.get("sortKey") || undefined,
    },
    departments: undefined,
    searchResult: undefined,
    selectedSearch: parseInt($page.url.searchParams.get("selectedSearch") || "0"),
  }

  $: {
    if (pageData.entityTableState.sortDirection !== "none") {
      $page.url.searchParams.set("sortDirection", pageData.entityTableState.sortDirection)
    } else {
      $page.url.searchParams.delete("sortDirection")
      $page.url.searchParams.delete("sortKey")
    }
    if (pageData.entityTableState.sortKey) {
      $page.url.searchParams.set("sortKey", pageData.entityTableState.sortKey)
    } else {
      $page.url.searchParams.delete("sortKey")
    }

    if (pageData.entityTableState.page !== 1) {
      $page.url.searchParams.set("page", pageData.entityTableState.page.toString())
    } else {
      $page.url.searchParams.delete("page")
    }

    if (pageData.selectedSearch != 0) {
      $page.url.searchParams.set("selectedSearch", pageData.selectedSearch.toString())
    } else {
      $page.url.searchParams.delete("selectedSearch")
    }

    pageData.entitiySearchTxt = pageData.entitiySearchTxt.replace(/[/?=]|\s\s/g, "")
    if (pageData.entitiySearchTxt.trim().length > 0) {
      $page.url.searchParams.set("search", pageData.entitiySearchTxt)
    } else {
      $page.url.searchParams.delete("search")
    }

    if (browser) {
      goto(`?${$page.url.searchParams.toString()}`, { keepFocus: true })
    }
  }

  $: pageData.departments = data.departments
  let popups: any = {
    NewDepartment: NewDepartment,
  }
  let popup: string = ""

  function removeEntityTable() {
    pageData.searchResult = undefined
    pageData.entitiySearchTxt = ""
  }
  $: pageData.searchResult = data.searchResult

  function clearDepartmentSearch() {
    pageData.departmentSearchTxt = ""
  }
</script>

<svelte:head>
  <title>Kontaktverzeichnis</title>
</svelte:head>
{#if popup}
  <svelte:component this={popups[popup]} bind:popup />
{/if}
<div class="center-hd">
  <div class="contentSwitcher">
    <ContentSwitcher bind:selectedIndex={pageData.selectedSearch}>
      <Switch text="Allgemeine Suche" />
      <Switch text="Abteilungen" />
    </ContentSwitcher>
  </div>
  <div class="center-hd w100">
    <div class="search">
      {#if pageData.selectedSearch == 0}
        <Search
          name="entitiySearchTxt"
          placeholder="Kontaktverzeichnis durchsuchen..."
          bind:value={pageData.entitiySearchTxt}
          on:clear={removeEntityTable} />
      {:else}
        <Search
          name="departmentSearchTxt"
          placeholder="Abteilungen durchsuchen..."
          bind:value={pageData.departmentSearchTxt}
          on:clear={clearDepartmentSearch} />
      {/if}
    </div>
    {#if data.user}
      {#if pageData.selectedSearch === 0}
        <div class="add">
          <OverflowMenu icon={AddIcon}>
            <OverflowMenuItem href="/person/new" text="Person erstellen" />
            <OverflowMenuItem href="/ressource/new" text="Ressource erstellen" />
          </OverflowMenu>
        </div>
      {:else if pageData.selectedSearch === 1}
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
    {/if}
    <section class="rs-table">
      {#if pageData.selectedSearch == 0}
        {#if pageData.searchResult}
          <SearchTable
            bind:searchResult={pageData.searchResult}
            bind:page={pageData.entityTableState.page}
            bind:sortDirection={pageData.entityTableState.sortDirection} />
        {/if}
      {:else if pageData.selectedSearch == 1}
        {#if pageData.departments}
          <DepartmentTable bind:departments={pageData.departments} bind:searchTxt={pageData.departmentSearchTxt} />
        {/if}
      {/if}
    </section>
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
