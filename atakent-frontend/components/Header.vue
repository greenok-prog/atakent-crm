<template>
	<header class="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
		<div class="flex w-full">
			<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
				<NuxtLink to="/" class="flex items-center space-x-2">

					<Icon name='lucide:building-2' class="h-8 w-8 text-blue-900" />

					<span class="text-2xl font-bold text-blue-900">Атакент-Экспо</span>

				</NuxtLink>
				<div class="hidden md:flex space-x-6">
					<NuxtLink v-for="link in links" :key="link.label"
						class="text-gray-700 hover:text-blue-900 transition-colors" :to="link.to">{{ link.label }}
					</NuxtLink>
				</div>

			</nav>
			<button class="md:hidden block" @click="isMenuOpen = !isMenuOpen">
				<LucideMenu class="h-6 w-6 text-blue-900" />
			</button>
		</div>
		<!-- Mobile menu -->
		<div v-if="isMenuOpen" class="md:hidden bg-white border-t">
			<div class="container mx-auto px-4 py-4 flex flex-col space-y-4">
				<NuxtLink v-for="link in links" :key="link.label"
					class="text-gray-700 hover:text-blue-900 transition-colors" :to="link.to">{{ link.label }}
				</NuxtLink>

			</div>
		</div>
	</header>

</template>
<script lang="ts" setup>
	const isMenuOpen = ref(false)

	const links = [
		{
			label: 'Регистрация',
			to: '/visitor'
		},
		{
			label: 'Портфолио',
			to: '/#portfolio'
		},
		{
			label: 'Контакты',
			to: '/contacts'
		},
		{
			label: 'Календарь',
			to: '/calendar'
		}
	]
</script>
<style>
.router-link-exact-active {
	@apply text-blue-700 font-bold
}
</style>