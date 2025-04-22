<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto px-4">
            <!-- Header -->
            <div class="max-w-3xl mx-auto text-center mb-12">
                <h1 class="text-3xl font-bold text-blue-900 mb-4">
                    Регистрация на выставку
                </h1>
                <p class="text-gray-600">
                    Заполните форму для получения электронного билета на выставку
                </p>
            </div>

            <!-- Registration Form -->
            <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <form class="space-y-6" @submit="submitHandler">
                    <!-- Visitor Type -->
                    <div class="space-y-4">
                        <label class="text-sm font-medium text-gray-700">Тип посетителя</label>
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <button type="button" @click="executor = 'individual'" :class="[
                                'p-4 rounded-lg border-2 text-center transition-colors',
                                executor === 'individual'
                                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 hover:border-blue-900/50'
                            ]">
                                <LucideUser class="h-6 w-6 mx-auto mb-2" />
                                <span class="font-medium">Частное лицо</span>
                            </button>
                            <button type="button" @click="executor = 'company'" :class="[
                                'p-4 rounded-lg border-2 text-center transition-colors',
                                executor === 'company'
                                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 hover:border-blue-900/50'
                            ]">
                                <LucideBuilding class="h-6 w-6 mx-auto mb-2" />
                                <span class="font-medium">Специалист</span>
                            </button>
                        </div>
                    </div>

                    <!-- Personal Info -->
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <BaseInput v-model="name" v-bind="nameAttrs" :errorMessage="errors.name" label="Имя"
                                class="w-full" />
                        </div>

                        <div class="space-y-2">
                            <BaseInputMask v-model="phone" v-bind="phoneAttrs" :errorMessage="errors.phone"
                                label="Номер телефона" class="w-full" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <BaseInput v-model="email" v-bind="emailAttrs" :errorMessage="errors.email" type="email"
                            label="Email" class="w-full" />
                    </div>

                    <!-- Exhibition Selection -->
                    <div class="space-y-2">
                        <label class="font-medium text-gray-700 text-sm" for="">Выберите выставку</label>
                        <Select class="w-full py-1" placeholder="Выберите выставку" v-model="exhibition"
                            v-bind="exhibitionAttrs" :options="exhibitions" optionLabel="name" optionValue="id" />
                        <small v-if="errors.exhibition" class="text-red-500">{{ errors.exhibition }}</small>
                    </div>

                    <div class="space-y-2">
                        <label class="font-medium text-gray-700 text-sm" for="">Источник</label>
                        <Select :options="sources" optionLabel="name" optionValue="name" v-model="fair"
                            v-bind="fairAttrs" :errorMessage="errors.fair" :disabled="isFairDisabled"
                            label="Откуда вы узнали о выставке" class="w-full py-1" />
                        <small v-if="errors.fair" class="text-red-500">{{ errors.fair }}</small>
                    </div>


                    <!-- Company Info (conditional) -->
                    <div v-if="executor === 'company'" class="space-y-6">
                        <div class="space-y-2">
                            <BaseInput v-model="companyName" v-bind="companyNameAttrs"
                                :errorMessage="errors.companyName" label="Название компании" class="w-full" />
                        </div>

                        <!-- <div class="space-y-2">
                            <label class="font-medium text-gray-700 text-sm" for="">Страна</label>
                            <Select :options="countries" v-model="country" editable optionLabel="name"
                                optionValue="name" v-bind="countryAttrs" :errorMessage="errors.country"
                                label="Страна/город" class="w-full py-1" />
                        </div> -->
                    </div>

                    <!-- Submit Button -->
                    <Button type="submit"
                        class="w-full bg-blue-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                        Зарегистрироваться
                    </Button>
                </form>
            </div>
        </div>
    </div>




    <RegistrationSuccessModal v-if="responseData" :isOpen="dialogStatus" @close="dialogStatus = false"
        :registration="responseData" />
    <BaseLoader v-if="isDataLoading" />
</template>


<script lang="ts" setup>
    import * as yup from 'yup'
    import type { Source, Visitor } from '~/types/visitor';
    import { useExhibitionsStore } from '~/store/exhibitions.store';
    import { useVisitorsStore } from '~/store/visitors.store';
    import { useSourcesStore } from '~/store/sources.store';
    import { LucideBuilding, LucideUser } from '#components';

    const route = useRoute()
    const config = useRuntimeConfig()
    const dialogStatus = ref(false)
    definePageMeta({
        layout: 'empty'
    })
    const { getExhibitions } = useExhibitionsStore()
    const { exhibitions } = storeToRefs(useExhibitionsStore())
    const { addVisitor } = useVisitorsStore()
    const { getSources } = useSourcesStore()
    const { sources } = storeToRefs(useSourcesStore())

    await getSources()
    await getExhibitions()


    // const { data: countries } = await useFetch(`https://data-api.oxilor.com/rest/countries?key=${config.public.countryKey}&lng=ru`)


    const validationSchema = yup.object({
        name: yup.string().required('Обязательное поле'),
        email: yup.string().required('Обязательное поле').email('Неверный формат Email'),
        phone: yup.string().required('Обязательное поле'),
        fair: yup.string().required('Обязательное поле'),
        exhibition: yup.number().required('Обязательное поле'),
        executor: yup.string().required('Обязательное поле').is(['individual', 'company'], 'Обязательное поле'),
        country: yup.string(),
        companyName: yup.string()

    })

    const { errors, handleSubmit, defineField, values, resetForm, setErrors } = useForm({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            fair: '',
            exhibition: Number(route.query.exhibition) ?? '',
            executor: 'individual',
            country: 'Казахстан',
            companyName: ''
        },
        validationSchema
    })

    const [name, nameAttrs] = defineField('name')
    const [email, emailAttrs] = defineField('email')
    const [phone, phoneAttrs] = defineField('phone')
    const [exhibition, exhibitionAttrs] = defineField('exhibition')
    const [fair, fairAttrs] = defineField('fair')
    const [executor, executorAttrs] = defineField('executor')
    const [country, countryAttrs] = defineField('country')
    const [companyName, companyNameAttrs] = defineField('companyName')

    const isFairDisabled = ref(false)

    const isDataLoading = ref(false)
    const responseData = ref<null | Visitor>(null)

    const submitHandler = handleSubmit(async () => {
        if (isDataLoading.value) return; // предотвратить множественные запросы
        dialogStatus.value = true;
        isDataLoading.value = true;

        const { data, error } = await addVisitor({ ...values, exhibitionId: exhibition.value })
        if (!error.value && data.value) {
            responseData.value = data.value;
            dialogStatus.value = true;
            resetForm();
        } else if (error.value) {
            setErrors(error.value.data)


        }


        console.error('Ошибка при выполнении запроса:', error);
        // Обработайте ошибку

        isDataLoading.value = false;


    });

    onMounted(() => {
        if (route.query.fair && sources.value) {
            const selectedSource: any = sources.value.find(el => el.name === route.query.fair)
            if (selectedSource) {
                fair.value = selectedSource.name
                isFairDisabled.value = true
            }
        }
    })

</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>