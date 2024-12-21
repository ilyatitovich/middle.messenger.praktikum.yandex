export type User = {
  avatar: string
  email: string
  login: string
  first_name: string
  second_name: string
  display_name: string
  phone: string
}

export type Chat = {
  id: string
  avatar: string
  name: string
  lastMessage: string
  timestamp: string
}

export type Message = {
  sender: string | 'me'
  text: string
}

export const mockUser: User = {
  avatar: 'https://robohash.org/kolya',
  email: 'zubenko.n@yandex.ru',
  login: 'robot-kolya',
  first_name: 'Николай',
  second_name: 'Зубенко',
  display_name: 'Робот Коля',
  phone: '+79999999999'
}

export const mockChats = [
  {
    id: 'dshsaasfj',
    avatar: 'https://robohash.org/alice',
    name: 'Артур',
    lastMessage: 'Привет! Хочу поделиться прикольной штукой, новый оператор JS',
    timestamp: '2024-12-11T10:15:00'
  },
  {
    id: 'sgsdg36456353fsdgs',
    avatar: 'https://robohash.org/bob',
    name: 'Киноклуб',
    lastMessage:
      'Дорогие друзья! Сегодня в нашем клубе состоится интересное событие, а именно',
    timestamp: '2024-12-10T15:30:00'
  },
  {
    id: 'dshadj5v45dsfsd',
    avatar: 'https://robohash.org/charlie',
    name: 'Миша Сергееич',
    lastMessage: 'здарова',
    timestamp: '2024-12-09T08:45:00'
  },
  {
    id: '455vaf-dsgsdv',
    name: 'динар',
    avatar: 'https://robohash.org/diana',
    lastMessage: 'Изображение',
    timestamp: '2024-12-08T12:20:00'
  },
  {
    id: 'asfkahf7673242h',
    name: 'леша я тут',
    avatar: 'https://robohash.org/ethan',
    lastMessage: 'собираемся в 9',
    timestamp: '2024-12-07T17:10:00'
  }
]

export const mockMessages: Message[] = [
  {
    sender: 'Артур',
    text: 'съешь же ещё этих мягких французских булок, да выпей чаю'
  },
  {
    sender: 'Артур',
    text: `Значение
1. стандартная фраза для тестирования печатающих устройств, содержит все буквы русского алфавита

Синонимы:
1. съешь ещё этих мягких французских булок, да выпей чаю (В этом варианте отсутствует буква «ж», однако он распространился благодаря включению в средства Microsoft Windows для просмотра шрифтов), съешь ещё этих мягких французских булок, да выпей же чаю (частица же размещена в другой части предложения)`
  },
  {
    sender: 'me',
    text: 'Привет!'
  }
]
