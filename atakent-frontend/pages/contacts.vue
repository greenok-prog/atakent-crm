<template>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="pt-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
            <div class="container mx-auto px-4 py-20">
                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6">Контакты</h1>
                    <p class="text-xl text-blue-100">
                        Свяжитесь с нами любым удобным способом. Мы всегда рады помочь вам в организации выставок и
                        создании стендов
                    </p>
                </div>
            </div>
        </section>

        <!-- Contact Info Cards -->
        <section class="py-20 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 -mt-32">
                    <!-- Phone Card -->
                    <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LucidePhone class="h-8 w-8 text-white" />
                        </div>
                        <h3 class="text-xl font-bold text-blue-900 mb-4">Телефон</h3>
                        <a href="tel:+77777777777" class="text-gray-600 hover:text-blue-900 transition-colors">
                            +7 (777) 777-77-77
                        </a>
                        <p class="text-gray-600 mt-2">
                            Пн-Пт: 9:00 - 18:00
                        </p>
                    </div>

                    <!-- Email Card -->
                    <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LucideMail class="h-8 w-8 text-white" />
                        </div>
                        <h3 class="text-xl font-bold text-blue-900 mb-4">Email</h3>
                        <a href="mailto:info@atakent-expo.kz"
                            class="text-gray-600 hover:text-blue-900 transition-colors">
                            info@atakent-expo.kz
                        </a>
                        <p class="text-gray-600 mt-2">
                            Ответим в течение 24 часов
                        </p>
                    </div>

                    <!-- Address Card -->
                    <div class="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LucideMapPin class="h-8 w-8 text-white" />
                        </div>
                        <h3 class="text-xl font-bold text-blue-900 mb-4">Адрес</h3>
                        <p class="text-gray-600">
                            ул. Тимирязева, 42<br />
                            БЦ "Атакент", 8 этаж<br />
                            Алматы, Казахстан
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map Section -->
        <section class="py-20">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div class="space-y-6">
                        <h2 class="text-3xl font-bold text-blue-900">
                            Как нас найти
                        </h2>
                        <p class="text-gray-600">
                            Мы находимся в бизнес-центре "Атакент" на 8 этаже. Вход со стороны улицы Тимирязева.
                            Бесплатная парковка доступна для всех посетителей.
                        </p>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <LucideCar class="h-5 w-5 text-blue-900" />
                                <span class="text-gray-600">Бесплатная парковка</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <LucideTrain class="h-5 w-5 text-blue-900" />
                                <span class="text-gray-600">5 минут от метро "Алатау"</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <LucideClock class="h-5 w-5 text-blue-900" />
                                <span class="text-gray-600">Режим работы: Пн-Пт 9:00 - 18:00</span>
                            </div>
                        </div>
                    </div>
                    <div class="h-[400px] rounded-xl overflow-hidden shadow-lg">
                        <iframe alt="Карта расположения офиса" class="w-full h-full object-cover"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1027.87888519587!2d76.90549326389416!3d43.224577885354435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836953e7c4f029%3A0x168e2d0e88823c37!2sPavilion%20Restaurant!5e0!3m2!1sru!2skz!4v1739940250076!5m2!1sru!2skz"
                            width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>

                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Form Section -->
        <section class="py-20 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-blue-900 mb-4">
                            Напишите нам
                        </h2>
                        <p class="text-gray-600">
                            Заполните форму, и мы свяжемся с вами в ближайшее время
                        </p>
                    </div>

                    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-8">
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <div class="space-y-2">
                                <label for="name" class="text-sm font-medium text-gray-700">
                                    Ваше имя *
                                </label>
                                <input id="name" v-model="form.name" type="text" required
                                    class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                                    placeholder="Введите ваше имя" />
                            </div>
                            <div class="space-y-2">
                                <label for="phone" class="text-sm font-medium text-gray-700">
                                    Телефон *
                                </label>
                                <input id="phone" v-model="form.phone" type="tel" required
                                    class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                                    placeholder="+7 (___) ___-__-__" />
                            </div>
                        </div>

                        <div class="space-y-2 mb-6">
                            <label for="email" class="text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input id="email" v-model="form.email" type="email" required
                                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                                placeholder="example@email.com" />
                        </div>

                        <div class="space-y-2 mb-6">
                            <label for="subject" class="text-sm font-medium text-gray-700">
                                Тема
                            </label>
                            <select id="subject" v-model="form.subject"
                                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900">
                                <option value="" disabled>Выберите тему</option>
                                <option value="exhibition">Участие в выставке</option>
                                <option value="stand">Строительство стенда</option>
                                <option value="partnership">Партнерство</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>

                        <div class="space-y-2 mb-6">
                            <label for="message" class="text-sm font-medium text-gray-700">
                                Сообщение *
                            </label>
                            <textarea id="message" v-model="form.message" required rows="5"
                                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                                placeholder="Введите ваше сообщение"></textarea>
                        </div>

                        <button type="submit"
                            class="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                            Отправить сообщение
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <!-- Social Media Section -->
        <section class="py-20">
            <div class="container mx-auto px-4">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-blue-900 mb-4">
                        Мы в социальных сетях
                    </h2>
                    <p class="text-gray-600 mb-8">
                        Подписывайтесь на наши социальные сети, чтобы быть в курсе последних новостей и событий
                    </p>
                    <div class="flex justify-center space-x-6">
                        <a href="#"
                            class="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                            <LucideFacebook class="h-6 w-6 text-white" />
                        </a>
                        <a href="#"
                            class="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                            <LucideInstagram class="h-6 w-6 text-white" />
                        </a>
                        <a href="#"
                            class="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                            <LucideLinkedin class="h-6 w-6 text-white" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import {
        PhoneIcon,
        MailIcon,
        MapPinIcon,
        CarIcon,
        TrainIcon,
        ClockIcon,
        FacebookIcon,
        InstagramIcon,
        LinkedinIcon
    } from 'lucide-vue-next'

    const form = ref({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = () => {
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', form.value)
    }
</script>