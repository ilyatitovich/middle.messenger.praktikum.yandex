import './file-upload-form.css'

import {
  Button,
  ErrorMessage,
  Input,
  type ErrorMessageProps
} from '@/components'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import FileUploadFormTemplate from './file-upload-form.hbs?raw'

type FileUploadFormProps = BlockProps & {
  handleUploadFile: (file: File) => void
  handleCancel: () => void
}

export class FileUploadForm extends Block<FileUploadFormProps> {
  private errorMessage: ErrorMessage
  private fileName: HTMLElement | null | undefined

  constructor(props: FileUploadFormProps) {
    const input = new Input({
      type: 'file',
      name: 'file',
      className: 'file-upload-form__input',
      events: { change: (e: Event) => this.handleChange(e) }
    })
    const errorMessage = new ErrorMessage({
      message: 'Нужно выбрать файл',
      className: 'user-form__validation-error'
    })

    super('form', {
      ...props,
      className: 'file-upload-form',
      childBlocksList: [
        input,
        errorMessage,
        new Button({
          type: 'submit',
          label: 'Загрузить',
          className: 'user-form__button'
        }),
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
    this.fileName = null
  }

  private handleChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.item(0)
    this.fileName = this.element?.querySelector('.file-upload-form__file-name')

    if (this.fileName && file) {
      this.fileName.textContent = file.name as string
      this.errorMessage.setProps<ErrorMessageProps>({
        isHidden: true
      })
    }
  }

  private hanldeSubmit(e: SubmitEvent): void {
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
      this.props.handleUploadFile(file)
    }
  }

  protected render(): string {
    return getTemplate(FileUploadFormTemplate)
  }
}
