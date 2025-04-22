import type { AuthResponse, User } from "~/types/user"

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user:{} as User | null,
            isLoggedIn:false
        } 
    },
    actions:{
        setUser(user:User){
            this.user = user
            this.isLoggedIn = true
        },
        login(data:AuthResponse){
            const refresh = useCookie('refreshToken')
            refresh.value = data.refresh_token
            const accessToken = useCookie('accessToken')
            accessToken.value = data.access_token
            this.setUser(data.user)
        },
        async logout(){
            const refresh = useCookie('refreshToken')
            refresh.value = null
            const accessToken = useCookie('accessToken')
            accessToken.value = null
            this.user = null
            await navigateTo('/admin/login')
        }
    },
    getters:{
        userIsAdmin: (state) => {
            return state.user?.roles.includes('ADMIN')
           
        },
        userIsAssistant: (state) =>state.user?.roles.includes('ASSISTANT'),
        userIsManager: (state) =>state.user?.roles.includes('MANAGER')
    }
})