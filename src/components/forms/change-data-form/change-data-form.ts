import { UserData } from '@/api'
import {
  Button,
  type ButtonProps,
  UserFormField,
  type UserFormFieldProps
} from '@/components'
import { userController } from '@/controllers/user-controller'
import { Block, type BlockProps } from '@/core'
import { UserState, userStore, type User } from '@/stores'
import {
  isValidLogin,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidDisplayName,
  isDeepEqual
} from '@/utils'

export type ChangeDataFormProps = BlockProps & {
  user: User | null
}

export class ChangeDataForm extends Block<ChangeDataFormProps> {
  private fields: UserFormField[]
  private submitButton: Button
  private storeUnsubscribe: () => void

  constructor(props: ChangeDataFormProps) {
    const { user } = props

    const emailField = new UserFormField({
      label: 'Почта',
      name: 'email',
      type: 'email',
      value: user ? user.email : '',
      validate: isValidEmail
    })

    const loginField = new UserFormField({
      label: 'Логин',
      name: 'login',
      type: 'text',
      value: user ? user.login : '',
      validate: isValidLogin
    })

    const firstNameField = new UserFormField({
      label: 'Имя',
      name: 'first_name',
      type: 'text',
      value: user ? user.first_name : '',
      validate: isValidName
    })

    const secondNameField = new UserFormField({
      label: 'Фамилия',
      name: 'second_name',
      type: 'text',
      value: user ? user.second_name : '',
      validate: isValidName
    })

    const displayNameField = new UserFormField({
      label: 'Имя в чате',
      name: 'display_name',
      type: 'text',
      value: user && user.display_name ? user.display_name : '',
      validate: isValidDisplayName
    })

    const phoneField = new UserFormField({
      label: 'Телефон',
      name: 'phone',
      type: 'tel',
      value: user ? user.phone : '',
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

    this.submitButton = submitButton

    this.storeUnsubscribe = userStore.subscribe(state => {
      const { status, user } = state as UserState

      if (status === 'loading') {
        this.submitButton.setProps<ButtonProps>({ isDisabled: true })
        return
      }

      if (user) {
        this.fields.forEach(field => {
          const name = field.getName()
          field.setProps<UserFormFieldProps>({
            value: user[name as keyof User] as string
          })
        })
      }

      this.submitButton.setProps<ButtonProps>({ isDisabled: false })
    })
  }

  private isSameUserData(newData: Record<string, string>): boolean {
    const { user: oldUserData } = userStore.get()
    const newUserData = {
      id: oldUserData?.id,
      avatar: oldUserData?.avatar,
      ...newData
    }
    return isDeepEqual(oldUserData!, newUserData)
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const validations: boolean[] = this.fields.map(field =>
      field.validateValue()
    )

    if (validations.every(value => value === true)) {
      const values = this.fields.reduce<Record<string, string>>(
        (acc, field) => {
          acc[field.getName()] = field.getValue()
          return acc
        },
        {}
      )

      if (Object.values(values).length !== 0) {
        if (this.isSameUserData(values)) return
        userController.updateData(values as UserData)
      }
    }
  }

  protected onUnmount(): void {
    this.storeUnsubscribe()
  }
}
