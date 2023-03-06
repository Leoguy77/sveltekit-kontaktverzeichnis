<script lang="ts">
import {Tile} from "carbon-components-svelte"

export let popup: string
export let form: any

function closePopup(){
  popup=""
}
</script>

<section on:click|self={closePopup} on:keydown class="popup">
  <div class="field">
    <Tile light>
      <slot form={form}/>
    </Tile>
  </div>
</section>

<style>
.field{
  min-width: 70%;
}
.popup{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>