<script>
    import fuzzysort from "fuzzysort";
    import { onMount } from "svelte";
    // import AutoCss from './lib/AutoCss.svelte'

    let commandInputRef;
    let commandInput = "";
    let highlight = { text: "", index: -1 };
    let commands = [
        {
            id: 1,
            text: "create a circle and name it #new_name",
            handler({ document }, { new_name }) {
                let div = document.createElement("DIV");
                document.body.append(div);
                div.outerHTML = `<div id="${new_name}" style="width:32px; height:32px; border-radius:50%; border:1px solid grey;"></div>`;
            },
        },
        {
            id: 2,
            text: "create a button and name it #new_name with caption #caption",
            handler({ document }, { new_name,caption }) {
                let div = document.createElement("BUTTON");
                document.body.append(div);
                div.outerHTML = `<button id="${new_name}" >${caption}</button>`;
            },
        },
        {
            id: 4,
            text: "create an image and name it #new_name with src #url ",
            handler({ document }, { new_name,url }) {
                let img = document.createElement("IMG");
                img.id = new_name
                img.src = url
                document.body.append(img)
            },
        },
        {
            id: 5,
            text: "put #child inside of #parent",
            handler({ document }, { child,parent }) {
                try{
                    document.getElementById(parent).append(document.getElementById(child))
                }catch(e){
                    console.log('e',e)
                }             
            },
        },

        ...['width','height','border','border-radius','background-color','color',
         'display','align-items','justify-content',
        ].map(property=>({
            id:'id-style-'+property,
            text:`set ${property} of #name to #value`,
            handler({ document }, { name,value }) {
                try{
                    document.getElementById(name).style[property]=value
                }catch(e){
                    console.log('e',e)
                }
            },
        }))

    ];

    let getVariableListener = (e)=>{}
    let getVarCommand = null
    let getVarInput = ''
    let getVarInputRef;
    function getVariable(name){
        getVarCommand = 'Please enter '+name+':'
        getVarInput = ''
        setTimeout(()=>{
            if(getVarInputRef)  getVarInputRef.focus()
        },200)
        return new Promise((resolve,reject)=>{
            getVariableListener = e => {
                if(e.key==='Enter') {
                    getVarCommand=null
                    resolve(getVarInput)
                }
                if(e.key==='Escape') {
                    getVarCommand=null
                    reject('cancelled')
                }
            }
        })
    }

    async function runCommand(cmd) {
        let text = cmd.text || " ";
        let wordsRegex = /[a-zA-Z_\-0-9#]+/gm;
        const isVar = (str) => str?.[0] === "#";
        const varName = (str) => str?.slice(1) || "unknown";

        let args = text.match(wordsRegex).filter(isVar).map(varName)

        let inputs = {}
        for(let a of args){
            try{
               inputs[a] = await getVariable(a)
            }
            catch(e){
                setTimeout(()=>{
                    if (commandInputRef) commandInputRef.focus();
                },200)
               return 
            }
        }

        if (typeof cmd.handler === "function") cmd.handler({ document }, inputs);

        
        setTimeout(()=>{
            commandInput = ''
            if (commandInputRef) commandInputRef.focus();
        },200)
    }

    let results = [];

    $: command =
        highlight.index < 0
            ? {
                  text: "unknown",
                  handler() {
                      console.log("unknown command");
                  },
              }
            : results[highlight.index].object;

    function onKeyDown(event, cmd) {

        results = fuzzysort.go(cmd, commands, { key: "text" });

        results = results.map((r) => ({
            html: fuzzysort.highlight(fuzzysort.single(cmd, r.target), '<strong style="color:red;">', "</strong>"),
            text: r.target,
            object: r.obj,
        }));

        if (results.length <= 0) highlight.index = -1;

        if (results.length > 0 && highlight.index < 0) highlight.index = 0;

        if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            // event.preventDefault();
            const dir = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
            highlight.index += dir;
            if (highlight.index < 0) highlight.index = 0;
            if (highlight.index > results.length - 1) highlight.index = results.length - 1;
        }

        if (event.key === "Enter") runCommand(command);
    }

    onMount(() => {
        if (commandInputRef) commandInputRef.focus();
    });
</script>

<!-- <AutoCss/> -->


<div class="command-section">
    {#if highlight.index >= 0}
        <div>{results[highlight.index].text}</div>
    {:else}
        <div>type a command...</div>
    {/if}
    <input 
        bind:this={commandInputRef} 
        class="command-input" type="text" 
        bind:value={commandInput} 
        on:keyup={(e) => onKeyDown(e, commandInput)} 
    />

    <div>
        {#each results as result, i}
            <div style={`background-color:${i == highlight.index ? "#ffd8e5" : "white"};`}>{@html result.html}</div>
        {/each}
    </div>
</div>

{#if getVarCommand}
<div class="get-var">
<div>{getVarCommand}</div>
<input bind:this={getVarInputRef} type="text" bind:value={getVarInput} on:keydown={getVariableListener}>
</div>
{/if}

<style>
    .command-input {
        border: none;
        background-color: #ececec;
        padding: 4px 8px;
        font-size: 1.2rem;
        width: 90%;
        margin: 0;
    }
    .command-section {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 300px;
        width: 300px;
        border: 1px solid grey;
        padding: 6px;
    }

    .get-var{
        position: fixed;
        padding:18px;
        top:50%;
        left:50%;
        border: 1px solid grey;
        background-color: bisque;

    }
</style>
