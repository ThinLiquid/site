import { KittyAttributes } from '../types'
import Kitty from './Kitty'

export class Container extends Kitty {
  constructor (attrs: Record<string, string> = {}) {
    super('div', attrs)

    this.class('container')
  }

  static render (attrs: KittyAttributes = {}): Container {
    return new Container(attrs)
  }
}

export class Div extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('div', attrs)
  }

  static render (attrs: KittyAttributes = {}): Div {
    return new Div(attrs)
  }
}

export class Break extends Kitty {
  constructor () {
    super('br', {})
  }

  static render (): Break {
    return new Break()
  }
}

export class Paragraph extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('p', attrs)
  }

  static render (attrs: KittyAttributes = {}): Paragraph {
    return new Paragraph(attrs)
  }
}

export class Span extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('span', attrs)
  }

  static render (attrs: KittyAttributes = {}): Span {
    return new Span(attrs)
  }
}

export class Anchor extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('a', attrs)
  }

  static render (attrs: KittyAttributes = {}): Anchor {
    return new Anchor(attrs)
  }
}

export class Button extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('button', attrs)
  }

  static render (attrs: KittyAttributes = {}): Button {
    return new Button(attrs)
  }
}

class BaseInput extends Kitty {
  constructor (tagName: string, attrs: KittyAttributes = {}) {
    super(tagName, attrs)
  }

  value (value: string): this {
    this.element.setAttribute('value', value)
    return this
  }

  placeholder (placeholder: string): this {
    this.element.setAttribute('placeholder', placeholder)
    return this
  }

  readonly (bool: boolean): this {
    this.element.setAttribute('readonly', bool ? '' : null)
    return this
  }

  required (bool: boolean): this {
    this.element.setAttribute('required', bool ? '' : null)
    return this
  }

  disabled (bool: boolean): this {
    this.element.setAttribute('disabled', bool ? '' : null)
    return this
  }

  getValue (): string {
    return (this.element as HTMLInputElement).value
  }
}

export class Input extends BaseInput {
  constructor (attrs: KittyAttributes = {}) {
    super('input', attrs)
  }

  static render (attrs: KittyAttributes = {}): Input {
    return new Input(attrs)
  }
}

export class TextArea extends BaseInput {
  constructor (attrs: KittyAttributes = {}) {
    super('textarea', attrs)
  }

  static render (attrs: KittyAttributes = {}): TextArea {
    return new TextArea(attrs)
  }
}

export class Select extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('select', attrs)
  }

  static render (attrs: KittyAttributes = {}): Select {
    return new Select(attrs)
  }

  option (text: string, value: string): this {
    const option = new Kitty('option', { value }).text(text)
    this.append(option)
    return this
  }

  value(value: string): this {
    this.element.setAttribute('value', value)
    return this
  }

  getValue (): string {
    return (this.element as HTMLSelectElement).value
  }
}

export class Image extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('img', attrs)
  }

  static render (attrs: KittyAttributes = {}): Image {
    return new Image(attrs)
  }
}

export class UnorderedList extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('ul', attrs)
  }

  static render (attrs: KittyAttributes = {}): UnorderedList {
    return new UnorderedList(attrs)
  }
}

export class OrderedList extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('ol', attrs)
  }

  static render (attrs: KittyAttributes = {}): OrderedList {
    return new OrderedList(attrs)
  }
}

export class ListItem extends Kitty {
  constructor (attrs: KittyAttributes = {}) {
    super('li', attrs)
  }

  static render (attrs: KittyAttributes = {}): ListItem {
    return new ListItem(attrs)
  }
}
