<template>
    <div class="bg-transparent">
        <NuxtLink to="/admin/managers/add">
            <Button label="Добавить менеджера" />
        </NuxtLink>
        <DataTable :value="data" class="bg-transparent" scrollable>
            <Column style="min-width: 300px" field="name" header="Имя"></Column>
            <Column style="min-width: 300px" field="email" header="Email"></Column>
            <Column style="min-width: 300px" field="roles" header="Роли"></Column>

            <Column style="min-width: 300px">
                <template #body="slotProps">
                    <div class="flex gap-2 items-center justify-end">
                        <NuxtLink :to="`/admin/managers`"><Button icon="pi pi-pencil" /></NuxtLink>
                        <Button @click="removeManager(slotProps.data.id)" icon="pi pi-times" />

                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'admin-layout',
        middleware: ['auth', 'admin']
    })

    const { data } = await useAPI('/users')
    const removeManager = async (id: number) => {
        const { data, error, refresh } = await useAPI(`/users/${id}`, {
            method: 'DELETE'
        })
        if (!error.value) {
            refresh()
        }


    }

</script>