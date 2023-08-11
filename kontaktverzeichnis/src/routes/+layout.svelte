<script lang="ts">
  import ThemeSwitch from "$lib/components/layout/ThemeSwitch.svelte"
  import { ToastNotification } from "carbon-components-svelte"
  import { page } from "$app/stores"
  import { dismissToast, toasts } from "$lib/client/store.ts"

  let currentPage: any
  $: {
    if (!$page.url.pathname.startsWith("/login")) {
      currentPage = $page.url.pathname
    }
  }
</script>

<header>
  <a href="/" class="start-btn">
    <div class="white-logo">
      <img src={"/cust/logo.svg"} alt="" />
      <h2>Kontaktverzeichnis</h2>
    </div>
  </a>
  <div class="hd-btn">
    <ThemeSwitch dark="g100" light="g10" />
    <a href="/login?lastPage={currentPage}">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="login-btn" viewBox="0 0 16 16">
        <path
          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
      </svg>
    </a>
  </div>
</header>

<div class="toast">
  {#if $toasts}
    <section>
      {#each $toasts as toast (toast.id)}
        <ToastNotification
          kind={toast.kind}
          title={toast.title}
          subtitle={toast.subtitle}
          on:close={() => {
            dismissToast(toast.id)
          }} />
      {/each}
    </section>
  {/if}
</div>

<slot />

<style>
  .toast {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .hd-btn > a,
  header > a {
    color: #f4f4f4;
    text-decoration: none;
  }
  .white-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .white-logo > img {
    width: 200px;
    background-filter: invert(1);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #bc4c08;
  }
  .hd-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .login-btn {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 1rem 0 1rem;
    cursor: pointer;
  }
</style>
