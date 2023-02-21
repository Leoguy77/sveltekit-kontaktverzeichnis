<script lang="ts">
  export let labelText: string
  export let value: string
</script>

<div class="bx--form-item bx--text-input-wrapper ">
  <label for="ccs-0.tqtx1qil5aj" class="bx--label">{labelText}</label>
  <div class="bx--text-input__field-outer-wrapper">
    <div class="bx--text-input__field-wrapper">
      <div class="bx--text-input center">
        <div>{value}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .center {
    vertical-align: middle;
    display: flex;
    align-items: center;
    outline: none;
  }
  .center:active{
    outline: none;
  }
</style>
