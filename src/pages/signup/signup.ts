import './signup.css'

import { Link } from '@/components'
import { SignUpForm } from '@/components/forms'
import { Block, type BlockProps } from '@/core'
import { getTemplate } from '@/utils'

import SignUpTemplate from './signup.hbs?raw'

type SignUpPageProps = BlockProps

export default class SignUpPage extends Block<SignUpPageProps> {
  constructor(props: SignUpPageProps = {}) {
    super('main', {
      ...props,
      className: 'signup',
      childBlocks: {
        form: new SignUpForm(),
        signInLink: new Link({
          to: '/',
          className: 'user-form__link',
          content: 'Войти'
        })
      }
    })
  }

  protected render(): string {
    return getTemplate(SignUpTemplate)
  }
}
