import type { ToastServiceMethods } from "primevue/toastservice";
import { API_ROUTES } from "~/constants/api";
import type { Ticket, TicketCreate } from "~/types/ticket";
interface RequestsOptions{
    refresh?: (opts?:undefined) => Promise<void>
}
export interface GetQueries{
    main:boolean
}
export class TicketsService{
    private toast?: ToastServiceMethods;
    constructor (toast? : ToastServiceMethods){
        this.toast = toast
    }
    async get(query?:GetQueries){
        const res = await useAPI<Ticket[]>(API_ROUTES.TICKETS, {
            query:query
        })
        return res
    }
    async add(exhibition:TicketCreate, options?:RequestsOptions){
        const res = await useAPI<Ticket>(API_ROUTES.TICKETS, {
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
        const res = await useAPI(`${API_ROUTES.TICKETS}/${id}`, {
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
    
    async change(id:number, ticket: Ticket){
        const res = await useAPI<Ticket>(`${API_ROUTES.TICKETS}/${id}`, {
            method:'PATCH',
            body:ticket
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
    async changeArchive(id:number){
        const res = await useAPI<Ticket>(`${API_ROUTES.TICKETS}/${id}/archive`, {
            method:'GET',
        })
        return res 
    }
    
}