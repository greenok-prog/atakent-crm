export const getTitleByRoute = () => {
    const route = useRoute()
    const routePath = route.fullPath
    switch(routePath){
        case '/admin':
            return 'Главная'
        case '/admin/users':
            return 'Список посетителей'
        case '/admin/managers':
            return 'Список пользователей'
        case '/admin/managers/add':
            return 'Добавление пользователя'
        case '/admin/exhibiitons':
            return 'Список выставок'
        case '/admin/stands':
            return 'Список участников'
        default:
            return 'Административная система    '
    }
    
}