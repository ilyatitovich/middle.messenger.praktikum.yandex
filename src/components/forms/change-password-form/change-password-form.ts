import { Button, UserFormField } from '@/components'
import { Block, type BlockProps } from '@/core'
import { isValidPassword, isPasswordConfirmed } from '@/utils'

type ChangePasswordFormProps = BlockProps

export class ChangePasswordForm extends Block<ChangePasswordFormProps> {
  private oldPasswordField: UserFormField
  private newPasswordField: UserFormField
  private confirmPasswordField: UserFormField

  constructor(props: ChangePasswordFormProps = {}) {
    const oldPasswordField = new UserFormField({
      label: 'Старый пароль',
      type: 'password',
      name: 'oldPassword',
      validate: isValidPassword
    })

    const newPasswordField = new UserFormField({
      label: 'Новый пароль',
      type: 'password',
      name: 'newPassword',
      validate: isValidPassword
    })

    const confirmPasswordField = new UserFormField({
      label: 'Новый пароль (еще раз)',
      type: 'password',
      name: 'confirmPassword',
      validate: () =>
        isPasswordConfirmed(
          this.newPasswordField.getValue(),
          this.confirmPasswordField.getValue()
        )
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
        oldPasswordField,
        newPasswordField,
        confirmPasswordField,
        submitButton
      ],
      events: {
        submit: (e: Event) => this.handleSubmit(e as SubmitEvent)
      }
    })

    this.oldPasswordField = oldPasswordField
    this.newPasswordField = newPasswordField
    this.confirmPasswordField = confirmPasswordField
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()

    const fields: Record<string, string> = {
      oldPassword: this.oldPasswordField.getValue(),
      newPassword: this.newPasswordField.getValue()
    }

    const validations: boolean[] = [
      this.oldPasswordField.validateValue(),
      this.newPasswordField.validateValue(),
      this.confirmPasswordField.validateValue()
    ]

    if (
      validations.every(value => value === true) &&
      fields.newPassword !== fields.oldPassword
    ) {
      console.table(fields)
    }
  }
}
