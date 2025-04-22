import { useUserStore } from "~/store/user.store"

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useUserStore()
    const {userIsAdmin, user} = storeToRefs(store)
    
    if(!userIsAdmin.value){
        return navigateTo('/admin')
    }
})