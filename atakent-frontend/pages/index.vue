<template>
    <div class="min-h-screen w-full">
        <!-- Hero Section -->
        <ClientOnly>
            <section class="relative pt-24 overflow-hidden min-h-screen flex items-center">
                <!-- Animated background -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 animate-gradient">
                    <!-- Animated particles -->
                    <div class="absolute inset-0">
                        <div v-for="n in 20" :key="n" class="particle" :style="{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 8 + 2}px`,
                            height: `${Math.random() * 8 + 2}px`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${Math.random() * 4 + 4}s`
                        }"></div>
                    </div>
                </div>

                <div class="container mx-auto px-4 relative">
                    <div class="grid lg:grid-cols-2 gap-12 items-center">
                        <!-- Text content -->
                        <div class="text-white" data-aos="fade-right" data-aos-delay="200">
                            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                Выставочные стенды мирового уровня
                            </h1>
                            <p class="text-xl text-blue-100 mb-8" data-aos="fade-up" data-aos-delay="400">
                                От идеи до реализации. Создаем уникальные выставочные пространства, которые привлекают
                                внимание и запоминаются
                            </p>
                            <div class="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="600">
                                <button
                                    class="group relative px-8 py-4 bg-white text-blue-900 rounded-lg font-bold overflow-hidden transform hover:scale-105 transition-all duration-300">
                                    <span class="relative z-10">Начать проект</span>
                                    <div
                                        class="absolute inset-0 bg-yellow-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    </div>
                                </button>
                                <button
                                    class="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                    Портфолио
                                </button>
                            </div>
                        </div>

                        <!-- Image content -->
                        <div class="relative" data-aos="fade-left" data-aos-delay="400">
                            <NuxtImg src="/main.webp" alt="Выставочный стенд"
                                class="rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-all duration-500 hover:shadow-3xl" />
                            <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-300"
                                data-aos="zoom-in" data-aos-delay="800">
                                <div class="flex items-center gap-4">
                                    <div class="bg-blue-900 p-3 rounded-xl animate-pulse">
                                        <LucideTrophy class="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Реализовано проектов</p>
                                        <p class="text-2xl font-bold text-blue-900">
                                            <CounterAnimation :end-value="500" :duration="2000" />+
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ClientOnly>

        <!-- Exhibitions Section -->
        <section class="py-20">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12 text-blue-900" data-aos="fade-up">
                    Наши выставки
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <template v-if="exhibitions">
                        <div v-for="(exhibition, index) in exhibitions" :key="exhibition.id" data-aos="fade-up"
                            :data-aos-delay="index * 100" class="opacity-0">
                            <!-- Добавляем opacity-0 для начального состояния -->
                            <ExhibitionCard :exhibition="exhibition" />
                        </div>
                    </template>
                    <!-- Добавим состояние загрузки -->
                    <template v-else>
                        <div v-for="n in 5" :key="n" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
                            <div class="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <!-- Portfolio Section -->
        <section id="portfolio" class="py-20 pt-10">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12 text-blue-900" data-aos="fade-up">
                    Наши работы
                </h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div v-for="(project, index) in portfolioProjects" :key="project.id"
                        class="relative group overflow-hidden rounded-lg transform hover:scale-105 transition-all duration-500"
                        data-aos="fade-up" :data-aos-delay="index * 100">
                        <NuxtImg :src="project.image" :alt="project.title"
                            class="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div
                            class="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                            <div
                                class="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span class="text-white font-bold text-lg block">{{ project.title }}</span>
                                <span class="text-blue-200 text-sm mt-2 block">{{ project.description }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Registration Section -->
        <section class="py-20 bg-gradient-to-r from-blue-50 to-blue-100">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
                    <div class="p-8 md:p-12">
                        <div class="text-center mb-8" data-aos="fade-up">
                            <h2 class="text-3xl font-bold text-blue-900 mb-4">
                                Регистрация на выставку
                            </h2>
                            <p class="text-lg text-gray-600 mb-6">
                                Станьте участником наших выставок! Выберите удобный способ регистрации
                            </p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Website Registration -->
                            <div class="bg-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                                data-aos="fade-right" data-aos-delay="200">
                                <LucideMonitor class="h-12 w-12 mx-auto mb-4 text-blue-900" />
                                <h3 class="text-xl font-semibold text-blue-900 mb-3">
                                    Регистрация через сайт
                                </h3>
                                <p class="text-gray-600 mb-6">
                                    Заполните форму онлайн и получите билет на email
                                </p>
                                <NuxtLink to="/visitor"
                                    class="inline-flex items-center justify-center space-x-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors w-full">
                                    <LucideMousePointer class="h-5 w-5" />
                                    <span>Регистрация онлайн</span>
                                </NuxtLink>
                            </div>

                            <!-- WhatsApp Registration -->
                            <div class="bg-green-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                                data-aos="fade-left" data-aos-delay="400">
                                <LucideMessageCircle class="h-12 w-12 mx-auto mb-4 text-green-600" />
                                <h3 class="text-xl font-semibold text-green-700 mb-3">
                                    Регистрация через WhatsApp
                                </h3>
                                <p class="text-gray-600 mb-6">
                                    Отправьте сообщение и получите инструкции в WhatsApp
                                </p>
                                <a href="https://wa.me/77777777777?text=Здравствуйте!%20Хочу%20зарегистрироваться%20на%20выставку"
                                    target="_blank" rel="noopener noreferrer"
                                    class="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors w-full">
                                    <span>Написать в WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 bg-blue-900 text-white">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div data-aos="fade-right">
                        <h2 class="text-3xl font-bold mb-6">О компании</h2>
                        <p class="text-blue-100 mb-4">
                            Атакент-Экспо - ведущая компания в сфере организации выставок и строительства выставочных
                            стендов. Мы работаем на рынке более 15 лет и реализовали сотни успешных проектов.
                        </p>
                        <ul class="space-y-3">
                            <li class="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="200">
                                <LucideCheckCircle class="h-5 w-5 text-yellow-500" />
                                <span>Профессиональная команда специалистов</span>
                            </li>
                            <li class="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="300">
                                <LucideCheckCircle class="h-5 w-5 text-yellow-500" />
                                <span>Современное оборудование</span>
                            </li>
                            <li class="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="400">
                                <LucideCheckCircle class="h-5 w-5 text-yellow-500" />
                                <span>Индивидуальный подход к каждому клиенту</span>
                            </li>
                        </ul>
                    </div>
                    <div class="relative h-[400px]" data-aos="fade-left" data-aos-delay="200">
                        <NuxtImg src="https://images.unsplash.com/photo-1515187029135-18ee286d815b" alt="О компании"
                            class="rounded-lg shadow-xl object-cover w-full h-full" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8">
                    <div data-aos="fade-up" data-aos-delay="100">
                        <div class="flex items-center space-x-2 mb-4">
                            <LucideBuilding2 class="h-8 w-8" />
                            <span class="text-xl font-bold">Атакент-Экспо</span>
                        </div>
                        <p class="text-gray-400">
                            Ваш надежный партнер в организации выставок и строительстве стендов
                        </p>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="200">
                        <h3 class="text-lg font-bold mb-4">Услуги</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li>Дизайн стендов</li>
                            <li>Строительство стендов</li>
                            <li>Организация выставок</li>
                            <li>Техническое обеспечение</li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="300">
                        <h3 class="text-lg font-bold mb-4">Компания</h3>
                        <ul class="space-y-2 text-gray-400">
                            <li>О нас</li>
                            <li>Портфолио</li>
                            <li>Контакты</li>
                            <li>Вакансии</li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="400">
                        <h3 class="text-lg font-bold mb-4">Следите за нами</h3>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                                <LucideFacebook class="h-6 w-6" />
                            </a>
                            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                                <LucideInstagram class="h-6 w-6" />
                            </a>
                            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                                <LucideLinkedin class="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {{ new Date().getFullYear() }} Атакент-Экспо. Все права защищены.</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useExhibitionsStore } from '~/store/exhibitions.store'

    definePageMeta({
        layout: 'default'
    })
    useHead({
        title: 'Атакент-Экспо - Выставочные стенды мирового уровня',
        meta: [
            {
                name: 'description',
                content: 'Создаем уникальные выставочные пространства, которые привлекают внимание и запоминаются'
            }
        ],
        htmlAttrs: {
            lang: 'ru'
        }
    })

    const { getExhibitions } = useExhibitionsStore()
    const { exhibitions } = storeToRefs(useExhibitionsStore())

    const portfolioProjects = ref([
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },
        {
            id: 1,
            title: 'Tech Expo Stand',
            description: 'Инновационный стенд для технологической выставки',
            image: '/stands/1.jpg'
        },


    ])
    await getExhibitions()

</script>

<style>
.animate-gradient {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

.particle {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float ease-in-out infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}

/* Add smooth scrolling to the whole page */
html {
    scroll-behavior: smooth;
}

/* Enhanced transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced shadow for hover effects */
.hover\:shadow-3xl:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

[data-aos] {
    opacity: 0;
    transition-property: opacity, transform;
}

[data-aos].aos-animate {
    opacity: 1;
}

/* Дополнительные стили для плавности */
.exhibition-card-enter-active,
.exhibition-card-leave-active {
    transition: all 0.3s ease;
}

.exhibition-card-enter-from,
.exhibition-card-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>