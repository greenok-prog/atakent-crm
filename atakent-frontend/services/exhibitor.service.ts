import type { ToastServiceMethods } from "primevue/toastservice";
import { API_ROUTES } from "~/constants/api";
import type { Exhibitor } from "~/types/exhibitor";

export class ExhibitorsService{
    private toast?: ToastServiceMethods;
    constructor (toast? : ToastServiceMethods){
        this.toast = toast
    }
    async get(){
        const res = await useAPI<Exhibitor[]>(API_ROUTES.EXHIBITORS)
        return res
    }
    async add(exhibitor:Exhibitor){
        const res = await useAPI<Exhibitor>(API_ROUTES.EXHIBITORS, {
            method:'POST',
            body:exhibitor
        })
        if (res.error.value) {
            if(this.toast){
                this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при регистрации', life: 3000 });
            } // Уведомление об ошибке
            
        } else {
            if(this.toast){
                this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Успешная регистрация', life: 3000 }); // Уведомление об успехе
            }
            
        }
        return res
    }
}