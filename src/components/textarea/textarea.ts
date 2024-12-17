import './textarea.css'

import { Block, type BlockProps } from '@/core'

type TextareaProps = BlockProps

export class Textarea extends Block<TextareaProps> {
  constructor(props: TextareaProps = {}) {
    super('textarea', { ...props, className: 'textarea' })

    if (this.element instanceof HTMLTextAreaElement) {
      Object.assign(this.element, {
        id: 'message',
        name: 'message',
        placeholder: 'Сообщение'
      })
    }
  }
}
