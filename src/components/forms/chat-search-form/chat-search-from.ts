import { Input } from '@/components'
import { Block, type BlockProps } from '@/core'

type ChatSearchFormProps = BlockProps & {
  handleSearch: (e: Event) => void
}

export class ChatSearchForm extends Block {
  constructor(props: ChatSearchFormProps) {
    const input = new Input({
      type: 'search',
      name: 'search',
      placeholder: 'Найти чат',
      events: { input: props.handleSearch }
    })

    super('form', {
      ...props,
      childBlocksList: [input],
      events: { submit: e => e.preventDefault() }
    })
  }
}
