<template>
    <button v-if="!loading" class="btn btn-success btn-sm pt-0 pb-1" @click="event">{{ label }}</button>
    <div v-else class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue";
    import TronApi from '../api/tron-api'

    export default defineComponent({
        props:{
            label: {required: true, type: String},
            uri: {required: true, type: String},
            body: {required: false, type: Object, default: {}}
        },
        setup(props, {emit}) {

            let loading = ref(false)

            

            const event = async () => {
                loading.value = true
                const result = await TronApi.query(props.uri, props.body)
                loading.value = false
                emit('event', {...result, ...props.body})
            }

           
            
            return {
                loading,
                event
            };
        },
    });

</script>