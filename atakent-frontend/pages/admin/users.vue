<template>
  <div class="min-h-screen ">
    <div class="container mx-auto px-4">
      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- График по выбранным выставкам -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-4">Статистика по выставкам</h3>
          <Chart type="pie" :data="exhibitionChartData" :options="chartOptions" class="h-64" />
        </div>


        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-4">Статистика по источникам информации</h3>
          <Chart type="bar" :data="sourceChartData" :options="chartOptions" class="h-64" />
        </div>
      </div>


      <!-- Filters and Stats -->

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4  bg-white rounded-lg shadow-md p-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-sm text-gray-600">Всего посетителей</div>
          <div class="text-2xl font-bold text-blue-900">{{ totalVisitors }}</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-sm text-gray-600">Частные лица</div>
          <div class="text-2xl font-bold text-green-700">
            {{ visitors?.individualCount }}
          </div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-sm text-gray-600">Юр. лица</div>
          <div class="text-2xl font-bold text-purple-700">
            {{ visitors?.companyCount }}
          </div>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4">
          <div class="text-sm text-gray-600">QR отсканирован</div>
          <div class="text-2xl font-bold text-yellow-700">
            {{ visitors?.qrStats }}
          </div>
        </div>
      </div>
      <Accordion value="0" class="bg-white mt-4 mb-6">
        <AccordionPanel value="0">
          <AccordionHeader>Фильтры</AccordionHeader>
          <AccordionContent>
            <div class="bg-white">
              <div class="grid md:grid-cols-4 gap-4 mb-6">
                <!-- Exhibition Filter -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Фильтр по выставке
                  </label>
                  <Select v-model="filters.exhibition" :options="exhibitions" optionLabel="name" optionValue="id"
                    showClear
                    class="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
                </div>


                <!-- Source Filter -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Фильтр по дате
                  </label>
                  <DatePicker selectionMode="range" :manualInput="false" v-model="filters.dates"
                    class="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 outline-none">
                  </DatePicker>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Фильтр по источнику
                  </label>
                  <Select v-model="filters.source" :options="sources" optionLabel="name" optionValue="name"
                    class="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900">

                  </Select>
                </div>


                <!-- Type Filter -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Тип посетителя
                  </label>
                  <Select v-model="filters.type"
                    class="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900">
                    <option value="">Все типы</option>
                    <option value="individual">Частное лицо</option>
                    <option value="company">Юридическое лицо</option>
                  </Select>
                </div>
              </div>


              <div class="py-2 flex justify-end">
                <Button @click="downloadExcel">Экспорт</Button>
              </div>

            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>



      <!-- Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden p-8">
        <div class="overflow-x-auto">
          <DataTable :value="visitors?.visitors" :paginator="true" :rows="rowsPerPage"
            :totalRecords="visitors?.visitors.length" :rowsPerPageOptions="[5, 10, 20, 50]" v-model:first="first"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            responsiveLayout="scroll" :lazy="true" @page="onPage" class="p-datatable-sm">
            <Column field="name" header="Имя"></Column>
            <Column header="Контакты">
              <template #body="slotProps">
                <div class="text-sm text-gray-900">{{ slotProps.data.email }}</div>
                <div class="text-sm text-gray-500">{{ slotProps.data.phone }}</div>
              </template>
            </Column>
            <Column field="exhibition.name" header="Выставка"></Column>
            <Column field="exhibitor" header="Тип">
              <template #body="slotProps">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  slotProps.data.executor === 'individual'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                ]">
                  {{ slotProps.data.executor === 'individual' ? 'Частное лицо' : 'Юр. лицо' }}
                </span>
              </template>
            </Column>
            <Column field="fair" header="Источник"></Column>
            <Column field="qrStatus" header="Статус QR">
              <template #body="slotProps">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  slotProps.data.qr
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ slotProps.data.qr ? 'Отсканирован' : 'Не отсканирован' }}
                </span>
              </template>
            </Column>
            <Column header="Действия">
              <template #body="slotProps">
                <button @click="viewDetails(slotProps.data)" class="text-blue-600 hover:text-blue-900 mr-3">
                  Просмотр
                </button>
                <button class="text-red-600 hover:text-red-900">
                  Удалить
                </button>
              </template>
            </Column>
          </DataTable>
        </div>
        <!-- Empty State -->
        <div v-if="visitors?.visitors.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-6xl text-gray-400"></i>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Нет данных</h3>
          <p class="mt-1 text-sm text-gray-500">
            По выбранным фильтрам ничего не найдено
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Chart from 'primevue/chart';
  import { useVisitorsStore } from '~/store/visitors.store';
  import { useSourcesStore } from '~/store/sources.store';
  import { useExhibitionsStore } from '~/store/exhibitions.store';

  definePageMeta({
    layout: 'admin-layout'
  })

  interface Visitor {
    id: number;
    name: string;
    phone: string;
    email: string;
    exhibition: string;
    source: string;
    type: 'individual' | 'company';
    qrStatus: boolean;
  }
  const config = useRuntimeConfig()
  const { getVisitors } = useVisitorsStore()
  const { visitors } = storeToRefs(useVisitorsStore())
  const filters = ref({
    exhibition: '',
    source: '',
    type: '',
    dates: null,
  });
  const downloadExcel = async () => {
    try {
      // Сбор query строк
      const params = new URLSearchParams(queries.value as Record<string, string>);
      const url = `${config.public.baseUrl}/visitors/export?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Ошибка при скачивании файла');

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'visitors.xlsx';
      link.click();
      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error('Ошибка при экспорте:', err);
    }
  };
  const first = ref(0);
  const rowsPerPage = ref(10);
  const exhibitionChartCounts = computed(() => {
    return visitors.value?.exhibitionStatistics.map(el => el.count)
  })
  const exhibitionChartLabels = computed(() => {
    return visitors.value?.exhibitionStatistics.map(el => el.name)
  })

  const sourcesChartCounts = computed(() => {
    return visitors.value?.exhibitionStatistics.map(el => el.count)
  })
  const sourcesChartLabels = computed(() => {
    return visitors.value?.exhibitionStatistics.map(el => el.name)
  })

  const { getSources } = useSourcesStore()
  const { sources } = storeToRefs(useSourcesStore())

  const { getExhibitions } = useExhibitionsStore()
  const { exhibitions } = storeToRefs(useExhibitionsStore())
  await getExhibitions()
  await getSources()




  const exhibitionChartData = computed(() => {
    return {
      labels: exhibitionChartLabels.value,
      datasets: [{
        data: exhibitionChartCounts.value,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  });

  const sourceChartData = computed(() => {

    return {
      labels: sourcesChartLabels.value,
      datasets: [{
        label: 'Количество посетителей',
        data: sourcesChartCounts.value,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  });
  const queries = computed(() => {
    interface QueryType {
      exhibition?: string,
      fair?: string,
      registrationDateStart?: string,
      registrationDateEnd?: string
    }
    const queryObject: QueryType = {}
    if (filters.value.exhibition) {
      queryObject['exhibition'] = filters.value.exhibition
    }
    if (filters.value.source) {
      queryObject['fair'] = filters.value.source
    }
    if (filters.value.dates && filters.value.dates.length === 2) {
      const [start, end] = filters.value.dates;

      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1); // 👈 вот это важно

      queryObject['registrationDateStart'] = startDate.toISOString();
      queryObject['registrationDateEnd'] = endDate.toISOString();
    }

    // if (dates.value && dates.value[1] && dates.value[0]) {
    //   const firstDate = new Date(dates.value[0])
    //   const lastDate = new Date(dates.value[1])
    //   lastDate.setDate(lastDate.getDate() + 1)

    //   queryObject['registrationDateStart'] = firstDate.toISOString()
    //   queryObject['registrationDateEnd'] = lastDate.toISOString()
    // }
    return queryObject
  })

  const fetchData = async () => {
    await getVisitors(queries.value)


  }

  watch(queries, fetchData, { immediate: true })

  function onPage(event: any) {
    first.value = event.first;
    rowsPerPage.value = event.rows;
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };


  const totalVisitors = computed(() => visitors.value?.visitors.length);

  function viewDetails(visitor: Visitor) {
    // Implement view details functionality
    console.log('View details for visitor:', visitor);
  }


</script>

<style scoped>
.p-datatable-sm .p-datatable-thead>tr>th,
.p-datatable-sm .p-datatable-tbody>tr>td {
  padding: 0.5rem;
}

.p-datepicker-input,
.p-inputtext {
  border: none !important;
}
</style>
