<template>
    <div class="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
        @click="showDetails">
        <!-- Admin Menu -->
        <div v-if="isAdmin" class="absolute top-3 right-3 z-10 menu-container" @click.stop>
            <button @click="toggleMenu"
                class="w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
                <MoreHorizontalIcon class="h-5 w-5 text-white" />
            </button>
            <Transition enter="transition ease-out duration-100" enter-from="transform opacity-0 scale-95"
                enter-to="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                leave-from="transform opacity-100 scale-100" leave-to="transform opacity-0 scale-95">
                <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border">
                    <button v-if="!isEditing" @click="startEditing"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Редактировать
                    </button>
                    <button @click="confirmDelete"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                        <TrashIcon class="h-4 w-4 mr-2" />
                        Удалить
                    </button>
                </div>
            </Transition>
        </div>

        <!-- Date Badge -->
        <div
            class="absolute left-0 top-0 bg-blue-700 text-white rounded-br-2xl rounded-tl-xl py-2 px-3 flex items-center gap-2">
            <div class="text-center">
                <p class="text-xs font-medium capitalize">{{ exhibitionStartDate.month }}</p>
                <p class="text-2xl font-bold leading-none">{{ exhibitionStartDate.day }}</p>
            </div>
            <div class="text-white/50">|</div>
            <div class="text-center">
                <p class="text-xs font-medium capitalize">{{ exhibitionEndDate.month }}</p>
                <p class="text-xl font-bold leading-none">{{ exhibitionEndDate.day }}</p>
            </div>
        </div>

        <!-- Image -->
        <div class="relative h-48 overflow-hidden">
            <img :src="`${config.public.baseUrl}/${exhibition.image}`"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                :alt="exhibition.name" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                {{ exhibition.name }}
            </h3>

            <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-gray-600">
                    <CalendarIcon class="h-4 w-4" />
                    <span class="text-sm line-clamp-1">{{ exhibitionDateString }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                    <MapPinIcon class="h-4 w-4" />
                    <span class="text-sm line-clamp-1">{{ exhibition.location }}</span>
                </div>
            </div>

            <div class="mt-auto">
                <NuxtLink :to="`/visitor?exhibition=${exhibition.id}`" class="w-full" @click.stop>
                    <button
                        class="w-full bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <TicketIcon class="h-4 w-4" />
                        Получить билет
                    </button>
                </NuxtLink>
            </div>
        </div>

        <!-- Details Modal -->
        <ExhibitionDetailModal :is-open="isDetailsOpen" :exhibition="exhibition" @close="isDetailsOpen = false" />

        <!-- Edit Modal -->
        <Dialog v-if="isAdmin" v-model:visible="isEditing" modal :header="exhibition.name" :style="{ width: '30rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <AdminExhibitionForm @backHandler="isEditing = false" @formSubmitHandler="editExhibition"
                :initialExhibitionValues="exhibition" />
        </Dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
    import {
        MoreHorizontalIcon,
        PencilIcon,
        TrashIcon,
        CalendarIcon,
        MapPinIcon,
        TicketIcon
    } from 'lucide-vue-next'
    import { useExhibitionsStore } from '~/store/exhibitions.store'
    import type { Exhibition, ExhibitionCreate } from '~/types/exhibition'
    import ExhibitionDetailModal from './ExhibitionDetailModal.vue';


    const props = defineProps<{
        exhibition: Exhibition
        isAdmin?: boolean
    }>()

    const config = useRuntimeConfig()
    const isEditing = ref(false)
    const isMenuOpen = ref(false)
    const isDetailsOpen = ref(false)


    const { changeExhibition, removeExhibition } = useExhibitionsStore()

    const showDetails = () => {
        isDetailsOpen.value = true
    }

    const toggleMenu = (event: MouseEvent) => {
        event.stopPropagation()
        isMenuOpen.value = !isMenuOpen.value
    }

    const startEditing = () => {
        isEditing.value = true
        isMenuOpen.value = false
    }

    const editExhibition = async (formValues: ExhibitionCreate, exhibitionImage: any) => {
        const formData = new FormData()
        for (const [key, value] of Object.entries(formValues)) {
            formData.append(key, value)
        }
        if (exhibitionImage) {
            formData.append('image', exhibitionImage)
        }

        formData.append('website', 'fsdfsdfsdf')
        formData.append('organizer', String(formValues.organizer_id))

        const res = await changeExhibition(props.exhibition.id, formData)
        console.log(res.data.value);

        if (!res.error.value) {
            isEditing.value = false
        }
    }

    const confirmDelete = async () => {
        if (confirm('Вы уверены, что хотите удалить эту выставку?')) {
            await removeExhibition(props.exhibition.id)
        }
        isMenuOpen.value = false
    }

    const exhibitionDateString = computed(() => {
        const exhibitionStart = formatExhibitionDate(new Date(props.exhibition.dateStart))
        const exhibitionEnd = formatExhibitionDate(new Date(props.exhibition.dateEnd), false)
        return `${exhibitionStart} - ${exhibitionEnd}`
    })

    const exhibitionStartDate = computed(() => {
        return exhibitionDateMain(new Date(props.exhibition.dateStart))
    })

    const exhibitionEndDate = computed(() => {
        return exhibitionDateMain(new Date(props.exhibition.dateEnd))
    })

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (isMenuOpen.value && !target.closest('.menu-container')) {
            isMenuOpen.value = false
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
    })
</script>