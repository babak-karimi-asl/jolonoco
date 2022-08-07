<script>
    import AutoComplete from "./AutoComplete.svelte"

    let data = [
        {text:"hello"},
        {text:"hallow"},
        {text:"world"},
        {text:"foo"},
        {text:"bar"},
    ]
</script>

<AutoComplete data={data} />
