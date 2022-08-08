<script>
    import AutoComplete from "./AutoComplete.svelte"

    let data = [
        {text:"hello"},
        {text:"hallow"},
        {text:"world"},
        {text:"foo"},
        {text:"bar"},
    ]

    let selected = {}
</script>

{JSON.stringify(selected)}
<AutoComplete data={data} bind:model={selected} />  
