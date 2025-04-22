<template>

    <div :class="[
        'bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col justify-between',
        sidebarExpanded ? 'w-64' : 'w-16'
    ]">
        <div>
            <div class="p-4">
                <button @click="toggleSidebar" class="text-white focus:outline-none">
                    <i :class="['pi', sidebarExpanded ? 'pi-angle-left' : 'pi-angle-right']"></i>
                </button>
            </div>
            <nav class="mt-5">
                <ul>
                    <li v-for="item in menuItems" :key="item.to" class="mb-2">
                        <NuxtLink :to="item.to" class="flex items-center px-4 py-2 hover:bg-gray-700"
                            :title="item.label">
                            <component class="mr-2" :is="item.icon" />
                            <span v-if="sidebarExpanded">{{ item.label }}</span>

                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
        <NuxtLink @click="logout" class="flex items-center gap-3 p-4" to="/admin/login">
            <LucideLogOut /><span>Выход</span>
        </NuxtLink>
    </div>
</template>
<script lang="ts" setup>
    import { IconsHome, LucideBolt, LucideCalendar, LucideHome, LucideUser, LucideUserPlus } from '#components'
    import { useUserStore } from '~/store/user.store'

    const sidebarExpanded = ref(true)
    const route = useRoute()
    const { logout } = useUserStore()
    const { user } = storeToRefs(useUserStore())



    const menuItems = [
        {
            label: 'Дашборд',
            icon: LucideHome,
            to: '/admin',
            access: 'MANAGER'
        },
        {
            label: 'Выставки',
            icon: LucideCalendar,
            to: '/admin/exhibitions',
            access: 'MANAGER'
        },
        {
            label: 'Посетители',
            icon: LucideUser,
            to: '/admin/users',
            access: 'MANAGER'
        },
        {
            label: 'Настройки информации',
            icon: LucideBolt,
            to: '/admin/settings',
            access: 'ADMIN'
        },
        {
            label: 'Пользователи',
            icon: LucideUserPlus,
            to: '/admin/managers',
            access: 'ADMIN'
        },

    ]

    function toggleSidebar() {
        sidebarExpanded.value = !sidebarExpanded.value
    }
</script>
<style lang="scss" scoped>
.sidebar {
    min-height: 100vh;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 25px 0px;
}

.router-link-exact-active {
    @apply bg-indigo-500 text-white rounded font-normal
}
</style>