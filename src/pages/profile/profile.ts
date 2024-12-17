import './profile.css'

import { Avatar, Modal, ProfileDetails } from '@/components'
import {
  ChangeDataForm,
  ChangePasswordForm,
  FileUploadForm
} from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate, mockUser, type User } from '@/utils'

import ProfileTemplate from './profile.hbs?raw'

type ProfilePageProps = BlockProps & {
  route: string
  user: User
}

export default class ProfilePage extends Block<ProfilePageProps> {
  private modal: Modal

  constructor(
    props: ProfilePageProps = {
      route: window.location.pathname,
      user: mockUser
    }
  ) {
    const avatar = new Avatar({
      imgSrc: mockUser.avatar,
      handleOpenModal: () => this.handleOpenModal()
    })

    const modal = new Modal({
      content: new FileUploadForm({
        handleUploadFile: (file: File) => this.changeAvatar(file),
        handleCancel: () => this.handleCloseModal()
      })
    })

    let content: Block

    const childBlocks: Record<string, Block> = { avatar, modal }

    if (props.route === '/profile/change-password') {
      content = new ChangePasswordForm()
    } else if (props.route === '/profile/change-data') {
      content = new ChangeDataForm({ user: mockUser })
    } else {
      content = new ProfileDetails({ user: props.user })
    }

    childBlocks['profileContent'] = content

    super('div', { ...props, className: 'profile', childBlocks })

    this.modal = modal
    this.modal.hide()
  }

  private getHeading(): string {
    switch (this.props.route) {
      case '/profile/change-data':
        return 'Изменить данные'
      case '/profile/change-password':
        return 'Изменить пароль'
      default:
        return (this.props.user as User).display_name
    }
  }

  private handleOpenModal(): void {
    this.modal.show()
  }

  private handleCloseModal(): void {
    this.modal.hide()
  }

  private changeAvatar(file: File): void {
    console.table({ avatar: file })
  }

  protected render(): string {
    return getTemplate(ProfileTemplate, {
      backButtonLabel:
        this.props.route === '/profile' ? 'Назад к чатам' : 'Назад к профилю',
      backButtonUrl: this.props.route === '/profile' ? '/chat' : '/profile',
      heading: this.getHeading()
    })
  }
}
