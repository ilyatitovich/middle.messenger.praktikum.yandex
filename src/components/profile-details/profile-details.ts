import './profile-details.css'

import { Block, type BlockProps } from '@/core'
import { getTemplate, type User } from '@/utils'

import ProfileDetailsTemplate from './profile-details.hbs?raw'

type ProfileDetailsProps = BlockProps & {
  user: User
}

export class ProfileDetails extends Block<ProfileDetailsProps> {
  constructor(props: ProfileDetailsProps) {
    super('div', props)
  }

  protected render(): string {
    return getTemplate(ProfileDetailsTemplate, {
      user: this.props.user
    })
  }
}
