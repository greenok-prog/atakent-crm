<template>
    <AdminChartBlock :label="label" :type="chartType" :data="statisticsData" :labels="statisticsLabels" />
</template>

<script lang="ts" setup>
    import type { VisitorStatisticsField } from '~/types/visitor';
    type ChartTypes = 'bar' | 'pie'
    const { data, chartType = 'bar' } = defineProps<{
        data: VisitorStatisticsField[],
        chartType?: ChartTypes,
        label: String
    }>()
    const statisticsData = computed<String[]>(() => {
        return data.map(el => el.count)
    })
    const statisticsLabels = computed<String[]>(() => {
        return data.map(el => el.name)
    })
</script>