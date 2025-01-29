/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai'
import sinon from 'sinon'

import { Block, type BlockProps } from './block'

type TestBlockProps = BlockProps & {
  htmlElement?: keyof HTMLElementTagNameMap
  text?: string
  handleClick?: () => void
  className?: string
  childBlocks?: Record<string, Block<BlockProps>>
}

class TestBlock extends Block<TestBlockProps> {
  constructor(props: TestBlockProps = {}) {
    const { htmlElement, text, handleClick, className, childBlocks } = props

    super(htmlElement ?? 'div', {
      ...props,
      events: handleClick ? { click: handleClick } : {},
      className: className ?? '',
      childBlocks: childBlocks ?? {}
    })

    if (this.element) {
      this.element.textContent = text ?? ''
    }
  }

  getChildBlocks(): Record<string, Block<BlockProps>> {
    return this.childBlocks!
  }

  getChildBlocksList(): Block<BlockProps>[] {
    return this.childBlocksList!
  }

  getEvents(): Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>> {
    return this.events!
  }

  getProps(): TestBlockProps {
    return this.props
  }

  protected render(): string {
    return `
            <div class="test">${this.props.text ?? 'Test text'}</div>
            <div data-block-id="childBlock"></div>
            `
  }
}

describe('Block tests', () => {
  it('should initialize with the correct default tagName and props', () => {
    const testBlock = new TestBlock()

    expect(testBlock).to.be.an.instanceOf(Block)

    const content = testBlock.getContent()
    expect(content).to.be.an.instanceOf(HTMLElement)
    expect(content!.tagName).to.equal('DIV')
    expect(content!.className).to.equal('')

    expect(testBlock.getChildBlocks()).to.deep.equal({})
    expect(testBlock.getChildBlocksList()).to.deep.equal([])
    expect(testBlock.getEvents()).to.deep.equal({})
  })

  it('should create an element with custom props', () => {
    function onClick(): void {
      console.log('hi!')
    }

    const testBlock = new TestBlock({
      htmlElement: 'button',
      text: 'Click me!',
      handleClick: onClick,
      className: 'my-button'
    })

    const content = testBlock.getContent()
    expect(content).to.be.an.instanceOf(HTMLElement)
    expect(content!.tagName).to.equal('BUTTON')
    expect(content!.className).to.equal('my-button')

    expect(testBlock.getChildBlocks()).to.deep.equal({})
    expect(testBlock.getChildBlocksList()).to.deep.equal([])
    expect(testBlock.getEvents()).to.deep.equal({ click: onClick })
  })

  it('should update props and re-render', () => {
    const testBlock = new TestBlock()
    const spy = sinon.spy(testBlock as any, 'render')

    testBlock.setProps<TestBlockProps>({ text: 'new text' })

    expect(spy.calledOnce).to.be.true
    expect(testBlock.getProps().text).to.equal('new text')
  })

  it('should call lifecycle methods during mounting and updating', () => {
    const testBlock = new TestBlock()

    const componentDidMountSpy = sinon.spy(
      testBlock as any,
      'componentDidMount'
    )
    const componentDidUpdateSpy = sinon.spy(
      testBlock as any,
      'componentDidUpdate'
    )

    testBlock.dispatchComponentDidMount()
    expect(componentDidMountSpy.calledOnce).to.be.true

    testBlock.setProps<TestBlockProps>({ text: 'new text' })
    expect(componentDidUpdateSpy.calledOnce).to.be.true
  })

  it('should correctly add and remove event listeners', () => {
    const onClick = sinon.spy()

    const testBlock = new TestBlock({
      htmlElement: 'button',
      handleClick: onClick
    })

    testBlock.getContent()?.click()
    expect(onClick.calledOnce).to.be.true

    testBlock.unmount()
    expect(onClick.calledOnce).to.be.true
  })

  it('should correctly handle child blocks', () => {
    function onClick(): void {
      console.log('hi!')
    }

    const testChildBlock = new TestBlock({
      htmlElement: 'button',
      handleClick: onClick,
      text: 'Click me!'
    })

    const testParrentBlock = new TestBlock({
      childBlocks: { childBlock: testChildBlock }
    })

    expect(testParrentBlock.getChildBlocks()).to.deep.equal({
      childBlock: testChildBlock
    })

    const childBlockContent = testParrentBlock
      .getChildBlocks()
      ['childBlock'].getContent()

    expect(childBlockContent).to.be.an.instanceOf(HTMLElement)
    expect(childBlockContent?.tagName).to.equal('BUTTON')

    expect(
      (testParrentBlock.getChildBlocks()['childBlock'] as TestBlock).getEvents()
    ).to.deep.equal({ click: onClick })
  })

  it('should unmount and clean up properly', () => {
    function onClick(): void {
      console.log('hi!')
    }

    const testBlock = new TestBlock({
      htmlElement: 'button',
      handleClick: onClick
    })

    const unmountSpy = sinon.spy(testBlock as any, 'onUnmount')
    const removeEventsSpy = sinon.spy(testBlock as any, 'removeEvents')

    const content = testBlock.getContent()
    expect(content).to.be.an.instanceOf(HTMLElement)
    expect(content!.tagName).to.equal('BUTTON')
    expect(testBlock.getEvents()).to.deep.equal({ click: onClick })

    testBlock.unmount()

    expect(unmountSpy.calledOnce).to.be.true
    expect(removeEventsSpy.calledOnce).to.be.true

    expect(testBlock.getContent()).to.be.null
    expect(testBlock.getChildBlocks()).to.equal(undefined)
    expect(testBlock.getChildBlocksList()).to.equal(undefined)
    expect(testBlock.getEvents()).to.equal(undefined)
  })
})
