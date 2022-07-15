<script>
import { onMount } from "svelte";




onMount(()=>{

    let app = document.getElementById('app')

    let elems = Array.from(app.querySelectorAll('*'))
                .filter(e=>e.getAttribute('style'))
                .map(e=>({
                        styleText:e.getAttribute('style'),
                        style:e.style,
                        element:e,
                    })
                )

    console.log('elems',elems)


})



</script>

