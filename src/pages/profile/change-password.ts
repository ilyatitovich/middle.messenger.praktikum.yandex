import { Avatar, Link } from '@/components'
import { ChangePasswordForm } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import BackLinkIcon from './back-link-icon.hbs?raw'
import ProfileTemplate from './profile.hbs?raw'

type ChangePasswordPageProps = BlockProps

export class ChangePasswordPage extends Block<ChangePasswordPageProps> {
  constructor(props: ChangePasswordPageProps = {}) {
    super('div', {
      ...props,
      className: 'profile',
      childBlocks: {
        backLink: new Link({
          to: '/settings',
          className: 'profile-sidebar__back-button',
          icon: BackLinkIcon
        }),
        avatar: new Avatar(),
        content: new ChangePasswordForm()
      }
    })
  }

  protected render(): string {
    return getTemplate(ProfileTemplate, { title: 'Изменить пароль' })
  }
}
