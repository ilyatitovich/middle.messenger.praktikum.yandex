import './file-upload-form.css'

import {
  Button,
  ButtonProps,
  ErrorMessage,
  Input,
  type ErrorMessageProps
} from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import FileUploadFormTemplate from './file-upload-form.hbs?raw'

type FileUploadFormProps = BlockProps & {
  accept?: string
  handleUploadFile: (file: File) => Promise<void>
  handleCancel: () => void
}

export class FileUploadForm extends Block<FileUploadFormProps> {
  private MAX_FILE_SIZE: number = 1024 * 1024 // 1 MB
  private errorMessage: ErrorMessage
  private fileName: HTMLElement | null | undefined
  private submitButton: Button

  constructor(props: FileUploadFormProps) {
    const input = new Input({
      type: 'file',
      name: 'file',
      accept: '.jpeg, .jpg, .png, .gif, .webp',
      className: 'file-upload-form__input',
      events: { change: (e: Event) => this.handleChange(e as InputEvent) }
    })
    const errorMessage = new ErrorMessage({
      message: 'Нужно выбрать файл',
      className: 'user-form__validation-error'
    })

    const submitButton = new Button({
      type: 'submit',
      label: 'Загрузить',
      className: 'user-form__button'
    })

    super('form', {
      ...props,
      className: 'file-upload-form',
      childBlocksList: [
        input,
        errorMessage,
        submitButton,
        new Button({
          label: 'Отмена',
          className: 'file-upload-form__cancel-button',
          events: {
            click: props.handleCancel
          }
        })
      ],
      events: { submit: (e: Event) => this.hanldeSubmit(e as SubmitEvent) }
    })

    this.element?.setAttribute('enctype', 'multipart/form-data')
    this.errorMessage = errorMessage
    this.submitButton = submitButton
    this.fileName = null
  }

  private handleChange(e: InputEvent): void {
    const file = (e.target as HTMLInputElement).files?.item(0)
    this.fileName = this.element?.querySelector('.file-upload-form__file-name')

    if (this.fileName && file) {
      this.fileName.textContent = file.name as string
      this.errorMessage.setProps<ErrorMessageProps>({
        isHidden: true
      })
    }
  }

  private async hanldeSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault()
    const file = new FormData(this.element as HTMLFormElement).get('file')

    if (file && file instanceof File) {
      if (file.size === 0) {
        this.errorMessage.setProps<ErrorMessageProps>({
          isHidden: false,
          message: 'Нужно выбрать файл'
        })
        return
      }

      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage.setProps<ErrorMessageProps>({
          isHidden: false,
          message: 'Слишком большой файл'
        })
        return
      }

      this.submitButton.setProps<ButtonProps>({ isDisabled: true })
      await this.props.handleUploadFile(file)
      this.submitButton.setProps<ButtonProps>({ isDisabled: false })
    }
  }

  protected render(): string {
    return getTemplate(FileUploadFormTemplate)
  }
}
