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
                            class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                            <!-- Success Icon -->
                            <div
                                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                                <CheckIcon class="h-8 w-8 text-green-600" />
                            </div>

                            <!-- Header -->
                            <DialogTitle as="h3" class="text-2xl font-bold text-center text-gray-900 mb-4">
                                Регистрация успешно завершена!
                            </DialogTitle>

                            <!-- Content -->
                            <div class="mt-4">
                                <div class="text-center mb-6">
                                    <p class="text-gray-600">
                                        Ваш электронный билет готов. Пожалуйста, сохраните QR-код для входа на выставку.
                                    </p>
                                </div>

                                <!-- Registration Details -->
                                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div class="text-gray-600">Мероприятие:</div>
                                        <div class="font-medium text-gray-900">{{ registration.exhibition.name }}</div>

                                        <div class="text-gray-600">Дата:</div>
                                        <div class="font-medium text-gray-900">{{ registration.date }}</div>

                                        <div class="text-gray-600">Посетитель:</div>
                                        <div class="font-medium text-gray-900">{{ registration.name }}</div>

                                        <div class="text-gray-600">ID билета:</div>
                                        <div class="font-medium text-gray-900">{{ registration.id }}</div>
                                    </div>
                                </div>

                                <!-- QR Code -->
                                <div class="flex flex-col items-center mb-6">
                                    <div class="bg-white p-4 rounded-lg shadow-md mb-4">

                                        <ServerImage :src="registration.qrValue" alt="QR код билета"
                                            class="w-48 h-48 object-contain" />
                                    </div>
                                    <button @click="downloadQR"
                                        class="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors">
                                        <DownloadIcon class="h-5 w-5 mr-2" />
                                        <span>Скачать QR-код</span>
                                    </button>
                                </div>

                                <!-- Additional Info -->
                                <div class="bg-blue-50 rounded-lg p-4 mb-6">
                                    <div class="flex">
                                        <InfoIcon class="h-5 w-5 text-blue-900 mr-3 flex-shrink-0 mt-0.5" />
                                        <div class="text-sm text-blue-900">
                                            <p class="font-medium mb-1">Важная информация:</p>
                                            <ul class="list-disc list-inside space-y-1 text-blue-800">
                                                <li>Билет также отправлен на ваш email</li>
                                                <li>Для входа на выставку предъявите QR-код на экране телефона или в
                                                    распечатанном виде</li>
                                                <li>При себе необходимо иметь документ, удостоверяющий личность</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <button @click="shareTicket"
                                        class="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-lg border border-blue-900 text-blue-900 hover:bg-blue-50 transition-colors">
                                        <ShareIcon class="h-5 w-5 mr-2" />
                                        Поделиться
                                    </button>
                                    <button @click="closeModal"
                                        class="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                                        Готово
                                    </button>
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
        DialogTitle,
    } from '@headlessui/vue'
    import {
        CheckIcon,
        DownloadIcon,
        InfoIcon,
        ShareIcon,
    } from 'lucide-vue-next'
    import type { Visitor } from '~/types/visitor';

    const { registration, isOpen } = defineProps<{
        isOpen: Boolean,
        registration: Visitor
    }>()

    const emit = defineEmits(['close'])

    const closeModal = () => {
        emit('close')
    }
    const config = useRuntimeConfig()
    const downloadQR = async () => {
        try {
            const response = await fetch(`${config.public.baseUrl}/visitors/${registration.id}/ticket/pdf`, {

                headers: {
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке файла');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                const text = await response.text();
                console.error('Ожидался PDF, но пришло:', text);
                return;
            }

            // Получаем PDF как blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${registration.name}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка при скачивании PDF:', error);
        }
    }

    const shareTicket = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Билет на выставку',
                    text: `Билет на выставку "${registration.exhibition.name}"`,
                    url: registration.qrValue
                })
            } catch (error) {
                console.error('Error sharing:', error)
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            alert('Функция поделиться не поддерживается вашим браузером')
        }
    }
</script>