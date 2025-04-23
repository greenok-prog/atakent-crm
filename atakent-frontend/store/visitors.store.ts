import { VisitorsService } from "~/services/visitors.service"
import type { Visitor, VisitorCreate, VisitorWithStatistics } from "~/types/visitor"



export const useVisitorsStore = defineStore('visitors', () => {
    const visitors = ref<VisitorWithStatistics | null>(null)
    const isLoaded = ref(false)

    const toast = useToast()
    const visitorService = new VisitorsService(toast) 

    const getVisitors = async (query:any) => {
        if(isLoaded && !query){
            return 
        }
        const response = await visitorService.get({query})
        if(response.data.value){
            visitors.value = response.data.value
        }
        return response
    }

    const addVisitor  = async (visitor:VisitorCreate) => {
        const response = await visitorService.add(visitor)
        if(response.data.value){
            visitors.value?.visitors.push(response.data.value)
        }
        return response
    }
    const removeVisitor = async (id: number) => {
        const res = await visitorService.remove(id)
        if (res.data && visitors.value) {
            visitors.value.visitors = visitors.value.visitors.filter(v => v.id !== id)
        }
        return res
    }
    const getVisitorsCount = computed(() => {
        return visitors.value?.visitors.length
    })
   


    return {
        visitors,
        getVisitors,
        addVisitor,
        removeVisitor,
        getVisitorsCount
        
    }
})