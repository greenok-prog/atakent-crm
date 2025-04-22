<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto px-4 py-20">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-blue-900 mb-2">Календарь выставок</h1>
                <p class="text-gray-600">
                    Найдите интересующие вас выставки и мероприятия
                </p>
            </div>

            <!-- Filters and Search -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-8">
                <div class="grid md:grid-cols-3 gap-6 items-end">
                    <!-- Search -->
                    <BaseInput v-model="filters.search" placeholder="Поиск выставок..." label="Поиск" />


                    <!-- Date Filter -->
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Период</label>
                        <div class="flex items-center gap-2">
                            <div class="relative flex-1">
                                <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input v-model="filters.dateFrom" type="date"
                                    class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
                            </div>
                            <span class="text-gray-500">—</span>
                            <div class="relative flex-1">
                                <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input v-model="filters.dateTo" type="date"
                                    class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
                            </div>
                        </div>
                    </div>

                    <!-- Organizer Filter -->
                    <div>
                        <label class="text-sm font-medium text-gray-700 mb-1 block">Организатор</label>
                        <div class="relative">
                            <BuildingIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select v-model="filters.organizer"
                                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 appearance-none">
                                <option value="">Все организаторы</option>
                                <option v-for="organizer in organizers" :key="organizer.id" :value="organizer.id">
                                    {{ organizer.name }}
                                </option>
                            </select>
                            <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Additional Filters -->
                <div class="flex flex-wrap items-center justify-end mt-6 gap-4">
                    <!-- Category Filter -->
                    <!-- <div class="flex flex-wrap gap-2">
                        <button v-for="category in categories" :key="category.id" @click="toggleCategory(category.id)"
                            :class="[
                                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                filters.categories.includes(category.id)
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]">
                            {{ category.name }}
                        </button>
                    </div> -->

                    <!-- View Options -->
                    <div class="flex items-center gap-4">
                        <!-- Sort -->
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-700">Сортировка:</label>
                            <select v-model="filters.sort"
                                class="py-1.5 pl-3 pr-8 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900">
                                <option value="date-asc">По дате (ближайшие)</option>
                                <option value="date-desc">По дате (отдаленные)</option>
                                <option value="name-asc">По названию (А-Я)</option>
                                <option value="name-desc">По названию (Я-А)</option>
                            </select>
                        </div>

                        <!-- View Toggle -->
                        <div class="flex items-center border rounded-lg overflow-hidden">
                            <button @click="viewMode = 'grid'" :class="[
                                'p-2 transition-colors',
                                viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                <LayoutGridIcon class="h-5 w-5" />
                            </button>
                            <button @click="viewMode = 'list'" :class="[
                                'p-2 transition-colors',
                                viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                <ListIcon class="h-5 w-5" />
                            </button>
                            <button @click="viewMode = 'calendar'" :class="[
                                'p-2 transition-colors',
                                viewMode === 'calendar' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            ]">
                                <CalendarIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Stats -->
            <div class="flex items-center justify-between mb-6">
                <p class="text-gray-600">
                    Найдено <span class="font-semibold">{{ filteredExhibitions.length }}</span> выставок
                </p>
                <button v-if="hasActiveFilters" @click="resetFilters"
                    class="text-blue-900 hover:text-blue-700 text-sm flex items-center gap-1">
                    <XCircleIcon class="h-4 w-4" />
                    Сбросить фильтры
                </button>
            </div>

            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                <ExhibitionCard v-for="exhibition in filteredExhibitions" :key="exhibition.id"
                    :exhibition="exhibition" />
            </div>

            <!-- List View -->
            <div v-else-if="viewMode === 'list'" class="space-y-4">
                <div v-for="exhibition in filteredExhibitions" :key="exhibition.id"
                    class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    @click="showExhibitionDetails(exhibition)">
                    <div class="flex flex-col sm:flex-row">
                        <div class="relative sm:w-48 h-48 sm:h-auto">
                            <img :src="`${config.public.baseUrl}/${exhibition.image}`"
                                class="w-full h-full object-cover" :alt="exhibition.name" />
                            <div class="absolute top-0 left-0 bg-blue-700 text-white px-3 py-1 rounded-br-lg">
                                {{ formatDateShort(new Date(exhibition.dateStart)) }}
                            </div>
                        </div>
                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ exhibition.name }}</h3>
                            <div class="space-y-2 mb-4">
                                <div class="flex items-center gap-2 text-gray-600">
                                    <CalendarIcon class="h-4 w-4" />
                                    <span class="text-sm">
                                        {{ formatDateRange(new Date(exhibition.dateStart), new Date(exhibition.dateEnd))
                                        }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <MapPinIcon class="h-4 w-4" />
                                    <span class="text-sm">{{ exhibition.location }}</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-600">
                                    <BuildingIcon class="h-4 w-4" />
                                    <span class="text-sm">{{ exhibition.organizer?.name || 'Не указан' }}</span>
                                </div>
                            </div>
                            <div class="mt-auto flex justify-end">
                                <NuxtLink :to="`visitor?exhibition=${exhibition.id}`"
                                    class="text-blue-900 hover:text-blue-700 font-medium" @click.stop>
                                    Получить билет
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Calendar View -->
            <div v-else-if="viewMode === 'calendar'" class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-4 border-b bg-gray-50">
                    <div class="flex items-center justify-between">
                        <button @click="previousMonth" class="p-2 hover:bg-gray-200 rounded-full">
                            <ChevronLeftIcon class="h-5 w-5" />
                        </button>
                        <h2 class="text-lg font-semibold">{{ currentMonthName }} {{ currentYear }}</h2>
                        <button @click="nextMonth" class="p-2 hover:bg-gray-200 rounded-full">
                            <ChevronRightIcon class="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-7 text-center py-2 border-b bg-gray-50">
                    <div v-for="day in weekDays" :key="day" class="text-sm font-medium text-gray-700">
                        {{ day }}
                    </div>
                </div>
                <div class="grid grid-cols-7 auto-rows-fr">
                    <div v-for="(day, index) in calendarDays" :key="index" :class="[
                        'border-t border-l p-1 min-h-[100px]',
                        index % 7 === 6 ? 'border-r' : '',
                        index >= 35 ? 'border-b' : '',
                        day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                    ]">
                        <div class="flex justify-between items-start">
                            <span :class="[
                                'text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full',
                                day.isToday ? 'bg-blue-900 text-white' : ''
                            ]">
                                {{ day.date.getDate() }}
                            </span>
                            <span v-if="day.events.length"
                                class="text-xs bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded-full">
                                {{ day.events.length }}
                            </span>
                        </div>
                        <div class="mt-1 space-y-1">
                            <div v-for="event in day.events.slice(0, 2)" :key="event.id"
                                class="text-xs p-1 rounded bg-blue-50 text-blue-900 truncate cursor-pointer"
                                @click="showExhibitionDetails(event)">
                                {{ event.name }}
                            </div>
                            <div v-if="day.events.length > 2"
                                class="text-xs text-center text-blue-900 cursor-pointer hover:underline"
                                @click="showDayEvents(day.events)">
                                +{{ day.events.length - 2 }} ещё
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredExhibitions.length === 0" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <CalendarXIcon class="h-8 w-8 text-gray-400" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-1">Выставки не найдены</h3>
                <p class="text-gray-500 mb-4">
                    По вашему запросу не найдено ни одной выставки. Попробуйте изменить параметры поиска.
                </p>
                <button @click="resetFilters"
                    class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    Сбросить фильтры
                </button>
            </div>

            <!-- Day Events Modal -->
            <TransitionRoot appear :show="isDayEventsModalOpen" as="template">
                <Dialog as="div" @close="closeDayEventsModal" class="relative z-50">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
                        leave-to="opacity-0">
                        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4">
                            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                                <DialogPanel
                                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                    <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4">
                                        Выставки {{ selectedDayFormatted }}
                                    </DialogTitle>
                                    <div class="space-y-3">
                                        <div v-for="event in selectedDayEvents" :key="event.id"
                                            class="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                                            @click="showExhibitionDetails(event); closeDayEventsModal()">
                                            <h4 class="font-medium text-gray-900">{{ event.name }}</h4>
                                            <div class="flex items-center gap-2 text-gray-600 mt-1">
                                                <ClockIcon class="h-4 w-4" />
                                                <span class="text-sm">
                                                    {{ formatDateRange(new Date(event.dateStart), new
                                                        Date(event.dateEnd)) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-6 flex justify-end">
                                        <button @click="closeDayEventsModal"
                                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            Закрыть
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>


        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted } from 'vue'
    import {
        SearchIcon,
        CalendarIcon,
        BuildingIcon,
        ChevronDownIcon,
        LayoutGridIcon,
        ListIcon,
        MapPinIcon,
        XCircleIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        CalendarXIcon,
        ClockIcon
    } from 'lucide-vue-next'
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogTitle,
    } from '@headlessui/vue'
    import type { Exhibition } from '~/types/exhibition'
    import ExhibitionCard from '~/components/ExhibitionCard.vue'
    import { useExhibitionsStore } from '~/store/exhibitions.store'
    import { useOrganizersStore } from '~/store/organizers.store'

    const config = useRuntimeConfig()

    // View mode
    const viewMode = ref('grid') // 'grid', 'list', 'calendar'

    // Filters
    const filters = reactive({
        search: '',
        dateFrom: '',
        dateTo: '',
        organizer: '',
        categories: [] as number[],
        sort: 'date-asc'
    })

    // Calendar state
    const currentDate = ref(new Date())
    const isDayEventsModalOpen = ref(false)
    const selectedDayEvents = ref<Exhibition[]>([])
    const selectedDay = ref<Date | null>(null)

    // Exhibition details
    const isExhibitionModalOpen = ref(false)
    const selectedExhibition = ref<Exhibition | null>(null)

    // Mock data
    const { getExhibitions } = useExhibitionsStore()
    const { exhibitions } = storeToRefs(useExhibitionsStore())

    const { getOrganizers } = useOrganizersStore()
    const { organizers } = storeToRefs(useOrganizersStore())

    await getExhibitions()
    await getOrganizers()


    // Week days
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

    // Computed properties
    const hasActiveFilters = computed(() => {
        return filters.search !== '' ||
            filters.dateFrom !== '' ||
            filters.dateTo !== '' ||
            filters.organizer !== '' ||
            filters.categories.length > 0
    })

    const filteredExhibitions = computed(() => {
        let result = [...exhibitions.value]

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(exhibition =>
                exhibition.name.toLowerCase().includes(searchLower) ||
                exhibition.description.toLowerCase().includes(searchLower) ||
                exhibition.location.toLowerCase().includes(searchLower)
            )
        }

        // Date filter
        if (filters.dateFrom) {
            const dateFrom = new Date(filters.dateFrom)
            result = result.filter(exhibition => new Date(exhibition.dateEnd) >= dateFrom)
        }

        if (filters.dateTo) {
            const dateTo = new Date(filters.dateTo)
            result = result.filter(exhibition => new Date(exhibition.dateStart) <= dateTo)
        }

        // Organizer filter
        if (filters.organizer) {
            result = result.filter(exhibition => exhibition.organizer.id === parseInt(filters.organizer))


        }

        // Categories filter
        // if (filters.categories.length > 0) {
        //     result = result.filter(exhibition =>
        //         exhibition.categories.some(categoryId => filters.categories.includes(categoryId))
        //     )
        // }

        // Sorting
        switch (filters.sort) {
            case 'date-asc':
                result.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
                break
            case 'date-desc':
                result.sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())
                break
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name))
                break
        }

        return result
    })

    const currentMonthName = computed(() => {
        return currentDate.value.toLocaleString('ru', { month: 'long' })
    })

    const currentYear = computed(() => {
        return currentDate.value.getFullYear()
    })

    const calendarDays = computed(() => {
        const year = currentDate.value.getFullYear()
        const month = currentDate.value.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        // Get the day of the week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        let firstDayOfWeek = firstDay.getDay() - 1
        if (firstDayOfWeek < 0) firstDayOfWeek = 6 // Convert Sunday from 0 to 6

        const daysInMonth = lastDay.getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        const days = []

        // Previous month days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, daysInPrevMonth - i)
            days.push({
                date,
                isCurrentMonth: false,
                isToday: isSameDay(date, new Date()),
                events: getEventsForDay(date)
            })
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i)
            days.push({
                date,
                isCurrentMonth: true,
                isToday: isSameDay(date, new Date()),
                events: getEventsForDay(date)
            })
        }

        // Next month days
        const remainingDays = 42 - days.length // 6 rows * 7 days = 42
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i)
            days.push({
                date,
                isCurrentMonth: false,
                isToday: isSameDay(date, new Date()),
                events: getEventsForDay(date)
            })
        }

        return days
    })

    const selectedDayFormatted = computed(() => {
        if (!selectedDay.value) return ''
        return formatDate(selectedDay.value)
    })

    // Methods
    function toggleCategory(categoryId: number) {
        const index = filters.categories.indexOf(categoryId)
        if (index === -1) {
            filters.categories.push(categoryId)
        } else {
            filters.categories.splice(index, 1)
        }
    }

    function resetFilters() {
        filters.search = ''
        filters.dateFrom = ''
        filters.dateTo = ''
        filters.organizer = ''
        filters.categories = []
        filters.sort = 'date-asc'
    }

    function previousMonth() {
        currentDate.value = new Date(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth() - 1,
            1
        )
    }

    function nextMonth() {
        currentDate.value = new Date(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth() + 1,
            1
        )
    }

    function isSameDay(date1: Date, date2: Date) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
    }

    function getEventsForDay(date: Date) {
        return exhibitions.value.filter(exhibition => {
            const startDate = new Date(exhibition.dateStart)
            const endDate = new Date(exhibition.dateEnd)
            return date >= startDate && date <= endDate
        })
    }

    function formatDate(date: Date) {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    function formatDateShort(date: Date) {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }

    function formatDateRange(startDate: Date, endDate: Date) {
        const start = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
        const end = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
        return `${start} - ${end}`
    }

    function showDayEvents(events: Exhibition[]) {
        selectedDayEvents.value = events
        selectedDay.value = events[0] ? new Date(events[0].dateStart) : new Date()
        isDayEventsModalOpen.value = true
    }

    function closeDayEventsModal() {
        isDayEventsModalOpen.value = false
    }

    function showExhibitionDetails(exhibition: Exhibition) {
        selectedExhibition.value = exhibition
        isExhibitionModalOpen.value = true
    }

    // Fetch data
    onMounted(async () => {
        // Here you would typically fetch exhibitions data from your API
        // For example:
        // const { data } = await useFetch('/api/exhibitions')
        // exhibitions.value = data.value
    })
</script>

<style scoped>
/* Add any additional styles here */
</style>