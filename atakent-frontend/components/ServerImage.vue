<template>
    <NuxtImg v-bind="$attrs" :src="config.public.baseUrl + src"/>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const props = defineProps<{
    src:string
}>()

</script>