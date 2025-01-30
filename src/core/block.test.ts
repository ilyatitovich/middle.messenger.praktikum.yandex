import { expect } from 'chai'
import { createSandbox } from 'sinon'

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
  const sandbox = createSandbox()
  let testBlock: TestBlock

  beforeEach(() => {
    testBlock = new TestBlock()
  })

  afterEach(() => {
    sandbox.restore()
    testBlock.unmount()
  })

  describe('Initialization with default props', () => {
    it('should be an instance of Block', () => {
      expect(testBlock).to.be.an.instanceOf(Block)
    })

    it('should initialize content as an instance of HTMLElement', () => {
      expect(testBlock.getContent()).to.be.an.instanceOf(HTMLElement)
    })

    it('should have a default tagName of DIV', () => {
      expect(testBlock.getContent()!.tagName).to.equal('DIV')
    })

    it('should have an empty default className', () => {
      expect(testBlock.getContent()!.className).to.equal('')
    })

    it('should initialize with no child blocks', () => {
      expect(testBlock.getChildBlocks()).to.deep.equal({})
    })

    it('should initialize with an empty child blocks list', () => {
      expect(testBlock.getChildBlocksList()).to.deep.equal([])
    })

    it('should initialize with no events', () => {
      expect(testBlock.getEvents()).to.deep.equal({})
    })
  })

  describe('Innitialization with custom props', () => {
    function onClick(): void {}

    const testBlock = new TestBlock({
      htmlElement: 'button',
      text: 'Click me!',
      handleClick: onClick,
      className: 'my-button'
    })

    it('should have a tagName of BUTTON', () => {
      expect(testBlock.getContent()!.tagName).to.equal('BUTTON')
    })

    it('should have custom className', () => {
      expect(testBlock.getContent()!.className).to.equal('my-button')
    })

    it('should have an click event listener', () => {
      expect(testBlock.getEvents()).to.deep.equal({ click: onClick })
    })

    it('should have textContent from props', () => {
      expect(testBlock.getContent()!.textContent).to.equal('Click me!')
    })
  })

  it('should update props', () => {
    expect(testBlock.getProps().text).to.equal(undefined)

    testBlock.setProps<TestBlockProps>({ text: 'new text' })

    expect(testBlock.getProps().text).to.equal('new text')
  })

  it('should re-render when props updated', () => {
    const spy = sandbox.spy(testBlock, 'render' as keyof typeof testBlock)

    testBlock.setProps<TestBlockProps>({ text: 'new text' })

    expect(spy.calledOnce).to.equal(true)
  })

  it('should call lifecycle methods during mounting and updating', () => {
    const componentDidMountSpy = sandbox.spy(
      testBlock,
      'componentDidMount' as keyof typeof testBlock
    )
    const componentDidUpdateSpy = sandbox.spy(
      testBlock,
      'componentDidUpdate' as keyof typeof testBlock
    )

    testBlock.dispatchComponentDidMount()
    expect(componentDidMountSpy.calledOnce).to.equal(true)

    testBlock.setProps<TestBlockProps>({ text: 'new text' })
    expect(componentDidUpdateSpy.calledOnce).to.equal(true)
  })

  it('should remove and add event listeners when re-render', () => {
    function onClick(): void {}

    const testBlock = new TestBlock({
      htmlElement: 'button',
      handleClick: onClick
    })

    const removeEventsSpy = sandbox.spy(
      testBlock,
      'removeEvents' as keyof typeof testBlock
    )

    const addEventsSpy = sandbox.spy(
      testBlock,
      'addEvents' as keyof typeof testBlock
    )

    testBlock.setProps<TestBlockProps>({ text: 'new text' })

    expect(removeEventsSpy.calledOnce).to.equal(true)
    expect(addEventsSpy.calledOnce).to.equal(true)
  })

  describe('Correct handling child blocks', () => {
    const onClick = sandbox.spy()

    const testChildBlock = new TestBlock({
      htmlElement: 'button',
      handleClick: onClick,
      text: 'Click me!'
    })

    const testParrentBlock = new TestBlock({
      childBlocks: { childBlock: testChildBlock }
    })

    it('should has child block in childBlocks object', () => {
      expect(testParrentBlock.getChildBlocks()).to.deep.equal({
        childBlock: testChildBlock
      })
    })

    it('should child block content be an instance of HTMLElement', () => {
      expect(
        testParrentBlock.getChildBlocks()['childBlock'].getContent()
      ).to.be.an.instanceOf(HTMLElement)
    })

    it('should child block has a tagNmae of BUTTON', () => {
      expect(
        testParrentBlock.getChildBlocks()['childBlock'].getContent()?.tagName
      ).to.equal('BUTTON')
    })

    it('should child block has a click event listener', () => {
      const childBlock = testParrentBlock.getChildBlocks()[
        'childBlock'
      ] as TestBlock

      expect(childBlock.getEvents()).to.deep.equal({ click: onClick })

      childBlock.getContent()?.click()
      expect(onClick.calledOnce).to.equal(true)
    })
  })

  describe('Unmount', () => {
    let testChildBlock: TestBlock
    let testParrentBlock: TestBlock

    beforeEach(() => {
      testChildBlock = new TestBlock({
        htmlElement: 'button',
        text: 'Click me!'
      })

      testParrentBlock = new TestBlock({
        childBlocks: { childBlock: testChildBlock }
      })
    })

    it('should remove event listeners', () => {
      const removeEventsSpy = sandbox.spy(
        testParrentBlock,
        'removeEvents' as keyof typeof testParrentBlock
      )

      testParrentBlock.unmount()

      expect(removeEventsSpy.calledOnce).to.equal(true)
    })

    it('should call onUnmount()', () => {
      const onUnmountSpy = sandbox.spy(
        testParrentBlock,
        'onUnmount' as keyof typeof testParrentBlock
      )

      testParrentBlock.unmount()

      expect(onUnmountSpy.calledOnce).to.equal(true)
    })

    it('shoult call unmount() on child blocks', () => {
      const childUnmountSpy = sandbox.spy(testChildBlock, 'unmount')

      testParrentBlock.unmount()

      expect(childUnmountSpy.calledOnce).to.equal(true)
    })

    it('should clean up props', () => {
      testParrentBlock.unmount()

      expect(testParrentBlock.getContent()).to.equal(null)
      expect(testParrentBlock.getChildBlocks()).to.equal(undefined)
      expect(testParrentBlock.getChildBlocksList()).to.equal(undefined)
      expect(testParrentBlock.getEvents()).to.equal(undefined)
    })
  })
})
