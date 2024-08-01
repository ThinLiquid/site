import Kitty, { Container } from '@thnlqd/kitty'

let cursor = 0
const KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode === KONAMI_CODE[cursor]) ? cursor + 1 : 0
  if (cursor !== KONAMI_CODE.length) {
    return
  }
  const _ = document.querySelector('html')
  if (_ == null) return
  _.style.filter = 'contrast(200%) brightness(0%)'
  _.style.transition = 'filter 5s'
  setTimeout(() => {
    _.style.filter = ''
    _.style.transition = ''
    _.innerHTML = 'loading...'
    alert('You found the secret! Enjoy the show!')
    const owo = (): void => {
      const iframe = document.createElement('iframe')
      iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
      iframe.style.opacity = '0'
      document.body.appendChild(iframe)
    }
    setTimeout(() => {
      while (true) {
        owo()
      }
    }, 1000)
  }, 5000)
})

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
