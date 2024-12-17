export type ValidationResult = {
  isValid: boolean
  message: string
}

export function isValidLogin(login: string): ValidationResult {
  /* 1. от 3 до 20 символов;
     2. латиница;
     3. может содержать цифры, но не состоять из них;
     4. без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
  */

  if (login === '') {
    return { isValid: false, message: 'Это поле обязательно' }
  }

  const regex = /^(?!\d{3,20}$)[A-Za-z0-9_-]{3,20}$/
  return {
    isValid: regex.test(login),
    message: '3-20 цифр и букв, латиница, без пробелов'
  }
}

export function isValidPassword(password: string): ValidationResult {
  /* 1. от 8 до 40 символов;
     2. обязательно хотя бы одна заглавная буква и цифра.
  */
  if (password === '') {
    return { isValid: false, message: 'Это поле обязательно' }
  }

  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/
  return {
    isValid: regex.test(password),
    message: '8-40 символов, цифра и одна заглавная буква'
  }
}

export function isValidName(name: string): ValidationResult {
  /* 1. латиница или кириллица;
     2. первая буква должна быть заглавной;
     3. без пробелов и без цифр;
     4. нет спецсимволов (допустим только дефис).
  */

  if (name === '') {
    return { isValid: false, message: 'Это поле обязательно' }
  }
  const regex = /^[A-ZА-Я][a-zа-я\-]*$/u
  return {
    isValid: regex.test(name),
    message: '1 заглавная буква, без пробелов и цифр'
  }
}

export function isValidEmail(email: string): ValidationResult {
  /* 1. латиница;
     2. может включать цифры и спецсимволы вроде дефиса и подчёркивания;
     3. обязательно должна быть «собака» (@) и точка после неё;
     4. перед точкой обязательно должны быть буквы.
  */

  if (email === '') {
    return { isValid: false, message: 'Это поле обязательно' }
  }
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/
  return { isValid: regex.test(email), message: 'Формат: kolya@yandex.ru' }
}

export function isValidPhone(phone: string): ValidationResult {
  /* 1. от 10 до 15 символов;
     2. состоит из цифр;
     3. может начинается с плюса.
  */

  if (phone === '') {
    return { isValid: false, message: 'Это поле обязательно' }
  }
  const regex = /^\+?\d{10,15}$/
  return {
    isValid: regex.test(phone),
    message: '10-15 цифр, может начинаться с +'
  }
}

export function isPasswordConfirmed(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (confirmPassword === '') {
    return { isValid: false, message: 'Подтвердите пароль' }
  }

  return {
    isValid: password === confirmPassword,
    message: 'Пароли не совпадают'
  }
}

export function isValidDisplayName(name: string): ValidationResult {
  if (name === '') {
    return {
      isValid: false,
      message: 'Это поле обязательно'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}
