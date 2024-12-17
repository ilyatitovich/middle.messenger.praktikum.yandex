import './signup.css'

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
      childBlocks: { form: new SignUpForm() }
    })
  }

  protected render(): string {
    return getTemplate(SignUpTemplate)
  }
}
