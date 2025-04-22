<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <AdminLayoutSidebar />

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top bar -->
            <!-- <header class="bg-white shadow-sm z-10">
                <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 class="text-lg font-semibold text-gray-900">{{ currentPage }}</h1>
                </div>
            </header> -->

            <!-- Page content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>

<script setup>

</script>