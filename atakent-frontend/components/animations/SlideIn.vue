<template>
    <div ref="element" :class="['opacity-0 transition-all duration-1000', { 'opacity-100': isVisible }]">
        <slot></slot>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    const element = ref(null)
    const isVisible = ref(false)

    onMounted(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible.value = true
                    observer.unobserve(entry.target)
                }
            })
        }, {
            threshold: 0.1
        })

        if (element.value) {
            observer.observe(element.value)
        }
    })
</script>