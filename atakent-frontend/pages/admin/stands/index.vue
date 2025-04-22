<template>
    <div>
        <h1>stands</h1>

        <DataTable :value="tableData" tableStyle="min-width: 50rem" v-model:selection="selectedProduct" dataKey="id"
            :globalFilterFields="['companyName']" scrollable scrollHeight="400px">

            <template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model.lazy="searchField" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="companyName" header="Название компании"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="exhibition" header="Выставка"></Column>
            <Column field="companyPhone" header="Номер телефона"></Column>


            <Column>
                <template #body="slotProps">
                    <div class="flex gap-2 items-center">
                        <NuxtLink :to="`/admin/stands/${slotProps.data.id}`"><Button icon="pi pi-pencil" /></NuxtLink>
                        <Button icon="pi pi-times" @click="removeItem(slotProps.data.id)" />
                    </div>
                </template>
            </Column>

        </DataTable>
    </div>

</template>

<script lang="ts" setup>
    import type { Exhibitor } from '~/types/exhibitor';


    definePageMeta({
        layout: 'admin-layout',
        middleware: 'auth',
    })
    const toast = useToast()
    const searchField = ref('')
    const { data, refresh } = await useAPI<Exhibitor[]>(`/exhibitors`, {

    })
    const removeItem = async (exhibitorId: number) => {
        const { error } = await useAPI(`/exhibitors/${exhibitorId}`, {
            method: 'DELETE'
        })
        if (!error.value) {
            refresh()
            toast.add({ detail: 'Запись удалена', severity: 'success', life: 3000, summary: 'Запись удалена' })
        } else {
            toast.add({ detail: 'Ошибка при удалении', severity: 'error', life: 3000, summary: 'Произошла ошибка' })
        }
    }
    const selectedProduct = ref();
    const tableData = computed(() => {
        if (data.value) {
            return data.value.map(company => {
                return {
                    ...company,
                    exhibition: company.exhibiton?.name ? company.exhibiton.name : ''

                }
            })
        }
    })

</script>