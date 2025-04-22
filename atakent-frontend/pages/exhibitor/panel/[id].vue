<template>
    <div>{{ data }}</div>
</template>


<script lang="ts" setup>
const route = useRoute()
const {data} = await useAPI(`/exhibitors/${route.params.id}`)

</script>