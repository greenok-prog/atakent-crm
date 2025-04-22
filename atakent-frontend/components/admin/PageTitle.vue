<template>
    <h1 class="text-xl mb-3 font-medium">{{ title }}</h1>
</template>

<script lang="ts" setup>
const {title} = defineProps({
    title:String
})


</script>