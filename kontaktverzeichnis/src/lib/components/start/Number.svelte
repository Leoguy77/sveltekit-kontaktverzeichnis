<script lang="ts">
  import {Link} from "carbon-components-svelte";
  export let telefonEintrag: any
</script>

<div class="center">
  {#if telefonEintrag.typ === "Festnetz"}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" viewBox="0 0 22 21"><path fill="currentColor" d="M17.256 12.253c-.096-.667-.611-1.187-1.274-1.342c-2.577-.604-3.223-2.088-3.332-3.734C12.193 7.092 11.38 7 10 7s-2.193.092-2.65.177c-.109 1.646-.755 3.13-3.332 3.734c-.663.156-1.178.675-1.274 1.342l-.497 3.442C2.072 16.907 2.962 18 4.2 18h11.6c1.237 0 2.128-1.093 1.953-2.305l-.497-3.442zM10 15.492c-1.395 0-2.526-1.12-2.526-2.5s1.131-2.5 2.526-2.5s2.526 1.12 2.526 2.5s-1.132 2.5-2.526 2.5zM19.95 6c-.024-1.5-3.842-3.999-9.95-4C3.891 2.001.073 4.5.05 6s.021 3.452 2.535 3.127c2.941-.381 2.76-1.408 2.76-2.876C5.345 5.227 7.737 4.98 10 4.98s4.654.247 4.655 1.271c0 1.468-.181 2.495 2.76 2.876C19.928 9.452 19.973 7.5 19.95 6z"/></svg>
  {:else if telefonEintrag.typ === "Fax"}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" viewBox="0 0 22 22"><path fill="currentColor" d="M8 20V4h10v5h1q1.25 0 2.125.875T22 12v8H8Zm-3.5 1q1.05 0 1.775-.725T7 18.5v-8q0-1.05-.725-1.775T4.5 8q-1.05 0-1.775.725T2 10.5v8q0 1.05.725 1.775T4.5 21ZM10 9h6V6h-6v3Zm6 5q.425 0 .713-.288T17 13q0-.425-.288-.713T16 12q-.425 0-.713.288T15 13q0 .425.288.713T16 14Zm3 0q.425 0 .713-.288T20 13q0-.425-.288-.713T19 12q-.425 0-.713.288T18 13q0 .425.288.713T19 14Zm-3 3q.425 0 .713-.288T17 16q0-.425-.288-.713T16 15q-.425 0-.713.288T15 16q0 .425.288.713T16 17Zm3 0q.425 0 .713-.288T20 16q0-.425-.288-.713T19 15q-.425 0-.713.288T18 16q0 .425.288.713T19 17Zm-9 0h4v-5h-4v5Z"/></svg>
  {:else if telefonEintrag.typ === "Handy"}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" viewBox="0 0 24 24"><path fill="currentColor" d="M7 23q-.825 0-1.413-.588T5 21V3q0-.825.588-1.413T7 1h10q.825 0 1.413.588T19 3v18q0 .825-.588 1.413T17 23H7Zm5-2.5q.425 0 .713-.288T13 19.5q0-.425-.288-.713T12 18.5q-.425 0-.713.288T11 19.5q0 .425.288.713T12 20.5ZM7 16h10V6H7v10Z"/></svg>
  {:else if telefonEintrag.typ === "DECT"}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" viewBox="0 0 13 14"><path fill="currentColor" d="M10 2v-.5a.5.5 0 0 0-1 0V2H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM6 13H5v-1h1Zm0-2H5v-1h1Zm0-2H5V8h1Zm2 4H7v-1h1Zm0-2H7v-1h1Zm0-2H7V8h1Zm2 4H9v-1h1Zm0-2H9v-1h1Zm0-2H9V8h1Zm0-2.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5Z"/></svg>
  {/if}
  <div class="p">
    <Link href="tel:{telefonEintrag.nummer}">{telefonEintrag.nummer}</Link>
  </div>
  
</div>


<style>
.p{
  margin-left: 0.5rem;
}
.center{
  display: flex;
  align-items: center;
}
</style>