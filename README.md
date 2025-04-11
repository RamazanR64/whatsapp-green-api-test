# WhatsApp Web Clone с использованием GREEN-API

Это приложение представляет собой простой клон веб-интерфейса WhatsApp, использующий GREEN-API для отправки и получения сообщений.

## Функциональность

- Авторизация с использованием idInstance и apiTokenInstance из GREEN-API
- Создание новых чатов по номеру телефона
- Отправка текстовых сообщений
- Автоматическое получение входящих сообщений
- Простой и интуитивно понятный интерфейс, схожий с WhatsApp Web

## Требования

- Node.js версии 14.0.0 или выше
- Npm версии 6.0.0 или выше
- Аккаунт в сервисе GREEN-API

## Инструкция по установке и запуску

1. Клонируйте репозиторий:
git clone https://github.com/ваш-аккаунт/whatsapp-green-api-test.git
cd whatsapp-green-api-test

2. Установите зависимости:
npm install

3. Запустите приложение в режиме разработки:
npm start

4. Откройте http://localhost:3000 в вашем браузере

## Инструкция по использованию

1. Получите учетные данные GREEN-API:
- Зарегистрируйтесь на сайте https://green-api.com/
- Создайте инстанс и авторизуйте его через QR-код WhatsApp
- Скопируйте идентификатор инстанса (idInstance) и токен (apiTokenInstance)

2. Авторизуйтесь в приложении:
- Введите полученные idInstance и apiTokenInstance
- Нажмите кнопку "Войти"

3. Создайте новый чат:
- Введите номер телефона в международном формате без "+" (например, 79123456789)
- Нажмите кнопку "Создать чат"

4. Отправьте сообщение:
- Выберите чат из списка слева
- Введите текст сообщения в поле внизу
- Нажмите кнопку "Отправить"

## Особенности тестирования

- Приложение проверяет наличие новых сообщений каждые 5 секунд
- Для корректной работы необходимо, чтобы инстанс в GREEN-API был активен
- Номер телефона получателя должен быть зарегистрирован в WhatsApp