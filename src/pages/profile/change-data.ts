import { Avatar, type AvatarProps, Modal, Link } from '@/components'
import {
  FileUploadForm,
  ChangeDataForm,
  type ChangeDataFormProps
} from '@/components/forms'
import { userController } from '@/controllers'
import { Block, type BlockProps } from '@/core'
import { type UserState, userStore } from '@/stores'
import { getTemplate } from '@/utils'

import BackLinkIcon from './back-link-icon.hbs?raw'
import ProfileTemplate from './profile.hbs?raw'

type ChangeDataPageProps = BlockProps

export class ChangeDataPage extends Block<ChangeDataPageProps> {
  private avatar: Avatar
  private modal: Modal | null = null
  private changeDataForm: ChangeDataForm

  constructor(props: ChangeDataPageProps = {}) {
    const { user } = userStore.get()

    const avatar = new Avatar({
      imgSrc: user ? user.avatar : null,
      handleOpenModal: () => this.handleOpenModal(),
      isEditable: true
    })

    const changeDataForm = new ChangeDataForm({ user })

    super('div', {
      ...props,
      className: 'profile',
      childBlocks: {
        backLink: new Link({
          to: '/settings',
          className: 'profile-sidebar__back-button',
          icon: BackLinkIcon
        }),
        avatar,
        content: changeDataForm
      }
    })

    this.avatar = avatar
    this.changeDataForm = changeDataForm

    this.storeUnsubscribe = userStore.subscribe(state => {
      const { user } = state as UserState
      if (!user) {
        return
      }
      this.avatar.setProps<AvatarProps>({ imgSrc: user.avatar })
      this.changeDataForm.setProps<ChangeDataFormProps>({ user })
    })
  }

  private handleOpenModal(): void {
    this.modal = new Modal({
      content: new FileUploadForm({
        accept: '.jpeg, .jpg, .png, .gif, .webp',
        handleUploadFile: (file: File) => this.changeAvatar(file),
        handleCancel: () => this.handleCloseModal()
      })
    })

    const modalContent = this.modal.getContent()

    if (modalContent) {
      document.body.append(modalContent)
    }
  }

  private handleCloseModal(): void {
    if (this.modal) {
      this.modal.unmount()
    }
  }

  private async changeAvatar(file: File): Promise<void> {
    const formData = new FormData()
    formData.append('avatar', file)

    await userController.updateAvatar(formData)
    this.handleCloseModal()
  }

  protected render(): string {
    return getTemplate(ProfileTemplate, {
      title: 'Изменить данные'
    })
  }
}
