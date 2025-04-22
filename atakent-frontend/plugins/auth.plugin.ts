import { useUserStore } from "~/store/user.store";
import type { AuthResponse } from "~/types/user";

export default defineNuxtPlugin({
    name: 'auth-plugin',
 
    async setup (nuxtApp) {
        const refreshToken = useCookie('refreshToken')
        const {login} = useUserStore()
        
        if(refreshToken.value){
            const {data} = await useAPI<AuthResponse>('/auth/me', {
                method:'POST',
                body:{
                    access_token:refreshToken.value
                }
            })
            if(data.value){
                login(data.value)
            }
            
            
        }
    }
  })