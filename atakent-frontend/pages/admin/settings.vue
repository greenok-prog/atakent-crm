<template>
    <div class="min-h-screen ">
        <div class="container mx-auto px-4">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Настройки</h2>

            <!-- Организаторы выставок -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Организаторы выставок</h2>
                <div class="flex mb-4">
                    <BaseInput v-model="organizer" placeholder="Введите имя организатора" class="flex-grow mr-2" />
                    <Button @click="addOrganizer(organizer)" label="Добавить" icon="pi pi-plus" />
                </div>
                <DataTable :value="organizers" class="p-datatable-sm">
                    <Column field="name" header="Имя организатора"></Column>
                    <Column header="Действия" style="width: 100px">
                        <template #body="slotProps">

                            <Button icon="pi pi-pencil" class="p-button-text p-button-sm"
                                @click="editOrganizer(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                                @click="deleteOrganizer(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Источники информации -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Источники информации</h2>
                <div class="flex mb-4">
                    <BaseInput v-model="source" placeholder="Введите источник информации" class="flex-grow mr-2" />
                    <Button @click="addSourceHandler" label="Добавить" icon="pi pi-plus" />
                </div>
                <DataTable :value="sources" class="p-datatable-sm">
                    <Column field="name" header="Источник информации"></Column>
                    <Column header="Действия" style="width: 100px">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-text p-button-sm"
                                @click="editSource(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                                @click="removeSourceHandler(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Диалоговое окно для редактирования -->
        <Dialog v-model:visible="editDialogVisible" :header="editDialogHeader" :style="{ width: '50vw' }" :modal="true">
            <div class="flex flex-column gap-2">
                <label for="editName">Название</label>
                <BaseInput id="editName" v-model="edit" autofocus v-bind="editItemAttrs" />
            </div>
            <template #footer>
                <Button label="Отмена" icon="pi pi-times" @click="closeEditDialog" class="p-button-text" />
                <Button label="Сохранить" icon="pi pi-check" @click="saveEdit" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import Dialog from 'primevue/dialog';
    import { useSourcesStore } from '~/store/sources.store';
    import { useOrganizersStore } from '~/store/organizers.store';
    import type { Organizer } from '~/types/organizer';
    definePageMeta({
        layout: 'admin-layout'
    })
    const { defineField } = useForm()
    const [edit, editItemAttrs] = defineField('editItem')

    const { sources } = storeToRefs(useSourcesStore())
    const { organizers } = storeToRefs(useOrganizersStore())
    const { getSources, addSource, removeSource, changeSource } = useSourcesStore()
    const { getOrganizers, addOrganizer, removeOrganizer, changeOrganizer } = useOrganizersStore()

    const organizer = ref('')
    const source = ref('')

    const editType = ref<'organizer' | 'source'>('organizer');
    const editItem = ref<null | Organizer>(null)

    const editDialogHeader = computed(() => {
        return editType.value === 'organizer' ? 'Редактировать организатора' : 'Редактировать источник';
    });
    const addSourceHandler = async () => {
        await addSource(source.value)
    }
    const removeSourceHandler = async (id: number) => {
        await removeSource(id)
    }
    const deleteOrganizer = async (id: number) => {
        await removeOrganizer(id)
    }
    const saveEdit = async () => {
        if (editType.value === 'organizer' && editItem.value?.id) {
            await changeOrganizer(editItem.value?.id, edit.value)
        }
        if (editType.value === 'source' && editItem.value?.id) {
            await changeSource(editItem.value?.id, edit.value)
        }
        edit.value = ''
        closeEditDialog()
    }
    const editOrganizer = (organizer: Organizer) => {
        editType.value = 'organizer'
        edit.value = organizer.name
        editItem.value = organizer
        editDialogVisible.value = true

    }
    const editSource = (source: Organizer) => {
        editType.value = 'source'
        edit.value = source.name
        editItem.value = source
        editDialogVisible.value = true

    }

    const editDialogVisible = ref(false)

    const closeEditDialog = () => {
        editDialogVisible.value = false
    }

    await getOrganizers()
    await getSources()


</script>

<style scoped>
.p-datatable-sm .p-datatable-thead>tr>th,
.p-datatable-sm .p-datatable-tbody>tr>td {
    padding: 0.5rem;
}
</style>