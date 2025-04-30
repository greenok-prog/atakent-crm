<template>
    <div class="p-4 mt-4">
        <h1 class="text-2xl font-bold mb-6">Редактор шаблона билета</h1>

        <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Название шаблона</label>
            <input v-model="templateName" type="text" class="w-full p-2 border rounded"
                placeholder="Введите название шаблона" />
        </div>

        <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Выберите изображение билета</label>
            <input type="file" accept="image/*" @change="onImageUpload"
                class="block w-full text-sm border border-gray-300 rounded cursor-pointer" />
        </div>

        <div v-if="backgroundImage" class="mb-6">
            <h2 class="text-lg font-medium mb-2">Предпросмотр и позиционирование QR-кода</h2>
            <p class="text-sm text-gray-600 mb-4">Перетащите и измените размер области для QR-кода</p>

            <div ref="templateContainer" class="relative border mt-4 bg-white overflow-hidden"
                :style="{ width: templateWidth + 'px', height: templateHeight + 'px' }">
                <img :src="backgroundImage" class="absolute top-0 left-0 w-full h-full object-contain"
                    alt="Background" />

                <Vue3DraggableResizable v-model:x="qrPosition.x" v-model:y="qrPosition.y" v-model:w="qrPosition.width"
                    v-model:h="qrPosition.height" :parent="true" :draggable="true" :resizable="true"
                    @drag-end="updatePercentages" @resize-end="updatePercentages"
                    class="border-2 border-dashed border-blue-500">
                    <div class="w-full h-full flex items-center justify-center bg-black bg-opacity-10">
                        <div class="text-xs text-center">
                            Область для QR-кода
                        </div>
                    </div>
                </Vue3DraggableResizable>
            </div>

            <div class="mt-4 p-4 bg-gray-100 rounded">
                <h3 class="font-medium mb-2">Позиция QR-кода:</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm">X: {{ Math.round(qrPosition.x) }}px ({{
                            Math.round(qrPercentages.xPercent) }}%)</label>
                        <input v-model.number="qrPosition.x" type="range" min="0" :max="templateWidth" class="w-full"
                            @input="updatePercentages" />
                    </div>
                    <div>
                        <label class="block text-sm">Y: {{ Math.round(qrPosition.y) }}px ({{
                            Math.round(qrPercentages.yPercent) }}%)</label>
                        <input v-model.number="qrPosition.y" type="range" min="0" :max="templateHeight" class="w-full"
                            @input="updatePercentages" />
                    </div>
                    <div>
                        <label class="block text-sm">Ширина: {{ Math.round(qrPosition.width) }}px ({{
                            Math.round(qrPercentages.wPercent) }}%)</label>
                        <input v-model.number="qrPosition.width" type="range" min="50" :max="templateWidth"
                            class="w-full" @input="updatePercentages" />
                    </div>
                    <div>
                        <label class="block text-sm">Высота: {{ Math.round(qrPosition.height) }}px ({{
                            Math.round(qrPercentages.hPercent) }}%)</label>
                        <input v-model.number="qrPosition.height" type="range" min="50" :max="templateHeight"
                            class="w-full" @input="updatePercentages" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex gap-4 mt-6">
            <button @click="save"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                :disabled="!backgroundImage || !templateName">
                Сохранить шаблон
            </button>

            <button @click="reset" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Сбросить
            </button>
        </div>

        <div v-if="savedTemplates.length > 0" class="mt-8">
            <h2 class="text-xl font-bold mb-4">Сохраненные шаблоны</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(template, index) in savedTemplates" :key="index" class="border rounded overflow-hidden">
                    <div class="relative h-40 bg-gray-100">
                        <img :src="`${config.public.baseUrl}/${template.imageUrl}`" class="w-full h-full object-contain"
                            alt="Template" />
                        <div class="absolute border-2 border-dashed border-blue-500" :style="{
                            left: `${template.qrPercentages.xPercent}%`,
                            top: `${template.qrPercentages.yPercent}%`,
                            width: `${template.qrPercentages.wPercent}%`,
                            height: `${template.qrPercentages.hPercent}%`
                        }"></div>
                    </div>
                    <div class="p-3">
                        <h3 class="font-medium">{{ template.name }}</h3>
                        <div class="flex justify-between mt-2">
                            <button @click="selectTemplate(template)"
                                class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Выбрать
                            </button>
                            <button @click="deleteTemplate(index)"
                                class="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useToast } from 'primevue/usetoast'
    definePageMeta({
        layout: 'admin-layout'
    })
    const config = useRuntimeConfig()

    const toast = useToast()
    const backgroundImage = ref(null)
    const templateContainer = ref(null)
    const templateWidth = ref(794)  // Стандартная ширина A4 в пикселях
    const templateHeight = ref(1123) // Стандартная высота A4 в пикселях
    const qrPosition = ref({ x: 100, y: 100, width: 150, height: 150 })
    const qrPercentages = ref({ xPercent: 0, yPercent: 0, wPercent: 0, hPercent: 0 })
    const selectedFile = ref(null)
    const templateName = ref('')
    const savedTemplates = ref([])
    const selectedTemplateId = ref(null)

    // Загрузка сохраненных шаблонов при монтировании компонента
    onMounted(async () => {
        await loadTemplates()
    })

    const loadTemplates = async () => {
        try {
            const { data } = await useAPI('/tickets', {
                method: 'GET'
            })

            if (data.value) {
                savedTemplates.value = data.value.map(template => ({
                    ...template,
                    qrPercentages: {
                        xPercent: template.xPercent || (template.x / templateWidth.value * 100),
                        yPercent: template.yPercent || (template.y / templateHeight.value * 100),
                        wPercent: template.wPercent || (template.w / templateWidth.value * 100),
                        hPercent: template.hPercent || (template.h / templateHeight.value * 100)
                    }
                }))
            }
        } catch (error) {
            console.error('Ошибка при загрузке шаблонов:', error)
            toast.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось загрузить шаблоны билетов',
                life: 3000
            })
        }
    }

    function onImageUpload(e) {
        const file = e.target.files[0]

        if (file) {
            selectedFile.value = file
            const reader = new FileReader()
            reader.onload = (event) => {
                backgroundImage.value = event.target.result

                // Загружаем изображение, чтобы получить его реальные размеры
                const img = new Image()
                img.onload = () => {
                    // Устанавливаем размеры контейнера в соответствии с пропорциями изображения
                    // Сохраняем максимальную ширину 794px (A4)
                    if (img.width > 794) {
                        const ratio = img.height / img.width
                        templateWidth.value = 794
                        templateHeight.value = Math.round(794 * ratio)
                    } else {
                        templateWidth.value = img.width
                        templateHeight.value = img.height
                    }

                    // Обновляем процентные значения
                    updatePercentages()
                }
                img.src = event.target.result
            }
            reader.readAsDataURL(file)
        }
    }

    function updatePercentages() {
        // Вычисляем проценты на основе пикселей
        qrPercentages.value = {
            xPercent: (qrPosition.value.x / templateWidth.value) * 100,
            yPercent: (qrPosition.value.y / templateHeight.value) * 100,
            wPercent: (qrPosition.value.width / templateWidth.value) * 100,
            hPercent: (qrPosition.value.height / templateHeight.value) * 100
        }
    }

    const save = async () => {
        if (!backgroundImage.value || !templateName.value) {
            toast.add({
                severity: 'warn',
                summary: 'Внимание',
                detail: 'Необходимо выбрать изображение и указать название шаблона',
                life: 3000
            })
            return
        }

        try {
            const formData = new FormData()
            formData.append('name', templateName.value)
            formData.append('image', selectedFile.value)

            // Отправляем как пиксели, так и проценты
            formData.append('x', qrPosition.value.x)
            formData.append('y', qrPosition.value.y)
            formData.append('width', qrPosition.value.width)
            formData.append('height', qrPosition.value.height)

            // Добавляем процентные значения
            formData.append('xPercent', qrPercentages.value.xPercent)
            formData.append('yPercent', qrPercentages.value.yPercent)
            formData.append('wPercent', qrPercentages.value.wPercent)
            formData.append('hPercent', qrPercentages.value.hPercent)

            if (selectedTemplateId.value) {
                formData.append('id', selectedTemplateId.value)
            }

            const { data } = await useAPI('/tickets', {
                body: formData,
                method: 'POST'
            })

            if (data.value) {
                // Добавляем процентные значения к полученным данным
                const templateWithPercentages = {
                    ...data.value,
                    qrPercentages: {
                        xPercent: data.value.xPercent || (data.value.x / templateWidth.value * 100),
                        yPercent: data.value.yPercent || (data.value.y / templateHeight.value * 100),
                        wPercent: data.value.wPercent || (data.value.w / templateWidth.value * 100),
                        hPercent: data.value.hPercent || (data.value.h / templateHeight.value * 100)
                    }
                }

                // Обновляем список шаблонов
                if (selectedTemplateId.value) {
                    const index = savedTemplates.value.findIndex(t => t.id === selectedTemplateId.value)
                    if (index !== -1) {
                        savedTemplates.value[index] = templateWithPercentages
                    }
                } else {
                    savedTemplates.value.push(templateWithPercentages)
                }

                toast.add({
                    severity: 'success',
                    summary: 'Успешно',
                    detail: 'Шаблон билета сохранен',
                    life: 3000
                })

                reset()
            }
        } catch (error) {
            console.error('Ошибка при сохранении шаблона:', error)
            toast.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось сохранить шаблон билета',
                life: 3000
            })
        }
    }

    const selectTemplate = (template) => {
        templateName.value = template.name
        backgroundImage.value = template.imageUrl
        selectedTemplateId.value = template.id

        // Если есть процентные значения, используем их для вычисления пикселей
        if (template.qrPercentages) {
            qrPosition.value = {
                x: (template.qrPercentages.xPercent * templateWidth.value) / 100,
                y: (template.qrPercentages.yPercent * templateHeight.value) / 100,
                width: (template.qrPercentages.wPercent * templateWidth.value) / 100,
                height: (template.qrPercentages.hPercent * templateHeight.value) / 100
            }
            qrPercentages.value = template.qrPercentages
        } else {
            // Иначе используем абсолютные значения
            qrPosition.value = {
                x: template.x,
                y: template.y,
                width: template.w,
                height: template.h
            }
            updatePercentages()
        }

        // Загружаем изображение для получения его размеров
        const img = new Image()
        img.onload = () => {
            if (img.width > 794) {
                const ratio = img.height / img.width
                templateWidth.value = 794
                templateHeight.value = Math.round(794 * ratio)
            } else {
                templateWidth.value = img.width
                templateHeight.value = img.height
            }

            // Обновляем позицию QR-кода на основе процентов
            qrPosition.value = {
                x: (qrPercentages.value.xPercent * templateWidth.value) / 100,
                y: (qrPercentages.value.yPercent * templateHeight.value) / 100,
                width: (qrPercentages.value.wPercent * templateWidth.value) / 100,
                height: (qrPercentages.value.hPercent * templateHeight.value) / 100
            }
        }
        img.src = template.imageUrl
    }

    const deleteTemplate = async (index) => {
        try {
            const templateId = savedTemplates.value[index].id

            const { data } = await useAPI(`/tickets/${templateId}`, {
                method: 'DELETE'
            })

            if (data.value && data.value.success) {
                savedTemplates.value.splice(index, 1)

                toast.add({
                    severity: 'success',
                    summary: 'Успешно',
                    detail: 'Шаблон билета удален',
                    life: 3000
                })
            }
        } catch (error) {
            console.error('Ошибка при удалении шаблона:', error)
            toast.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось удалить шаблон билета',
                life: 3000
            })
        }
    }

    const reset = () => {
        backgroundImage.value = null
        qrPosition.value = { x: 100, y: 100, width: 150, height: 150 }
        qrPercentages.value = { xPercent: 0, yPercent: 0, wPercent: 0, hPercent: 0 }
        selectedFile.value = null
        templateName.value = ''
        selectedTemplateId.value = null
        templateWidth.value = 794
        templateHeight.value = 1123
    }
</script>