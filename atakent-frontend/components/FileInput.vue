<template>
    <div>
        <input ref="fileInput" class="inputfile" type="file" accept="image/*" name="file" v-bind="$attrs"
            @change="(event) => emit('onChangeFile', event)">
        <label @click="clickHandler" ref="fileLabel" for="file"> <Button :label="buttonLabel" icon="pi pi-upload"
                class="min-w-52" /></label>
        <span v-if="error">{{ error }}</span>

        <!-- <div v-if="!error && file" class="ml-2 text-md font-bold mt-1">{{ file.name }}</div> -->
        <div v-if="file" class="mt-4">
            <img :src="url" alt="" class="w-full max-w-32 object-contain">
        </div>
        <div v-else-if="preloadServer" class="mt-2">
            <img :src="`${config.public.baseUrl}/${preloadServer}`" class="w-full max-w-32 object-contain" alt="">
        </div>
    </div>
</template>

<script lang="ts" setup>
    const emit = defineEmits(['onChangeFile'])
    const config = useRuntimeConfig()
    const props = defineProps<{
        file?: File,
        error?: string,
        label?: string,
        preloadServer?: string
    }>()
    const url = computed(() => {
        if (props.file) {
            return URL.createObjectURL(props.file)
        }
    })
    const getImageName = (path: string) => {
        const arr = path.split("\\")
        return arr[arr.length - 1]
    }
    const buttonLabel = computed(() => {
        if (props.file) {
            return props.file.name
        } else if (props.preloadServer) {
            return getImageName(props.preloadServer)
        } else if (props.label) {
            return props.label
        } else {
            return 'Загрузить'
        }
    })
    const fileInput = ref<HTMLInputElement | null>(null)
    const fileLabel = ref<HTMLLabelElement | null>(null)
    const clickHandler = () => {
        fileInput.value?.click()
    }
</script>

<style scoped>
.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.inputfile+label {
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: black;
    display: inline-block;
}

.inputfile:focus+label,
.inputfile+label:hover {
    background-color: red;
}
</style>