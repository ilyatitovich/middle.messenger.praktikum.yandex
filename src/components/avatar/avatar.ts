import './avatar.css'

import { Block, type BlockProps } from '@/core'
import { type UserState, userStore } from '@/stores'
import { getTemplate, getFilePath } from '@/utils'

import AvatarTemplate from './avatar.hbs?raw'

export type AvatarProps = BlockProps & {
  imgSrc?: string | null
  handleOpenModal?: () => void
  isEditable?: boolean
}

export class Avatar extends Block<AvatarProps> {
  private imgSrc: string | null | undefined

  constructor(props: AvatarProps = { imgSrc: userStore.get().user?.avatar }) {
    if (props.isEditable) {
      super('button', {
        ...props,
        className: 'profile-avatar__button',
        events: { click: props.handleOpenModal }
      })

      if (this.element instanceof HTMLButtonElement) {
        this.element.type = 'button'
      }
    } else {
      super('div', { ...props, className: 'profile-avatar' })
    }

    this.imgSrc = this.props.imgSrc

    userStore.subscribe(state => {
      const { user } = state as UserState

      if (user) {
        const { avatar } = user

        if (avatar !== this.imgSrc) {
          this.setProps<AvatarProps>({ imgSrc: avatar })
        }
      }
    })
  }

  protected render(): string {
    const imgFullPath = this.props.imgSrc
      ? getFilePath(this.props.imgSrc)
      : 'https://robohash.org/avatar'

    return getTemplate(AvatarTemplate, {
      imgSrc: imgFullPath
    })
  }
}
