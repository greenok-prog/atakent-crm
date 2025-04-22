<template>
   {{ route.params.id }}
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin-layout'
})
const route = useRoute()

</script>