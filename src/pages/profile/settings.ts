import {
  Avatar,
  ProfileDetails,
  type ProfileDetailsProps,
  Link
} from '@/components'
import { Block, type BlockProps } from '@/core'
import { type UserState, userStore } from '@/stores'
import { getTemplate } from '@/utils'

import BackLinkIcon from './back-link-icon.hbs?raw'
import ProfileTemplate from './profile.hbs?raw'

type SettingsPageProps = BlockProps & {
  userName: string
}

export class SettingsPage extends Block<SettingsPageProps> {
  private profileDetails: ProfileDetails

  constructor(
    props: SettingsPageProps = {
      userName: userStore.get().user?.first_name ?? ''
    }
  ) {
    const { user } = userStore.get()

    const avatar = new Avatar()
    const profileDetails = new ProfileDetails({ user })

    super('div', {
      ...props,
      className: 'profile',
      childBlocks: {
        backLink: new Link({
          to: '/messenger',
          className: 'profile-sidebar__back-button',
          icon: BackLinkIcon
        }),
        avatar,
        content: profileDetails
      }
    })

    this.profileDetails = profileDetails

    userStore.subscribe(state => {
      const { user } = state as UserState
      if (!user) {
        return
      }
      this.profileDetails.setProps<ProfileDetailsProps>({ user })
      this.setProps<SettingsPageProps>({ userName: user.first_name })
    })
  }

  protected render(): string {
    return getTemplate(ProfileTemplate, {
      title: this.props.userName
    })
  }
}
