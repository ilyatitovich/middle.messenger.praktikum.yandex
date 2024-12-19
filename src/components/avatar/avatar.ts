import './avatar.css'

import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import AvatarTemplate from './avatar.hbs?raw'

type AvatarProps = BlockProps & {
  imgSrc: string
  handleOpenModal: () => void
}

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super('button', {
      ...props,
      className: 'profile-avatar__button',
      events: { click: props.handleOpenModal }
    })
    if (this.element instanceof HTMLButtonElement) {
      this.element.type = 'button'
    }
  }

  protected render(): string {
    return getTemplate(AvatarTemplate, {
      imgSrc: this.props.imgSrc
    })
  }
}
