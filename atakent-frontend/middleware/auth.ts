import { useUserStore } from "~/store/user.store"

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useUserStore()
    const {isLoggedIn} = storeToRefs(store)
    const accessToken = useCookie('accessToken')
    if(!isLoggedIn.value || !accessToken.value){
     
        return navigateTo('/admin/login')
      
       
    }
})