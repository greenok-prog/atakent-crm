import { ExhibitionsService, type GetQueries } from "~/services/exhibition.service"
import type { Exhibition, ExhibitionCreate } from "~/types/exhibition"
import type { AuthResponse, User } from "~/types/user"

export const useExhibitionsStore = defineStore('exhibitions', () => {
    const exhibitions = ref<Exhibition[]>([])
    const isLoaded = ref(false)

    // Кэш для данных с query.main
    const mainExhibitions = ref<Exhibition[]>([]);
    const isMainLoaded = ref(false);

    const toast = useToast()
    const exhibitionsService = new ExhibitionsService(toast)


    const getExhibitions = async (query?:GetQueries) => {
        if(isLoaded.value && !query){
            return
        }
        const {data} = await exhibitionsService.get(query)
        if(data.value){
            exhibitions.value = data.value
            isLoaded.value = true
        }
    }
    const getMainExhibitions = async () => {
        if (isMainLoaded.value) {
            return mainExhibitions.value; // Возвращаем данные из кэша
        }

        const { data } = await exhibitionsService.get({ main: true });
        if (data.value) {
            mainExhibitions.value = data.value;
            isMainLoaded.value = true;
        }

        return mainExhibitions.value;
    };
    const removeExhibition = async (id:number) => {
        const {error} = await exhibitionsService.remove(id)
        if(!error.value){
            exhibitions.value = exhibitions.value.filter(el => el.id !== id)
        }
    }

    const addExhibition = async (exhibition:Exhibition) => {
        const res = await exhibitionsService.add(exhibition)
        if(res.data.value){
            exhibitions.value.push(res.data.value)
        }
        return res
    }

    const changeExhibition = async (id: number, exhibition: Exhibition) => {
        const res = await exhibitionsService.change(id, exhibition)
        if (!res.error.value && res.data.value) {
            let index = exhibitions.value.findIndex(obj => obj.id === id);
            if (index !== -1) {
                exhibitions.value[index] = res.data.value;
            }
        }
        return res
    }


    return {
        mainExhibitions,
        exhibitions,
        getExhibitions,
        removeExhibition,
        addExhibition,
        changeExhibition,
        getMainExhibitions
    }
})