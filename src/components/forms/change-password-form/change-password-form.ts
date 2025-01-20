import { type ChangePasswordData } from '@/api'
import { Button, type ButtonProps, UserFormField } from '@/components'
import { userController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { type UserState, userStore } from '@/stores'
import { isValidPassword, isPasswordConfirmed } from '@/utils'

type ChangePasswordFormProps = BlockProps

export class ChangePasswordForm extends Block<ChangePasswordFormProps> {
  private oldPasswordField: UserFormField
  private newPasswordField: UserFormField
  private confirmPasswordField: UserFormField
  private submitButton: Button

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
    this.submitButton = submitButton

    this.storeUnsubscribe = userStore.subscribe(state => {
      const { status } = state as UserState

      if (status === 'loading') {
        this.submitButton.setProps<ButtonProps>({ isDisabled: true })
        return
      }

      if (status === 'success') {
        this.resetForm()
      }

      this.submitButton.setProps<ButtonProps>({ isDisabled: false })
    })
  }

  private resetForm(): void {
    this.oldPasswordField.resetValue()
    this.newPasswordField.resetValue()
    this.confirmPasswordField.resetValue()
  }

  private async handleSubmit(event: SubmitEvent): Promise<void> {
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
      userController.updatePassword(fields as ChangePasswordData)
    }
  }
}
