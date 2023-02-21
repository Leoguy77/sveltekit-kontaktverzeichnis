<script lang="ts">
  export let contact: any

  let telefonEintraege:any = []
  for (let eintrag of contact.telefonEintraege) {
    if (telefonEintraege[eintrag.standort]){
      telefonEintraege[eintrag.standort].push({nummer: eintrag.nummer, typ: eintrag.eintragTyp})
    } else {
      telefonEintraege[eintrag.standort] = [{nummer: eintrag.nummer, typ: eintrag.eintragTyp}]
    }
  }

  // console.log(telefonEintraege)
</script>



<style>
  .center{
    display: flex;
    align-items: center;
  }
</style>