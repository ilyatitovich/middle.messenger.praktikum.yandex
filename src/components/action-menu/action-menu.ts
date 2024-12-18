import './action-menu.css'

import { Block, type BlockProps } from '@/core'

type ActionMenuProps = BlockProps

export class ActionMenu extends Block<ActionMenuProps> {
  constructor(props: ActionMenuProps) {
    super('div', props)
  }
}
