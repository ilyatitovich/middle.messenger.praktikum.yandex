import { Button, UserFormField, type UserFormFieldProps } from '@/components'
import { Block, type BlockProps } from '@/core'
import {
  isValidLogin,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidPhone,
  isPasswordConfirmed,
  ValidationResult
} from '@/utils'

type SignUpFormProps = BlockProps

export class SignUpForm extends Block<SignUpFormProps> {
  private fields: UserFormField[]
  private passwordField: UserFormField
  private confirmPasswordField: UserFormField

  constructor(props: SignUpFormProps = {}) {
    const emailField = new UserFormField({
      label: 'Почта',
      name: 'email',
      type: 'email',
      validate: isValidEmail
    })

    const loginField = new UserFormField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      validate: isValidLogin
    })

    const firstNameField = new UserFormField({
      label: 'Имя',
      name: 'first_name',
      type: 'text',
      validate: isValidName
    })

    const secondNameField = new UserFormField({
      label: 'Фамилия',
      name: 'second_name',
      type: 'text',
      validate: isValidName
    })

    const phoneField = new UserFormField({
      label: 'Телефон',
      name: 'phone',
      type: 'tel',
      validate: isValidPhone
    })

    const passwordField = new UserFormField({
      label: 'Пароль',
      type: 'password',
      name: 'password',
      validate: isValidPassword
    })

    const confirmPasswordField = new UserFormField({
      label: 'Пароль (еще раз)',
      type: 'password',
      name: 'confirmPassword',
      validate: () =>
        isPasswordConfirmed(
          this.passwordField.getValue(),
          this.confirmPasswordField.getValue()
        )
    })

    const submitButton = new Button({
      type: 'submit',
      label: 'Зарегистрироваться',
      className: 'user-form__button'
    })

    super('form', {
      ...props,
      className: 'user-form',
      childBlocksList: [
        emailField,
        loginField,
        firstNameField,
        secondNameField,
        phoneField,
        passwordField,
        confirmPasswordField,
        submitButton
      ],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.fields = [
      emailField,
      loginField,
      firstNameField,
      secondNameField,
      phoneField,
      passwordField,
      confirmPasswordField
    ]

    this.passwordField = passwordField
    this.confirmPasswordField = confirmPasswordField
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const validations = this.fields.reduce<Record<string, ValidationResult>>(
      (acc, field) => {
        acc[field.getName()] = field.validateValue()
        return acc
      },
      {}
    )

    this.fields.forEach(field => {
      field.setProps<UserFormFieldProps>({
        validationResult: validations[field.getName()]
      })
    })

    if (Object.values(validations).every(value => value.isValid)) {
      const fields = this.fields.reduce<Record<string, string>>(
        (acc, field) => {
          const name = field.getName()
          if (name !== 'confirmPassword') {
            acc[name] = field.getValue()
          }
          return acc
        },
        {}
      )

      console.table(fields)
    }
  }
}
