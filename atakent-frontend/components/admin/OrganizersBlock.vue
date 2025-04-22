<template>
    <AdminBox class="col-span-3" title="Список организаторов">
        <div class="self-start">
            <div class="card flex gap-2 items-center">
                <Chip :label="chip.name" removable v-for="chip in organizers" @remove="organizerService.remove(chip.id)"
                    :key="chip.id" />
            </div>
            <div class="flex gap-2 w-full mt-4">
                <BaseInput placeholder="Новый вариант" v-model="chipInput" />
                <Button icon="pi pi-plus" @click="addOrganizer(chipInput)" />
            </div>
        </div>
    </AdminBox>
</template>

<script lang="ts" setup>
    import { OrganizerService } from '~/services/organizer.service';
    import type { Organizer } from '~/types/organizer';
    const { organizers } = defineProps<{
        organizers: Organizer[]
    }>()
    const toast = useToast();
    const organizerService = new OrganizerService(toast)


    const addOrganizer = async (name: string) => {
        const resError = organizerService.add(name, {})
        if (!resError) {
            chipInput.value = ''
        }
    };
    const chipInput = ref('');
</script>