export interface User{
    name:string,
    email:string,
    roles:string[]
}

export interface AuthResponse{
    access_token:string,
    refresh_token:string,
    user:User
}