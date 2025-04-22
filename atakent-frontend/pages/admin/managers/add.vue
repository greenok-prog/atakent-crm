<template>
    <form @submit="addHandler" class="w-96 flex flex-col gap-4">
        <BaseInput v-model="name" placeholder="Имя" />
        <BaseInput v-model="email" placeholder="Email" type="email" />
        <BaseInput v-model="password" placeholder="Пароль" type="password" />
        <Listbox v-model="roles" :options="dropDownOptions" optionLabel="name" optionValue="key" multiple />
        <Button label="Добавить" type="submit" />
    </form>
</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'admin-layout',
        // middleware: ['auth', 'admin']
    })
    const { defineField, values, handleSubmit } = useForm({
        initialValues: {
            roles: false,
            email: '',
            name: '',
            password: ''
        }
    })

    const [name] = defineField('name')
    const [email] = defineField('email')
    const [password] = defineField('password')
    const [roles] = defineField('roles')
    const dropDownOptions = [
        { name: 'Админ', key: 'ADMIN' },
        { name: 'Менеджер', key: 'MANAGER' },
        { name: 'Ассистент', key: 'ASSISTANT' },
    ]
    const addHandler = handleSubmit(async () => {

        const { data } = await useAPI('/auth/register', {
            method: 'POST',
            body: {
                ...values,

            }
        })
    })
</script>