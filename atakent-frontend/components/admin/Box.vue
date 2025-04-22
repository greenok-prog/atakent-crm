<template>
    <div class="bg-white w-full bg-white shadow-md rounded p-4">
        <p v-if="title" class="text-gray-600 font-bold mb-2 pb-2 border-b">{{ title }}</p>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
    const { title } = defineProps<{
        title?: String
    }>()

</script>