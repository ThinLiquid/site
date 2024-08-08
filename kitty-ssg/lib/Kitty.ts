import 'global-jsdom/register';
import { marked } from 'marked';

class Kitty {
  element: HTMLElement
  uuid: string | null = null

  constructor (tagName: string, attrs: Record<string, string> = {}, uuid?: string) {
    this.element = uuid != null ? document.querySelector(`[data-kitty-id="${uuid}"]`)! : document.createElement(tagName);
    if (uuid == null) {
      (async () => {
        const uuid = window.crypto.getRandomValues(new Uint32Array(4)).join('-');

        this.uuid = uuid;
        // @ts-ignore
        this.element.setAttribute('data-kitty-id', this.uuid);
      })()
    } else {
      this.uuid = uuid;
    }
    for (const key in attrs) {
      this.attr(key, attrs[key]);
    }
  }

  to (parent: HTMLElement | Kitty): this {
    if (parent instanceof Kitty) {
      parent.element.appendChild(this.element)
    } else {
      parent.appendChild(this.element)
    }
    return this
  }

  append (...children: Array<HTMLElement | Kitty>): this {
    children.forEach(child => {
      if (child instanceof Kitty) {
        this.element.appendChild(child.element)
      } else {
        this.element.appendChild(child)
      }
    })
    return this
  }

  appendText (text: string): this {
    this.element.appendChild(document.createTextNode(text))
    return this
  }

  appendMd (markdown: string): this {
    this.element.innerHTML += marked.parseInline(markdown) as string
    return this
  }

  attr (name: string, value: string): this {
    this.element.setAttribute(name, value)
    return this
  }

  text (text: string): this {
    this.element.textContent = text
    return this
  }

  html (html: string): this {
    this.element.innerHTML = html
    return this
  }

  md (markdown: string): this {
    this.element.innerHTML = marked.parseInline(markdown) as string
    return this
  }

  class (className: string): this {
    this.element.classList.add(className)
    return this
  }

  classOff (className: string): this {
    this.element.classList.remove(className)
    return this
  }

  style (style: Partial<CSSStyleDeclaration>): this {
    Object.assign(this.element.style, style)
    return this
  }

  on (event: string, listener: (e: any) => any | EventListenerObject): this {
    this.element.setAttribute(`on${event}`, listener.toString().replace(/\(\) => / , ''))
    this.element.addEventListener(event, listener)
    return this
  }

  static createLetters (letters: string, attrs: Record<string, string> = {}): Kitty[] {
    return letters.split('').map((letter, index) => {
      const attrsClone = { ...attrs }

      for (const key in attrsClone) {
        attrsClone[key] = attrsClone[key].replace(/{index}/g, String(index))
      }

      return Kitty.create('span', attrsClone).text(letter)
    })
  }

  static create (tagName: string, attrs: Record<string, string> = {}): Kitty {
    return new Kitty(tagName, attrs)
  }
}

export default Kitty;
