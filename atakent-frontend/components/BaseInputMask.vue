<template>
    <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700" v-if="label">{{ label }}</label>
        <InputMask :mask="'+7 (999) 999 99 99'" v-bind="$attrs" v-model="model"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
        <small v-show="errorMessage" class="text-red-500">{{ errorMessage }}</small>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        errorMessage?: string,
        label?: string


    }>()
    const model = defineModel()

</script>

<style scoped>
input {
    @apply w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900
}
</style>
