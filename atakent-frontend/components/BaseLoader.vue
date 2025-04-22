<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white">
            <div class="relative">
                <!-- Основной спиннер -->
                <div class="flex flex-col items-center">
                    <!-- Анимированные круги -->
                    <div class="relative w-24 h-24">
                        <div
                            class="absolute inset-0 rounded-full border-4 border-t-blue-900 border-r-blue-700 border-b-blue-500 border-l-blue-300 animate-spin">
                        </div>
                        <div
                            class="absolute inset-2 rounded-full border-4 border-t-blue-700 border-r-blue-500 border-b-blue-300 border-l-blue-100 animate-spin-reverse">
                        </div>
                        <div
                            class="absolute inset-4 rounded-full border-4 border-t-blue-500 border-r-blue-300 border-b-blue-100 border-l-white animate-spin">
                        </div>

                        <!-- Центральный логотип или иконка -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-8 h-8 bg-blue-900 rounded-lg animate-pulse">
                                <LucideBuilding2 class="w-full h-full p-1.5 text-white" />
                            </div>
                        </div>
                    </div>

                    <!-- Текст загрузки -->
                    <div class="mt-4 text-center">
                        <p class="text-blue-900 font-medium">Загрузка</p>
                        <div class="flex items-center justify-center gap-1 mt-1">
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-900 animate-bounce"
                                style="animation-delay: 0s"></div>
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-700 animate-bounce"
                                style="animation-delay: 0.2s"></div>
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
                                style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>

                <!-- Фоновые декоративные элементы -->
                <div class="absolute -inset-8 -z-10">
                    <div class="absolute top-0 left-0 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-pulse">
                    </div>
                    <div class="absolute bottom-0 right-0 w-16 h-16 bg-blue-300/30 rounded-full blur-xl animate-pulse"
                        style="animation-delay: 0.5s"></div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { LucideBuilding2 } from '#components'
</script>

<style scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes spin-reverse {
    from {
        transform: rotate(360deg);
    }

    to {
        transform: rotate(0deg);
    }
}

.animate-spin {
    animation: spin 3s linear infinite;
}

.animate-spin-reverse {
    animation: spin-reverse 2s linear infinite;
}

/* Плавное появление/исчезновение лоадера */
.fixed {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Дополнительные анимации для точек */
.animate-bounce {
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}
</style>