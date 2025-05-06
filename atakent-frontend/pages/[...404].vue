<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="text-center max-w-md">
            <h1 class="text-9xl font-bold text-gray-900">404</h1>
            <div class="mt-4 mb-8">
                <div class="h-1 w-16 bg-primary mx-auto"></div>
            </div>
            <h2 class="text-3xl font-semibold text-gray-800 mb-4">Страница не найдена</h2>
            <p class="text-gray-600 mb-8">
                Извините, страница, которую вы ищете, не существует или была перемещена.
            </p>
            <button @click="handleError"
                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                <LucideHome />
                Вернуться на главную
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useError, clearError } from '#app'
    import { LucideHome } from '#components';

    const error = useError()

    function handleError() {
        clearError({ redirect: '/' })
    }
</script>

<style>
:root {
    --primary: #f43f5e;
    --primary-foreground: #ffffff;
}

.bg-primary {
    background-color: var(--primary);
}

.bg-primary\/90 {
    background-color: rgba(244, 63, 94, 0.9);
}

.text-primary {
    color: var(--primary);
}

.text-white {
    color: var(--primary-foreground);
}
</style>