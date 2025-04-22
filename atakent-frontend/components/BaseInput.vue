<template>
    <div class="   ">
        <label class="font-medium text-gray-700 text-sm block" v-if="label">{{ label }}</label>
        <InputText v-model="model" v-bind="$attrs"
            class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 block" />
        <small v-if="hasError" class="text-red-500">{{ errorMessage }}</small>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        label?: string,
        errorMessage?: string,

    }>()
    const model = defineModel()
    const hasError = computed(() => {
        if (props.errorMessage) {
            return props.errorMessage?.length > 0
        }
    })

</script>