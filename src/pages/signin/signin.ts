import './signin.css'

import { Link } from '@/components'
import { SignInForm } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import SignInTemplate from './signin.hbs?raw'

type SignInPageProps = BlockProps

export default class SignInPage extends Block<SignInPageProps> {
  constructor(props: SignInPageProps = {}) {
    super('main', {
      ...props,
      className: 'signin',
      childBlocks: {
        form: new SignInForm(),
        signUpLink: new Link({
          to: '/sign-up',
          className: 'user-form__link',
          content: 'Зарегистрироваться'
        })
      }
    })
  }

  protected render(): string {
    return getTemplate(SignInTemplate)
  }
}
