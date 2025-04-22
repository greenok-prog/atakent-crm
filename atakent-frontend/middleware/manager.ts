import { useUserStore } from "~/store/user.store"

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useUserStore()
    const {userIsManager, userIsAdmin, user} = storeToRefs(store)
    console.log(userIsManager.value, userIsAdmin.value);
    
    
    if( !userIsManager.value  ){
        return navigateTo('/admin')
    }
})