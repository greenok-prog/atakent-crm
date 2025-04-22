
import { OrganizerService } from "~/services/organizer.service"
import type { Organizer } from "~/types/organizer"

export const useOrganizersStore = defineStore('organizers', () => {
    const organizers = ref<Organizer[]>([])
    const isLoaded = ref(false)

    const toast = useToast()
    const organizerService = new OrganizerService(toast) 

    const getOrganizers = async () => {
        if(isLoaded && organizers.value.length){
            return 
        }
        const response = await organizerService.get()
        if(response.data.value){
            organizers.value = response.data.value
        }
        return response
    }
    const addOrganizer = async (organizer:string) => {
        const res = await organizerService.add(organizer, {})
        if(res && res.data.value){
            organizers.value.push(res.data.value)
        }
        return res
    }
    const removeOrganizer = async (id:number) => {
        const res = await organizerService.remove(id)
        if(!res.error.value){
            organizers.value = organizers.value.filter(el => el.id !== id)
        }
        return res
    }
    const changeOrganizer = async (id:number,name:string) => {
        const res = await organizerService.change(id, name)
        if(res && !res.error.value && res.data.value){
            let index = organizers.value.findIndex(obj => obj.id === id);
            if (index !== -1 && organizers.value[index]) {
                organizers.value[index] = res.data.value;
              }
        }
        return res
    }


    return {
        organizers,
        getOrganizers,
        addOrganizer,
        removeOrganizer,
        changeOrganizer
    }
})