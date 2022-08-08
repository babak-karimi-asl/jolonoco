<script>

    let search = "";
    export let data = [];
    export let model = null
    let open = false
    let highlight = 0;
    import { matchFuzzy,clamp } from "./utils.js";

    $: Data = search ? data.filter((d) => matchFuzzy(d.text, search)) : data;

    function onkeydown(event) {
        highlight += event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        highlight = clamp(0, Data.length - 1, highlight);
        if(Data.length>0 && event.key==="Enter"){
            model = Data[highlight]
            onBlur()
        }
        if(event.key!=="Enter" && event.key!=="Tab") open=true
    }

    $: if(Data) {
        highlight = clamp(0, Data.length - 1, highlight);
    }

    $: placeholder = search ? null : open?'جستجو...': model?.text?'':'لطفا انتخاب کنید'

    function onFocus(){
        search = ''
        open = true
    }
    function onBlur(){
        search = model?.text || 'لطفا انتخاب کنید'
        open = false
    }
</script>


<input type="text" 
        bind:value={search} 
        on:keydown={onkeydown} 
        placeholder={placeholder} 
        on:focus={onFocus}
        on:blur={onBlur}        
        />
{#if open}
{#each Data as d,i}
    <div class={i==highlight?'highlight':''} >{d.text}</div>
{/each}
{/if}

<style>
.highlight{
    color:red;
    background-color:blue;
    padding:0 4px;
}

</style>