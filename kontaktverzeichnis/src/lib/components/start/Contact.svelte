<script lang="ts">
  import Number from "./Number.svelte"
  import {Link} from "carbon-components-svelte"
  export let contact: any
  let standortLimit=2
  let numberLimit=2


  let telefonEintraege:any = []
  for (let eintrag of contact.telefonEintraege) {
    if (telefonEintraege[eintrag.standort]){
      telefonEintraege[eintrag.standort].push({nummer: eintrag.nummer, typ: eintrag.eintragTyp})
    } else {
      telefonEintraege[eintrag.standort] = [{nummer: eintrag.nummer, typ: eintrag.eintragTyp}]
    }
  }

  let telefonDataArr:any = []
  for(let key of Object.keys(telefonEintraege)){
    let numberCount = telefonEintraege[key].length
    let subArr=telefonEintraege[key].slice(0,numberLimit)
    telefonDataArr.push({standort: key, count: numberCount,items:subArr})
  }

  telefonDataArr=telefonDataArr.slice(0,standortLimit)

</script>


<div>
  {#if telefonDataArr.length > 1}
    {#each telefonDataArr as standort}
      <p>{standort.standort}:</p>
      <div class="line">
        {#each standort.items as eintrag}
          <Number open={0} showType={false} telefonEintrag={eintrag} />
        {/each}
        {#if standort.count > numberLimit}
          <div class="center">
            <p>+{standort.count-numberLimit}</p>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    {#each telefonDataArr as standort}
      <div class="line">
        {#each standort.items as eintrag}
          <Number open={0} showType={false} telefonEintrag={eintrag} />
        {/each}
        {#if standort.count > numberLimit}
          <div class="center">
            <p>+{standort.count-numberLimit}</p>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
  {#if contact.email}
    <div class="mail">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16"> <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/> </svg>
      <Link href="mailto:{contact.email}">{contact.email}</Link>
    </div>
  {/if}
</div>


<style>
  p{
    font-size: 14px;
  }
  .mail{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .line{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .center{
    display: flex;
    align-items: center;
  }
</style>