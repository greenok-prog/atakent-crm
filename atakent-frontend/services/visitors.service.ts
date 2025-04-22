import type { ToastServiceMethods } from "primevue/toastservice";
import { API_ROUTES } from "~/constants/api";
import type { Visitor, VisitorCreate, VisitorWithStatistics } from "~/types/visitor";

interface GetQueries{
    exhibition?: string,
    fair?: string,
    registrationDateStart?: string,
    registrationDateEnd?: string
}
interface GetOptions{
    query:GetQueries
}
export class VisitorsService{
    private toast?: ToastServiceMethods;
    constructor (toast? : ToastServiceMethods){
        this.toast = toast
    }
    async get(options:GetOptions){
        const res = await useAPI<VisitorWithStatistics>(API_ROUTES.VISITORS, {
            query:options.query
        })
        return res
    }
    async add(visitor:VisitorCreate){
        const res = await useAPI<Visitor>(API_ROUTES.VISITORS, {
            method: 'POST',
            body: visitor
          });
      
          if (res.error.value && this.toast) {
            this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при регистрации', life: 3000 }); // Уведомление об ошибке
          } else {
           if(this.toast){
            this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Вы успешно зарегестрировались', life: 3000 }); // Уведомление об успехе
           }
          }
          return res
    }

    async remove(id:number){
        const res = await useAPI(`${API_ROUTES.VISITORS}/${id}`)
        if(res.error.value && this.toast){
            this.toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при удалении', life: 3000 }); // Уведомление об ошибке
        }else{
            if(this.toast){
                this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Посетитель удален', life: 3000 }); // Уведомление об успехе

            }
        }
    }
}