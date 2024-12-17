import './modal.css'

import { Block, type BlockProps } from '@/core/block'
import { getTemplate } from '@/utils/get-template'

import ModalTemplate from './modal.hbs?raw'

type ModalProps = BlockProps & {
  content: Block
}

export class Modal extends Block<ModalProps> {
  constructor(props: ModalProps) {
    super('div', {
      ...props,
      className: 'modal',
      childBlocks: { content: props.content }
    })
  }

  protected render(): string {
    return getTemplate(ModalTemplate)
  }
}
