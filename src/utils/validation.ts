export function isValidLogin(login: string): boolean {
  /* 1. от 3 до 20 символов;
     2. латиница;
     3. может содержать цифры, но не состоять из них;
     4. без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
  */
  const regex = /^(?!\d{3,20}$)[A-Za-z0-9_-]{3,20}$/
  return regex.test(login)
}

export function isValidPassword(password: string): boolean {
  /* 1. от 8 до 40 символов;
     2. обязательно хотя бы одна заглавная буква и цифра.
  */
  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/
  return regex.test(password)
}

export function isValidName(name: string): boolean {
  /* 1. латиница или кириллица;
     2. первая буква должна быть заглавной;
     3. без пробелов и без цифр;
     4. нет спецсимволов (допустим только дефис).
  */
  const regex = /^[A-ZА-Я][a-zа-я\-]*$/u
  return regex.test(name)
}

export function isValidEmail(email: string): boolean {
  /* 1. латиница;
     2. может включать цифры и спецсимволы вроде дефиса и подчёркивания;
     3. обязательно должна быть «собака» (@) и точка после неё;
     4. перед точкой обязательно должны быть буквы.
  */
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/
  return regex.test(email)
}

export function isValidPhone(phone: string): boolean {
  /* 1. от 10 до 15 символов;
     2. состоит из цифр;
     3. может начинается с плюса.
  */
  const regex = /^\+?\d{10,15}$/
  return regex.test(phone)
}
