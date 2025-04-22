<template>
    <div class="card flex justify-center ">
        <Chart :type="type" :data="chartData" :options="chartOptions" class="w-full" />
    </div>
</template>

<script setup lang="ts">
    import Chart from 'primevue/chart';

    const chartData = ref();
    const chartOptions = ref();
    const { label, labels, data, type } = defineProps<{
        label: String,
        labels: String[],
        data: String[],
        type: String
    }>()

    const setChartData = () => {
        return {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: chartHoverColors,
                    hoverBackgroundColor: chartHoverColors
                }
            ]
        };
    };

    const setChartOptions = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = 'black';

        return {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    };
    onMounted(() => {
        chartData.value = setChartData();
        chartOptions.value = setChartOptions();
    });

</script>
