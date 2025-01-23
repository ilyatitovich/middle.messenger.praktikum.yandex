# Y-CHAT

**Y-CHAT** — это веб-мессенджер, разработанный с использованием JavaScript, TypeScript, CSS и API браузера.

## Основные возможности

- **Регистрация**: создание нового аккаунта;
- **Авторизация**: вход в систему;
- **Список чатов**: отображение всех доступных чатов и возможность перехода в нужный;
- **Обмен сообщениями**: отправка и получение сообщений в реальном времени.

## Используемые технологии

### Основные зависимости

- **Express**: Используется для запуска сервера;
- **Handlebars**: Шаблонизатор для верстки страниц.

### Инструменты для разработки

- **TypeScript**: Статическая типизация для JavaScript, обеспечивающая безопасность кода и улучшенную разработку;
- **Vite**: Быстрый инструмент для разработки и сборки проекта.

### Линтинг и форматирование кода

- **ESLint**: Линтер для JavaScript и TypeScript, помогает соблюдать правила кодирования;
  - Плагин **@typescript-eslint**: Правила для TypeScript;
  - Плагин **eslint-plugin-perfectionist**: Упорядочивание объектов и импортов;
- **Prettier**: Форматирование кода.

### Линтинг стилей

- **Stylelint**: Линтер для CSS и PostCSS;
  - Конфигурация **@stylistic/stylelint-config**: Предустановленные правила Stylelint;
  - Плагин **stylelint-use-logical**: Для работы с логическими свойствами CSS.

### Постобработка CSS

- **PostCSS**: Инструмент для работы с CSS;
  - Плагин **autoprefixer**: Добавляет вендорные префиксы для поддержки браузеров;
  - Плагин **postcss-nesting**: Поддержка вложенных селекторов в CSS.

### Инструменты для работы с Git

- **Husky**: Управление Git-хуками для запуска проверок перед коммитом;
- **Nano Staged**: Легковесный инструмент для запуска проверок на стейдженных файлах.

### Сценарии и управление задачами

- **npm-run-all**: Утилита для выполнения нескольких npm-скриптов.

## Список страниц

- [Вход](https://y-chat.netlify.app/)
- [Регистрация](https://y-chat.netlify.app/sign-up)
- [Профиль пользователя](https://y-chat.netlify.app/settings)
- [Изменить данные](https://y-chat.netlify.app/settings/change-data)
- [Изменить пароль](https://y-chat.netlify.app/settings/change-password)
- [404](https://y-chat.netlify.app/404)
- [500](https://y-chat.netlify.app/500)
- [Чат](https://y-chat.netlify.app/messenger)

## Дизайн

[Дизайн приложения выполнен в редакторе Figma](https://www.figma.com/design/zfqizT8NEYCLaOUsm95N1k/middle.messenger.praktikum.yandex?node-id=0-1&t=WvK4MT1XLEpIoF7J-1)

## Локальный запуск

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/ilyatitovich/middle.messenger.praktikum.yandex.git
   ```

2. Перейдите в папку с проектом:

   ```bash
   cd y-chat
   ```

3. Установите зависимости:

   ```bash
   npm install
   ```

4. Запустите приложение:

   ```bash
   npm run start
   ```

5. Запуск в режиме разработки:

   ```bash
   npm run dev
   ```

## Live версия

[Проект развернут на сервере Netlify](https://y-chat.netlify.app/)
