<script lang="ts">
  import ThemeSwitch from "../components/ThemeSwitch.svelte"
</script>

<header>
  <a href="/"><h2>Telefonbuch</h2></a>
  <div class="hd-btn">
    <ThemeSwitch dark="g100" light="white"/>
    <a href="/login">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="login-btn" viewBox="0 0 16 16">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
      </svg>
    </a>
  </div>
  
</header>

<slot />

<style>
  a{
    color: var(--cds-text-01);
    text-decoration: none;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--cds-ui-03);
  }
  .hd-btn{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .login-btn{
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 1rem 0 1rem;
    cursor: pointer;
  }
</style>
