# Базовый образ
FROM node:18

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Собираем Nuxt-проект
RUN npm run build

# Указываем запуск Nuxt
CMD ["npm", "run", "preview"]

EXPOSE 3000
