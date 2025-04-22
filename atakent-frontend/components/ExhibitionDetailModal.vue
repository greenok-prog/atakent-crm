<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
            <!-- Backdrop -->
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            </TransitionChild>

            <!-- Modal -->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                            <!-- Image -->
                            <div class="relative h-64">
                                <img :src="`${config.public.baseUrl}/${exhibition.image}`"
                                    class="w-full h-full object-cover" :alt="exhibition.name" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div class="absolute bottom-0 left-0 p-6">
                                    <h2 class="text-2xl font-bold text-white mb-2">{{ exhibition.name }}</h2>
                                    <div class="flex items-center gap-4">
                                        <span class="inline-flex items-center gap-1 text-white/90">
                                            <CalendarIcon class="h-4 w-4" />
                                            {{ exhibitionDateString }}
                                        </span>
                                        <span class="inline-flex items-center gap-1 text-white/90">
                                            <MapPinIcon class="h-4 w-4" />
                                            {{ exhibition.location }}
                                        </span>
                                    </div>
                                </div>
                                <button @click="closeModal"
                                    class="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                                    <XIcon class="h-5 w-5 text-white" />
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="p-6">
                                <div class="grid md:grid-cols-4 gap-6">
                                    <!-- Main Info -->
                                    <div class="md:col-span-2 space-y-4">
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                                            <p class="text-gray-600">{{ exhibition.description }}</p>
                                        </div>

                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Организатор</h3>
                                            <div class="flex items-center gap-3">

                                                <div>
                                                    <p class="font-medium text-gray-900">{{ exhibition.organizer?.name
                                                    }}</p>
                                                    <p class="text-sm text-gray-500">email@email.com
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Side Info -->
                                    <div class="space-y-4 col-span-2">
                                        <div class="bg-gray-50 rounded-lg p-4">
                                            <h3 class="font-semibold text-gray-900 mb-3">Информация</h3>
                                            <div class="space-y-2">
                                                <div class="flex items-start gap-2">
                                                    <CalendarIcon class="h-5 w-5 text-blue-700 mt-0.5" />
                                                    <div>
                                                        <p class="font-medium">Даты проведения</p>
                                                        <p class="text-sm text-gray-600">{{ exhibitionDateString }}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-start gap-2">
                                                    <MapPinIcon class="h-5 w-5 text-blue-700 mt-0.5" />
                                                    <div>
                                                        <p class="font-medium">Место проведения</p>
                                                        <p class="text-sm text-gray-600">{{ exhibition.location }}</p>
                                                    </div>
                                                </div>
                                                <div class="flex items-start gap-2">
                                                    <GlobeIcon class="h-5 w-5 text-blue-700 mt-0.5" />
                                                    <div>
                                                        <p class="font-medium">Веб-сайт</p>
                                                        <a :href="exhibition.website" target="_blank"
                                                            class="text-sm text-blue-700 hover:underline">
                                                            {{ exhibition.website }}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <NuxtLink :to="`visitor?exhibition=${exhibition.id}`" class="w-full">
                                            <button
                                                class="w-full bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors">
                                                Получить билет
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
    } from '@headlessui/vue'
    import {
        XIcon,
        CalendarIcon,
        MapPinIcon,
        GlobeIcon,
    } from 'lucide-vue-next'
    import type { Exhibition } from '~/types/exhibition'

    const props = defineProps<{
        isOpen: boolean
        exhibition: Exhibition
    }>()

    const config = useRuntimeConfig()
    const emit = defineEmits(['close'])

    const closeModal = () => {
        emit('close')
    }

    const exhibitionDateString = computed(() => {
        const exhibitionStart = formatExhibitionDate(new Date(props.exhibition.dateStart))
        const exhibitionEnd = formatExhibitionDate(new Date(props.exhibition.dateEnd), false)
        return `${exhibitionStart} - ${exhibitionEnd}`
    })
</script>