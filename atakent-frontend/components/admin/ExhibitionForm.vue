<template>
    <form action="" class="grow">
        <BaseInput :disabled="!isEditing" v-model="name" v-bind="nameAttrs" class="w-full grow"
            placeholder="Название" />
        <div v-if="isEditing" class="flex flex-col gap-2 mt-2">
            <Textarea v-model="description" v-bind="descriptionAttrs" class="w-full" placeholder="Описание"
                :errorMessage="errors.description" />
            <BaseInput v-model="location" v-bind="locationAttrs" class="w-full" placeholder="Место проведения" />
            <Select v-model="organizer_id" :options="organizers" optionLabel="name" optionValue="id"
                v-bind="organizerAttrs" placeholder="Организатор" />
            <DatePicker v-model="dateStart" v-bind="startDateAttrs" placeholder="Дата начала выставки" />
            <DatePicker v-model="dateEnd" v-bind="endDateAttrs" placeholder="Дата окончания выставки" />
            <FileInput :file="exhibitionImage" :preloadServer="initialExhibitionValues?.image"
                @onChangeFile="(event) => onAddImage(event)" />
        </div>
        <div v-if="isEditing" class="flex gap-8 justify-between mt-4">
            <Button @click="submitHandler" class="w-32 ">Сохранить</Button>
            <Button @click="emit('backHandler')" class="w-24 ">Назад</Button>
        </div>

        <div>

        </div>
    </form>
</template>

<script lang="ts" setup>
    import { date, number, object, string, type Schema } from 'yup';
    import { useOrganizersStore } from '~/store/organizers.store';
    import type { Exhibition, ExhibitionCreate } from '~/types/exhibition';

    const emit = defineEmits(['formSubmitHandler', 'backHandler'])
    const { initialExhibitionValues: exhibition, isEditing = true } = defineProps<{
        initialExhibitionValues?: Exhibition,
        isEditing?: boolean
    }>()
    const { organizers } = storeToRefs(useOrganizersStore())
    const { getOrganizers } = useOrganizersStore()

    await getOrganizers()
    const initialValues = computed(() => {
        if (exhibition) {
            return {
                name: exhibition.name ?? '',
                description: exhibition?.description ?? '',
                dateEnd: new Date(exhibition?.dateEnd) ?? '',
                dateStart: new Date(exhibition.dateStart) ?? '',
                location: exhibition.location ?? '',
                organizer_id: exhibition.organizer_id ?? ''
            }
        }
        else {
            return {
                name: '',
                description: '',
                dateEnd: new Date(),
                dateStart: new Date(),
                location: '',
                organizer_id: 0
            }
        }
    })
    const exhibitionImage = ref<undefined | File>(undefined)
    const file = ref<undefined | File>(undefined)
    const onAddImage = (event: any) => {

        if (event.target) {
            exhibitionImage.value = event.target.files[0]
            console.log(exhibitionImage.value);


        }
    }
    //Exhibition form validation schema
    const validationSchema: Schema<ExhibitionCreate> = object({
        name: string().required(),
        description: string().required(),
        dateStart: date().required(),
        dateEnd: date().required(),
        location: string().required(),
        organizer_id: number().required()
    })

    // Exhibition form
    const { defineField, handleSubmit, errors, values: formValues } = useForm<ExhibitionCreate>({
        initialValues: initialValues.value,
        validationSchema
    })

    // Exhibition form fields
    const [name, nameAttrs] = defineField('name')
    const [description, descriptionAttrs] = defineField('description')
    const [dateEnd, endDateAttrs] = defineField('dateEnd')
    const [dateStart, startDateAttrs] = defineField('dateStart')
    const [location, locationAttrs] = defineField('location')
    const [organizer_id, organizerAttrs] = defineField('organizer_id')


    const submitHandler = handleSubmit(() => emit('formSubmitHandler', formValues, exhibitionImage.value))
</script>