import Kitty, { Container } from '@thnlqd/kitty'

export default class KittyRouter {
  constructor (public routes: Record<string, () => Promise<{
    default: Container
    onRender?: () => any
  }>>, public element: HTMLElement) {
    window.addEventListener('popstate', () => {
      this.render().catch(e => console.error(e))
    })
    this.render().catch(e => console.error(e))
  }

  banners = [
    'lucky_star.png',
    'minecraft.png',
    'windows_xp.png',
    'miku.png',
    'tux_bsod.png',
    'cirno.png',
    'tetris.png'
  ]

  async render (): Promise<void> {
    const path = window.location.pathname
    const route = await (this.routes[path] ?? this.routes['404'])()

    this.element.innerHTML = ''

    Kitty.create('div')
      .style({
        borderTop: '8px solid #89b4fa',
        borderImage: 'linear-gradient(45deg, #89b4fa, #74c7ec, #89dceb, #a6e3a1) 1',
        background: `linear-gradient(to bottom, #1e1e2e90, #1e1e2e), url(/banners/${this.banners[Math.floor(Math.random() * this.banners.length)]}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 50%',
        height: '200px',
        width: 'calc(100% + 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0',
        marginLeft: '-16px',
        marginTop: '-16px',
        marginBottom: '16px',
        zIndex: '6969696'
      }).to(this.element)

    route.default.to(this.element)
    route.onRender?.()
  }

  navigate (path: string): void {
    window.history.pushState(null, '', path)
    this.render().catch(e => console.error(e))
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
