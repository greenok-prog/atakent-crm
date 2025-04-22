<template>
    <span>{{ displayValue }}</span>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    const props = defineProps({
        endValue: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            default: 2000
        }
    })

    const displayValue = ref(0)

    onMounted(() => {
        const start = 0
        const end = props.endValue
        const steps = 60
        const stepDuration = props.duration / steps
        let current = start
        const increment = (end - start) / steps

        const timer = setInterval(() => {
            current += increment
            if (current >= end) {
                current = end
                clearInterval(timer)
            }
            displayValue.value = Math.round(current)
        }, stepDuration)
    })
</script>