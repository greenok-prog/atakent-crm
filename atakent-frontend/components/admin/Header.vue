<template>
    <header class="pt-4 flex items-end justify-between">
        <h1 class="text-3xl font-bold">Title</h1>
        <Button @click="logout" label="Выйти" severity="secondary" />
    </header>
</template>

<script lang="ts" setup>
    import { useUserStore } from '~/store/user.store';

    const { logout } = useUserStore()

</script>