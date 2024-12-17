import { Button, UserFormField, type UserFormFieldProps } from '@/components'
import { Block, type BlockProps } from '@/core'
import {
  isValidLogin,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidDisplayName,
  type ValidationResult,
  type User
} from '@/utils'

type ChangeDataFormProps = BlockProps & {
  user: User
}

export class ChangeDataForm extends Block<ChangeDataFormProps> {
  private fields: UserFormField[]

  constructor(props: ChangeDataFormProps) {
    const { user } = props

    const emailField = new UserFormField({
      label: 'Почта',
      name: 'email',
      type: 'email',
      value: user.email,
      validate: isValidEmail
    })

    const loginField = new UserFormField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      value: user.login,
      validate: isValidLogin
    })

    const firstNameField = new UserFormField({
      label: 'Имя',
      name: 'first_name',
      type: 'text',
      value: user.first_name,
      validate: isValidName
    })

    const secondNameField = new UserFormField({
      label: 'Фамилия',
      name: 'second_name',
      type: 'text',
      value: user.second_name,
      validate: isValidName
    })

    const displayNameField = new UserFormField({
      label: 'Имя в чате',
      name: 'display_name',
      type: 'text',
      value: user.display_name,
      validate: isValidDisplayName
    })

    const phoneField = new UserFormField({
      label: 'Телефон',
      name: 'phone',
      type: 'tel',
      value: user.phone,
      validate: isValidPhone
    })

    const submitButton = new Button({
      type: 'submit',
      label: 'Сохранить',
      className: 'user-form__button'
    })

    super('form', {
      ...props,
      className: 'user-form user-form__card',
      childBlocksList: [
        emailField,
        loginField,
        firstNameField,
        secondNameField,
        displayNameField,
        phoneField,
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
      displayNameField,
      phoneField
    ]
  }

  private getUpdatedFields(
    current: User,
    updated: Partial<User>
  ): Partial<User> {
    return Object.entries(updated).reduce<Partial<User>>(
      (changes, [key, newValue]) => {
        const oldValue = current[key as keyof User]
        if (oldValue !== newValue) {
          changes[key as keyof User] = newValue as User[keyof User]
        }
        return changes
      },
      {}
    )
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
      const values = this.fields.reduce<Record<string, string>>(
        (acc, field) => {
          acc[field.getName()] = field.getValue()
          return acc
        },
        {}
      )
      const updatedFields = this.getUpdatedFields(this.props.user, values)
      if (Object.values(updatedFields).length !== 0) {
        console.table(updatedFields)
      }
    }
  }
}
