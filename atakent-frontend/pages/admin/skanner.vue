<template>
    <div class="min-h-screen bg-gray-50 py-6">
        <div class="container mx-auto px-4">
            <h1 class="text-2xl font-bold text-blue-900 mb-6">QR-сканер посетителей</h1>

            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <!-- Область сканирования -->
                <div class="flex flex-col items-center mb-6">
                    <div ref="scannerContainer"
                        class="w-full max-w-md h-80 bg-gray-100 rounded-lg overflow-hidden relative mb-4">
                        <div v-if="!isScanning" class="absolute inset-0 flex items-center justify-center">
                            <Button @click="startScanner" icon="pi pi-camera" label="Начать сканирование"
                                class="p-button-lg" />
                        </div>
                        <video v-show="isScanning" ref="videoElement" class="w-full h-full object-cover"></video>
                        <div v-if="isScanning"
                            class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <!-- Улучшенная область сканирования с анимацией -->
                            <div class="w-3/4 h-3/4 border-2 border-blue-500 relative">
                                <!-- Угловые маркеры -->
                                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500">
                                </div>
                                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500">
                                </div>

                                <!-- Сканирующая линия -->

                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <Button v-if="isScanning" @click="stopScanner" icon="pi pi-times" label="Остановить"
                            class="p-button-danger" />
                        <Button v-if="!isScanning && hasCamera" @click="startScanner" icon="pi pi-refresh"
                            label="Возобновить" />
                    </div>
                </div>

                <!-- Результат сканирования -->
                <div v-if="scanResult" class=" rounded-lg  mb-6">
                    <div v-if="scanResult.loading" class="flex justify-center p-6">
                        <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                    </div>

                    <div v-else-if="scanResult.error" class="bg-red-50 text-red-700 p-4 rounded-lg">
                        <h3 class="font-bold mb-2">Ошибка</h3>
                        <p>{{ scanResult.error }}</p>
                    </div>

                    <div v-else class="space-y-4">
                        <div :class="[
                            'p-4 rounded-lg',
                            scanResult.scanned ? 'bg-yellow-50' : 'bg-green-50'
                        ]">
                            <h3 class="font-bold text-lg mb-2">
                                {{ scanResult.scanned ? 'QR-код уже отсканирован' : 'QR-код действителен' }}
                            </h3>
                            <p v-if="scanResult.scanned" class="text-yellow-700">
                                QR-код добавлен в базу.
                            </p>
                            <p v-else class="text-green-700">
                                QR-код действителен и готов к использованию.
                            </p>
                        </div>

                        <div v-if="scanResult.visitor" class="bg-white border rounded-lg p-4">
                            <h3 class="font-bold mb-2">Информация о посетителе</h3>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="text-gray-600">Имя:</div>
                                <div>{{ scanResult.visitor.name }}</div>

                                <div class="text-gray-600">Email:</div>
                                <div>{{ scanResult.visitor.email }}</div>

                                <div class="text-gray-600">Телефон:</div>
                                <div>{{ scanResult.visitor.phone }}</div>

                                <div class="text-gray-600">Выставка:</div>
                                <div>{{ scanResult.visitor.exhibition?.name }}</div>

                                <div class="text-gray-600">Дата регистрации:</div>
                                <div>{{ new Date(scanResult.visitor.date).toLocaleString() }}</div>
                            </div>
                        </div>

                        <Button v-if="!scanResult.scanned" @click="markAsScanned" icon="pi pi-check"
                            label="Отметить посещение" class="p-button-success w-full" />
                    </div>
                </div>

                <!-- История сканирований -->
                <div v-if="scanHistory.length > 0">
                    <h3 class="font-bold text-lg mb-2">История сканирований</h3>
                    <ul class="space-y-2">
                        <li v-for="(item, index) in scanHistory" :key="index"
                            class="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                                <div class="font-medium">{{ item.visitor?.name || 'Неизвестный посетитель' }}</div>
                                <div class="text-sm text-gray-600">{{ new Date(item.timestamp).toLocaleTimeString() }}
                                </div>
                            </div>
                            <div :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                item.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            ]">
                                {{ item.success ? 'Успешно' : 'Ошибка' }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <Toast />
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from "vue"
    import { useToast } from "primevue/usetoast"
    import { useRoute, useRouter } from "vue-router"
    import Button from "primevue/button"
    import Toast from "primevue/toast"
    import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library"
    import QRCode from "qrcode"
    definePageMeta({
        layout: 'empty'
    })
    // Типы данных
    interface Visitor {
        id: number
        name: string
        email: string
        phone: string
        date: string
        exhibition?: {
            id: number
            name: string
        }
        qr: boolean
    }

    interface ScanResult {
        loading: boolean
        error?: string
        token?: string
        visitor?: Visitor
        valid?: boolean
        scanned?: boolean
    }

    interface ScanHistoryItem {
        timestamp: number
        visitor?: Visitor
        success: boolean
        message: string
    }

    // Состояние
    const toast = useToast()
    const route = useRoute()
    const router = useRouter()
    const videoElement = ref<HTMLVideoElement | null>(null)
    const scannerContainer = ref<HTMLDivElement | null>(null)
    const mobileQrContainer = ref<HTMLDivElement | null>(null)
    const isScanning = ref(false)
    const hasCamera = ref(false)
    const scanResult = ref<ScanResult | null>(null)
    const scanHistory = ref<ScanHistoryItem[]>([])
    const currentToken = ref<string | null>(null)
    const debugInfo = ref<string | null>(null)
    const mobileUrl = ref("")

    // QR-сканер
    let codeReader: BrowserMultiFormatReader | null = null

    // Инициализация сканера
    onMounted(() => {
        // Генерируем URL для мобильного устройства
        generateMobileUrl()

        // Проверяем, есть ли токен в URL
        if (route.query.uuid) {
            verifyVisitor(route.query.uuid as string)
        }

        // Инициализируем сканер
        initScanner()
    })

    onUnmounted(() => {
        stopScanner()
    })

    function generateMobileUrl() {
        // Получаем текущий URL и удаляем все параметры
        const url = new URL(window.location.href)
        url.search = "" // Удаляем все параметры запроса
        mobileUrl.value = url.toString()

        // Генерируем QR-код для мобильного URL
        onMounted(() => {
            if (mobileQrContainer.value) {
                QRCode.toCanvas(
                    mobileQrContainer.value,
                    mobileUrl.value,
                    {
                        width: 256,
                        margin: 1,
                        color: {
                            dark: "#000000",
                            light: "#ffffff",
                        },
                    },
                    (error) => {
                        if (error) console.error("Ошибка генерации QR-кода:", error)
                    },
                )
            }
        })
    }

    async function initScanner() {
        try {
            // Проверяем доступность камеры
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter((device) => device.kind === "videoinput")
            hasCamera.value = videoDevices.length > 0

            if (!hasCamera.value) {
                toast.add({
                    severity: "warn",
                    summary: "Внимание",
                    detail: "Камера не найдена. Используйте мобильное устройство.",
                    life: 5000,
                })
                return
            }

            // Настраиваем сканер с улучшенными параметрами
            const hints = new Map()
            hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE])
            hints.set(DecodeHintType.TRY_HARDER, true)
            hints.set(DecodeHintType.CHARACTER_SET, "UTF-8")

            codeReader = new BrowserMultiFormatReader(hints)
        } catch (error) {
            console.error("Ошибка инициализации сканера:", error)
            toast.add({ severity: "error", summary: "Ошибка", detail: "Не удалось инициализировать сканер", life: 3000 })
        }
    }

    function checkCameraAgain() {
        hasCamera.value = false // Сбрасываем состояние
        initScanner() // Проверяем камеру снова
    }

    async function startScanner() {
        if (!codeReader || !videoElement.value || !hasCamera.value) return

        try {
            isScanning.value = true
            scanResult.value = null
            debugInfo.value = null

            // Запускаем сканирование с улучшенными настройками
            await codeReader.decodeFromVideoDevice(
                null, // Используем камеру по умолчанию
                videoElement.value,
                (result, error) => {
                    if (result) {
                        const qrData = result.getText()
                        handleScanResult(qrData)
                    }
                },
            )
        } catch (error) {
            console.error("Ошибка запуска сканера:", error)
            isScanning.value = false
            toast.add({ severity: "error", summary: "Ошибка", detail: "Не удалось запустить сканер", life: 3000 })
        }
    }

    function stopScanner() {
        if (codeReader) {
            codeReader.reset()
            isScanning.value = false
        }
    }

    async function handleScanResult(qrData: string) {
        // Останавливаем сканер после успешного сканирования
        stopScanner()

        try {
            // Извлекаем UUID из URL
            let uuid = null

            debugInfo.value = `Обработка QR-кода: ${qrData}`

            // Проверяем, является ли данные URL-адресом
            if (qrData.includes("?uuid=")) {
                // Формат: http://domain/path?uuid=XXXX
                const uuidMatch = qrData.match(/[?&]uuid=([^&]+)/)
                if (uuidMatch && uuidMatch[1]) {
                    uuid = uuidMatch[1]
                    debugInfo.value += `\nНайден UUID: ${uuid}`
                }
            } else if (qrData.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                // Формат: просто UUID
                uuid = qrData
                debugInfo.value += `\nQR содержит только UUID: ${uuid}`
            }

            if (!uuid) {
                throw new Error("QR-код не содержит UUID")
            }

            // Проверяем UUID
            await verifyVisitor(uuid)
        } catch (error) {

            scanResult.value = {
                loading: false,
                error: "Недействительный QR-код. Пожалуйста, попробуйте еще раз.",
            }

            scanHistory.value.unshift({
                timestamp: Date.now(),
                success: false,
                message: "Недействительный QR-код",
            })

            toast.add({ severity: "error", summary: "Ошибка", detail: "Недействительный QR-код", life: 3000 })
        }
    }

    async function verifyVisitor(uuid: string) {
        scanResult.value = { loading: true }
        currentToken.value = uuid

        try {
            const { data, error } = await useAPI("/visitors/verify-uuid", {
                params: { uuid },
            })

            if (error.value || !data.value) {
                throw new Error(error.value?.message || "Ошибка проверки")
            }

            scanResult.value = {
                loading: false,
                token: uuid,
                visitor: data.value.visitor,
                valid: data.value.valid,
                scanned: data.value.scanned,
            }

            scanHistory.value.unshift({
                timestamp: Date.now(),
                visitor: data.value.visitor,
                success: true,
                message: data.value.scanned ? "Уже отсканирован" : "QR-код действителен",
            })

            toast.add({
                severity: data.value.scanned ? "warn" : "success",
                summary: data.value.scanned ? "Предупреждение" : "Успешно",
                detail: data.value.scanned
                    ? "QR-код уже был отсканирован"
                    : "QR-код действителен",
                life: 2500,
            })

            // ⏱ Автоматический перезапуск через 3 секунды
            setTimeout(() => {
                startScanner()
            }, 3000)

        } catch (error) {
            scanResult.value = {
                loading: false,
                error: "Недействительный или ошибочный QR-код",
            }

            scanHistory.value.unshift({
                timestamp: Date.now(),
                success: false,
                message: "Ошибка при проверке",
            })

            toast.add({
                severity: "error",
                summary: "Ошибка",
                detail: "Не удалось проверить QR-код",
                life: 3000,
            })

            setTimeout(() => {
                startScanner()
            }, 3000)
        }
    }

    async function markAsScanned() {
        if (!currentToken.value || !scanResult.value || scanResult.value.scanned) return

        scanResult.value.loading = true

        try {
            const { data, error } = await useAPI("/visitors/scan-uuid", {
                method: "POST",
                body: { uuid: currentToken.value },
            })

            if (error.value) {
                throw new Error(error.value.message || "Не удалось отметить посещение")
            }

            if (!data.value) {
                throw new Error("Не удалось отметить посещение")
            }

            scanResult.value = {
                loading: false,
                token: currentToken.value,
                visitor: data.value.visitor,
                valid: true,
                scanned: true,
            }

            scanHistory.value.unshift({
                timestamp: Date.now(),
                visitor: data.value.visitor,
                success: data.value.success,
                message: data.value.message,
            })

            toast.add({
                severity: "success",
                summary: "Успех",
                detail: "Посещение успешно отмечено",
                life: 3000,
            })
        } catch (error) {
            console.error("Ошибка отметки посещения:", error)
            scanResult.value.loading = false

            toast.add({
                severity: "error",
                summary: "Ошибка",
                detail: "Не удалось отметить посещение",
                life: 3000,
            })
        }
    }

</script>

<style scoped>
.scan-line {
    animation: scan 2s linear infinite;
}

@keyframes scan {
    0% {
        top: 0;
    }

    50% {
        top: calc(100% - 4px);
    }

    100% {
        top: 0;
    }
}
</style>