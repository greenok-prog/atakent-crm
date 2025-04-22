
import { ExhibitorsService } from "~/services/exhibitor.service"
import type { Exhibitor } from "~/types/exhibitor"




export const useExhibitorsStore = defineStore('exhibitors', () => {
    const exhibitors = ref<Exhibitor[]>([])
    const isLoaded = ref(false)

    const toast = useToast()
    const exhibitorservice = new ExhibitorsService(toast) 

    const getExhibitors = async () => {
        if(isLoaded && exhibitors.value.length){
            return 
        }
        const response = await exhibitorservice.get()
        if(response.data.value){
            exhibitors.value = response.data.value
        }
        return response
    }
    const addExhibitor = async (exhibitor:Exhibitor) => {
        const res = await exhibitorservice.add(exhibitor)
        if(res && res.data.value){
            exhibitors.value.push(res.data.value)
        }
        return res
    }
   


    return {
        exhibitors,
        getExhibitors,
        addExhibitor
    }
})