<template>
    <a :href="`https://nile.tronscan.org/#/${route}/${link}/`" target="_blank">{{ getAddr(link) }}</a>
</template>

<script lang="ts">


    import { defineComponent } from "vue";

   

    export default defineComponent({
        props:{
            link: {required: true, type: String},
            route: {required: true, type: String},
        },
        setup() {

            const getAddr = (addr:string) => {
                if(addr.length == 0 || addr == undefined) return ''
                return `${addr[0]}${addr[1]}${addr[2]}...${addr[addr.length-3]}${addr[addr.length-2]}${addr[addr.length-1]}`
            }

            return {
                getAddr
            };
        },
    });

</script>