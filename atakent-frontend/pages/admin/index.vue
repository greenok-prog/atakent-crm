<template>
  <div>Админ панель</div>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'admin-layout',
    middleware: 'auth',
  })



</script>