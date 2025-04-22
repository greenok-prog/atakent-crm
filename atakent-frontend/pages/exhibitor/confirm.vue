<template>
    <div>
        Confirm email
    </div>
</template>

<script lang="ts" setup>
const route = useRoute()


const {data, error} = await useAPI(`/exhibitors/${route.query.token}/confirm`)
if(!error){
    await navigateTo('/exhibitor/panel')
}


</script>