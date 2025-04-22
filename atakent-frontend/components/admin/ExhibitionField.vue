<template>
    <div class="flex flex-col gap-2">
        <div :class="`items-${isEditing ? 'end' : 'center'} ${!isEditing ? 'flex gap-4' : ''} `">
            <AdminExhibitionForm :initialExhibitionValues="exhibition" :isEditing="isEditing" @backHandler="backHandler"
                @formSubmitHandler="editExhibition" />

            <div class="flex items-center gap-2">
                <Button v-if="!isEditing" icon='pi pi-pencil' @click="changeDisable" />
                <Button icon="pi pi-times" v-if="!isEditing" @click="removeHandler" />
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
    import { useExhibitionsStore } from '~/store/exhibitions.store';
    import type { Exhibition, ExhibitionCreate } from '~/types/exhibition';


    const emit = defineEmits(['refreshData'])
    const { exhibition, initialEditing = false } = defineProps<{
        exhibition: Exhibition,
        initialEditing?: boolean
    }>()



    const isEditing = ref(initialEditing)

    const { removeExhibition, changeExhibition } = useExhibitionsStore()

    const changeDisable = () => {
        isEditing.value = !isEditing.value
    }
    const backHandler = () => {
        isEditing.value = false
    }



    // Change exhibition handler
    const editExhibition = async (formValues: ExhibitionCreate, exhibitionImage: any) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(formValues)) {
            formData.append(key, value);
        }
        if (exhibitionImage) {
            formData.append('image', exhibitionImage);
        }

        formData.append('website', 'fsdfsdfsdf')
        formData.append('organizer', String(formValues.organizer_id))
        // Отправка данных на сервер
        const res = await changeExhibition(exhibition.id, formData)
        if (!res.error.value) {
            isEditing.value = false
        }
    };

    // Remove exhibition handler
    const removeHandler = async () => {
        removeExhibition(exhibition.id)
    }


</script>