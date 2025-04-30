#!/bin/bash

# Настройки
CONTAINER_NAME=projects_postgres_1  # <- замени на имя контейнера, например: myproject_postgres_1
DB_NAME=testdb
DB_USER=postgres
BACKUP_DIR=./db_backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE=$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql

# Создаём папку для бэкапов, если её нет
mkdir -p $BACKUP_DIR

# Выполняем pg_dump внутри контейнера
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Проверка
if [ $? -eq 0 ]; then
  echo "✅ Бэкап успешно создан: $BACKUP_FILE"
else
  echo "❌ Ошибка при создании бэкапа"
fi
