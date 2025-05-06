
import { TicketsService } from "~/services/tickets.service"
import type { Ticket, TicketCreate } from "~/types/ticket"


export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref<Ticket[]>([])
    const isLoaded = ref(false)

    const toast = useToast()
    const ticketservice = new TicketsService(toast) 

    const gettickets = async () => {
        if(isLoaded && tickets.value.length){
            return 
        }
        const response = await ticketservice.get()
        if(response.data.value){
            tickets.value = response.data.value
        }
        return response
    }
    const addticket = async (ticket:TicketCreate) => {
        const res = await ticketservice.add(ticket, {})
        if(res && res.data.value){
            tickets.value.push(res.data.value)
        }
        return res
    }
    const removeticket = async (id:number) => {
        const res = await ticketservice.remove(id)
        if(!res.error.value){
            tickets.value = tickets.value.filter(el => el.id !== id)
        }
        return res
    }
    const changeticket = async (id:number,ticket:Ticket) => {
        const res = await ticketservice.change(id, ticket)
        if(res && !res.error.value && res.data.value){
            let index = tickets.value.findIndex(obj => obj.id === id);
            if (index !== -1 && tickets.value[index]) {
                tickets.value[index] = res.data.value;
              }
        }
        return res
    }


    return {
        tickets,
        gettickets,
        addticket,
        removeticket,
        changeticket
    }
})