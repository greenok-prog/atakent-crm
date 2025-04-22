<template>
  <div>
    <NuxtLayout />
  </div>
  <BaseLoader v-if="loading" />
</template>
<script lang="ts" setup>
  const nuxtApp = useNuxtApp();
  const loading = ref(false);
  nuxtApp.hook("page:start", () => {
    loading.value = true;
  });
  nuxtApp.hook("page:finish", () => {
    loading.value = false;
  });
</script>
<style lang="scss">
@import "@/assets/scss/main.scss";


.head {
  color: var(--primary);
}
</style>