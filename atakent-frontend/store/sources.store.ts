
import { SourcesService } from "~/services/sources.service"
import type { Source } from "~/types/source"


export const useSourcesStore = defineStore('sources', () => {
    const sources = ref<Source[]>([])
    const isLoaded = ref(false)

    const toast = useToast()
    const sourceservice = new SourcesService(toast) 

    const getSources = async () => {
        if(isLoaded && sources.value.length){
            return 
        }
        const response = await sourceservice.get()
        if(response.data.value){
            sources.value = response.data.value
        }
        return response
    }
    const addSource = async (source:string) => {
        const res = await sourceservice.add(source, {})
        if(res && res.data.value){
            sources.value.push(res.data.value)
        }
        return res
    }
    const removeSource = async (id:number) => {
        const res = await sourceservice.remove(id)
        if(!res.error.value){
            sources.value = sources.value.filter(el => el.id !== id)
        }
        return res
    }
    const changeSource = async (id:number,name:string) => {
        const res = await sourceservice.change(id, name)
        if(res && !res.error.value && res.data.value){
            let index = sources.value.findIndex(obj => obj.id === id);
            if (index !== -1 && sources.value[index]) {
                sources.value[index] = res.data.value;
              }
        }
        return res
    }


    return {
        sources,
        getSources,
        addSource,
        removeSource,
        changeSource
    }
})