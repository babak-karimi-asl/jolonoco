<script>

    let search = "";
    export let data = [];
    let highlight = 0;
    import { matchFuzzy,clamp } from "./utils.js";

    $: Data = search ? data.filter((d) => matchFuzzy(d.text, search)) : data;

    function onkeydown(event) {
        highlight += event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    }

    $: if(Data) {
        highlight = clamp(0, Data.length - 1, highlight);
    }
</script>


<input type="text" bind:value={search} on:keydown={onkeydown} />
{#each Data as d,i}
    <div>{i===highlight?'>':''} {d.text}</div>
{/each}
