import type { ToastServiceMethods } from "primevue/toastservice";
import { API_ROUTES } from "~/constants/api";
import type { Exhibition } from "~/types/exhibition";
interface RequestsOptions{
    refresh?: (opts?:undefined) => Promise<void>
}
export interface GetQueries{
    main:boolean
}
export class ExhibitionsService{
    private toast?: ToastServiceMethods;
    constructor (toast? : ToastServiceMethods){
        this.toast = toast
    }
    async get(query?:GetQueries){
        const res = await useAPI<Exhibition[]>(API_ROUTES.EXHIBITIONS, {
            query:query
        })
        return res
    }
    async add(exhibition:Exhibition, options?:RequestsOptions){
        const res = await useAPI<Exhibition>(API_ROUTES.EXHIBITIONS, {
            method:'POST',
            body:exhibition
        })

        if(this.toast){
            const errors = res.error.value
            if (res.error.value) {
                const errorMessage = errors?.data.message
                if(errorMessage.length > 1){
                    this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при добавлении выставки', life: 3000 }); // Уведомление об ошибке
                }
                else{
                    this.toast.add({ severity: 'error', summary: 'Ошибка', detail: errorMessage[0].message, life: 3000 }); // Уведомление об ошибке
                    console.error('Ошибка при добавлении выставки:',res.error.value);
                }
                
            } else {
                this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Выставка успешно добавлена', life: 3000 }); // Уведомление об успехе
                  
            }
        }
           
        return res 
    }
    async remove(id:number, options?:RequestsOptions){
        const res = await useAPI(`${API_ROUTES.EXHIBITIONS}/${id}`, {
            method:"delete"
        })
        if(this.toast){
            if (res.error.value) {
                this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при добавлении выставки', life: 3000 }); // Уведомление об ошибке
                console.error('Ошибка при добавлении выставки:',res.error.value);
            } else {
                this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Выставка успешно добавлена', life: 3000 }); // Уведомление об успехе
                  
            }
        }
        return res 
    }
    
    async change(id:number, exhibition: Exhibition){
        const res = await useAPI<Exhibition>(`${API_ROUTES.EXHIBITIONS}/${id}`, {
            method:'PATCH',
            body:exhibition
        })
        if(this.toast){
            if (res.error.value) {
                this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при изменении выставки', life: 3000 }); // Уведомление об ошибке
            } else {
                this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Выставка успешно изменена', life: 3000 }); // Уведомление об успехе
                  
            }
        }
        return res 
    }
    
}