const MAIN_CHART_COLORS = ['99, 102, 241', '252, 186, 3', '112, 7, 133']

export const chartColors:String[] = MAIN_CHART_COLORS.map(color => {
    return `rgba(${color}, 0.8)`
})
export const chartHoverColors = MAIN_CHART_COLORS.map(color => {
    return `rgb(${color})`
})
    