<template>
	<div class="navbar-menu relative z-50 " :class="isActive ? 'flex' : 'hidden'">
		<div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
		<nav
			class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
			<div class="flex items-center justify-between mb-8">
				<NuxtLink class="text-3xl font-bold leading-none w-24" to="/">
					<NuxtImg src="atakent-logo.svg" />
				</NuxtLink>
				<button @click="emit('changeActive')" class="navbar-close">
					<svg class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
						xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
						</path>
					</svg>
				</button>
			</div>
			<div>
				<ul>
					<li class="mb-1" v-for="link in links">
						<NuxtLink :to="link.to" @click="onLinkClick"
							class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
							{{ link.label }}</NuxtLink>
					</li>

				</ul>
			</div>
			<div class="mt-auto">
				<NuxtLink to="/admin/users" class="pt-6">
					<Button
						class="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-indigo-700 hover:bg-indigo-500 rounded-xl">Вход</Button>
				</NuxtLink>
				<p class="my-4 text-xs text-center text-gray-400">
					<span>Copyright © 2021</span>
				</p>
			</div>
		</nav>
	</div>
</template>


<script lang="ts" setup>
	const { isActive } = defineProps<{
		isActive: boolean
	}>()
	const emit = defineEmits(['changeActive'])

	const onLinkClick = () => emit('changeActive')
	const links: { label: string, to: string }[] = [{ label: 'Главная', to: '/' }, { label: 'Получить билет', to: '/visitor' }, { label: 'Забронировать стенд', to: '/exhibitor' }, { label: 'Контакты', to: '/contacts' }]

</script>