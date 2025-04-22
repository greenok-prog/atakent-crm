<template>
    <div>
        <div class="flex flex-col gap-4">
            <AdminBox :title="index === 0 ? `Список выставок` : ''" v-for="(exhibition, index) in exhibitions"
                :key="exhibition.id">
                <AdminExhibitionField :exhibition="exhibition" />
            </AdminBox>
            <AdminBox v-if="isAddExhibition">
                <AdminExhibitionAddField :isAdding="isAddExhibition" @changeAddHandler="isAddExhibition = false" />
            </AdminBox>
        </div>
        <Button class="mt-4" label="Добавить выставку" icon="pi pi-plus" @click="openAddExhibitionInput"
            v-if="!isAddExhibition" />
    </div>
</template>

<script lang="ts" setup>
    import type { Exhibition } from '~/types/exhibition';

    const { exhibitions } = defineProps<{
        exhibitions: Exhibition[]
    }>()





    const isAddExhibition = ref(false);


    const openAddExhibitionInput = () => {
        isAddExhibition.value = true;
    };

</script>