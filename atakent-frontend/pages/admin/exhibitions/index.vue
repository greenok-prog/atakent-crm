<template>
  <div>
    <div>
      <div class="flex justify-between items-center">
        <AdminPageTitle title="Список выставок" />
        <Button label="Добавить выставку" @click="dialogHandler" />
      </div>
      <div v-if="exhibitions.length" class="grid grid-cols-5 gap-8 wrap items-start mt-4">
        <ExhibitionCard v-for="exhibition in activeExhibitions" :exhibition :isAdmin="true" :key="exhibition.id" />
      </div>
      <div class="flex justify-between items-center mt-8">
        <AdminPageTitle title="Архивные" />
      </div>
      <div v-if="exhibitions.length" class="grid grid-cols-5 gap-8 wrap items-start mt-4">
        <ExhibitionCard v-for="exhibition in archiveExhibitions" :exhibition :isAdmin="true" :key="exhibition.id" />
      </div>
    </div>


    <Toast />
    <Dialog v-model:visible="addDialogVisible" modal header="Добавление мероприятия" :style="{ width: '30rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <AdminExhibitionForm @backHandler="addDialogVisible = false" @formSubmitHandler="addHandler" />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
  import { useExhibitionsStore } from '~/store/exhibitions.store';
  import { useSourcesStore } from '~/store/sources.store';
  import type { ExhibitionCreate } from '~/types/exhibition';

  definePageMeta({
    layout: 'admin-layout',
    middleware: ['admin', 'auth']
  });

  const addDialogVisible = ref(false)
  const { getExhibitions, addExhibition } = useExhibitionsStore()
  const { exhibitions } = storeToRefs(useExhibitionsStore())


  const archiveExhibitions = computed(() => {
    return exhibitions.value.filter(exhibition => exhibition.archive)
  })
  const activeExhibitions = computed(() => {
    return exhibitions.value.filter(exhibition => !exhibition.archive)
  })
  const dialogHandler = () => {
    addDialogVisible.value = !addDialogVisible.value
  }

  const addHandler = async (formValues: ExhibitionCreate, exhibitionImage: any) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(formValues)) {
      formData.append(key, value);
    }
    if (exhibitionImage) {
      formData.append('image', exhibitionImage);
    }
    formData.append('organizer', String(formValues.organizer_id))
    // Отправка данных на сервер
    const res = await addExhibition(formData)
    addDialogVisible.value = false
  }

  await getExhibitions()

</script>