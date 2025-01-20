import './profile-details.css'

import { Button, Link } from '@/components'
import { authController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import type { User } from '@/stores'
import { getTemplate } from '@/utils'

import ProfileDetailsTemplate from './profile-details.hbs?raw'

export type ProfileDetailsProps = BlockProps & {
  user: User | null
}

export class ProfileDetails extends Block<ProfileDetailsProps> {
  constructor(props: ProfileDetailsProps) {
    const changeDataLink = new Link({
      to: '/settings/change-data',
      className: 'profile__action',
      content: 'Изменить данные'
    })

    const changePasswordLink = new Link({
      to: '/settings/change-password',
      className: 'profile__action',
      content: 'Изменить пароль'
    })

    const logoutButton = new Button({
      events: {
        click: () => {
          authController.logout()
        }
      },
      className: 'profile__action is-danger',
      label: 'Выйти'
    })
    super('div', {
      ...props,
      childBlocks: { changeDataLink, changePasswordLink, logoutButton }
    })
  }

  protected render(): string {
    return getTemplate(ProfileDetailsTemplate, {
      user: this.props.user
    })
  }
}
