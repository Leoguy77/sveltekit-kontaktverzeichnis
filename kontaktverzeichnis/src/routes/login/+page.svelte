<script lang="ts">
  import { TextInput, Button, PasswordInput, InlineNotification } from "carbon-components-svelte"
  import { enhance } from "$app/forms"
  export let data: any
  export let form: any
  import { page } from "$app/stores"

  let previousPage = $page.url.searchParams.get("lastPage")
</script>

<div class="middle">
  {#if !data.user}
    <form action="?/login" method="POST" class="center" use:enhance>
      <TextInput name="email" type="text" labelText="Benutzername" placeholder="user@example.com" />

      <PasswordInput name="password" labelText="Passwort" placeholder="mySecretPassword" />

      <input type="hidden" name="previousPage" value={previousPage} />

      <Button type="submit">Anmelden</Button>
      {#if form?.error}
        <InlineNotification kind="error" title="Error" subtitle={form?.error} />
      {/if}
    </form>
  {:else}
    <h3>Angemeldet als: {data.user.name}</h3>
    <form action="?/logout" method="POST" use:enhance>
      <Button type="submit">Abmelden</Button>
    </form>
  {/if}
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    width: 50%;
  }
  .middle {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 5rem;
  }
  h3 {
    margin-bottom: 1rem;
  }
</style>
