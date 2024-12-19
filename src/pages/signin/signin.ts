import './signin.css'

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
      childBlocks: { form: new SignInForm() }
    })
  }

  protected render(): string {
    return getTemplate(SignInTemplate)
  }
}
