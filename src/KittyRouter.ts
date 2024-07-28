import Kitty, { Container } from '@thnlqd/kitty'

export default class KittyRouter {
  constructor (public routes: Record<string, () => Promise<{
    default: Container
    onRender?: () => any
  }>>, public element: HTMLElement) {
    window.addEventListener('popstate', () => this.render())
    this.render()
  }

  async render (): Promise<void> {
    const path = window.location.pathname
    const route = await (this.routes[path] ?? this.routes['404'])()

    this.element.innerHTML = ''

    route.default.to(this.element)
    route.onRender?.()
  }

  navigate (path: string): void {
    window.history.pushState(null, '', path)
    this.render()
  }
}

export class Link extends Kitty {
  constructor (href: string, router: KittyRouter) {
    super('a', { href })

    this.on('click', (event) => {
      event.preventDefault()
      router.navigate(href)
    })
  }

  static render (href: string, router: KittyRouter): Link {
    return new Link(href, router)
  }
}

export class LinkButton extends Kitty {
  constructor (href: string, router: KittyRouter) {
    super('button', {})

    this.on('click', () => {
      router.navigate(href)
    })
  }

  static render (href: string, router: KittyRouter): LinkButton {
    return new LinkButton(href, router)
  }
}