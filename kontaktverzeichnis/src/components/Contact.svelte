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
          <Number telefonEintrag={eintrag} />
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
          <Number telefonEintrag={eintrag} />
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
      <svg xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" width="13" xmlns="http://www.w3.org/2000/svg" style="-webkit-print-color-adjust:exact" id="screenshot-d441c74e-78b6-80d7-8002-1040a7defb21" version="1.1" viewBox="1026 436.75 14 10.5" height="10.5"> <g id="shape-d441c74e-78b6-80d7-8002-1040a7defb21"> <g class="fills" id="fills-d441c74e-78b6-80d7-8002-1040a7defb21"> <path rx="0" ry="0" style="fill:#f4f4f4;fill-opacity:1" d="M1026.044,438.111C1026.225,437.315,1026.933,436.750,1027.750,436.750L1038.250,436.750C1039.067,436.750,1039.775,437.315,1039.956,438.111L1033.000,442.362L1026.044,438.111ZZM1026.000,439.110L1026.000,445.326L1031.078,442.213L1026.000,439.110ZZM1031.916,442.726L1026.167,446.250C1026.457,446.861,1027.073,447.251,1027.750,447.250L1038.250,447.250C1038.926,447.250,1039.542,446.860,1039.832,446.249L1034.083,442.725L1033.000,443.388L1031.916,442.726ZZM1034.922,442.214L1040.000,445.326L1040.000,439.110L1034.922,442.214ZZ"> </path> </g> </g> </svg>
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