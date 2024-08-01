import './style.scss'

import Kitty, { Break, Button, Div, Paragraph } from '@thnlqd/kitty'
import KittyRouter, { LinkButton } from './KittyRouter'

const loadStyle = (url: string): void => {
  Kitty.create('link')
    .attr('rel', 'stylesheet')
    .attr('href', url)
    .to(document.head)
}

const loadScript = (url: string, onload: () => any): void => {
  Kitty.create('script')
    .attr('defer', '')
    .attr('src', url)
    .on('load', () => {
      setTimeout(onload, 1000)
    })
    .to(document.head)
}

loadStyle('https://webring.nekoweb.org/onionring.css')

const router: KittyRouter = new KittyRouter({
  '/': async () => await import('./pages/Home'),
  '/buttons-galore': async () => await import('./pages/ButtonsGalore'),
  404: async () => await import('./pages/FourOhFour')
}, document.querySelector('#app') as HTMLElement)

const toggleSidebar = Button.render()
  .text('<- close')
  .class('toggle-sidebar')
  .on('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('open')
    if (document.querySelector('.sidebar')?.classList.contains('open') === true) {
      toggleSidebar.text('<- close')
    } else {
      toggleSidebar.text('-> open')
    }
  })
  .to(document.body)

Div.render()
  .class('sidebar')
  .class('open')
  .append(
    Kitty.create('h2')
      .text('thinliquid\'s catppuccin heaven v2'),
    Kitty.create('small')
      .text('the most ultimate site ever!!1!!11!1!'),
    Kitty.create('small')
      .style({ display: 'block', marginTop: '10px' })
      .md(`~> [${(import.meta.env.VITE_COMMIT_HASH as string).slice(0, 7)}](https://github.com/ThinLiquid/site/commit/${import.meta.env.VITE_COMMIT_HASH as string}) (${import.meta.env.VITE_COMMIT_DATE as string})`),
    Break.render(),

    Kitty.create('h3')
      .text('follow me!'),
    Button.render()
      .style({ textAlign: 'center' })
      .text('click me, click me!')
      .on('click', () => {
        window.open('https://nekoweb.org/follow/thnlqd')
      }),

    Kitty.create('h3')
      .text('navigation'),
    LinkButton.render('/', router)
      .text('home'),
    LinkButton.render('/buttons-galore', router)
      .text('buttons galore'),
    Button.render()
      .text('guestbook')
      .on('click', () => {
        window.open('https://thnlqd.atabook.org')
      }),

    Kitty.create('h3')
      .text('listen 2 music!'),
    Kitty.create('div')
      .attr('id', 'player'),

    Kitty.create('h3')
      .text('webrings'),
    Kitty.create('webring-container')
      .attr('id', 'nekowebring')
      .append(
        Kitty.create('script')
          .attr('src', 'https://webring.nekoweb.org/onionring-variables.js'),
        Kitty.create('script')
          .attr('data-nekowebring-widget', '')
          .attr('src', 'https://webring.nekoweb.org/onionring-widget.js')
          .attr('color', 'blue')
      ),
    Kitty.create('webring-container')
      .append(
        Kitty.create('config').attr('key', 'type').attr('value', 'catppuccin'),
        Kitty.create('config').attr('key', 'font').attr('value', '\'IosevkaTerm\', JetBrains Mono, Menlo, monospace'),
        Kitty.create('config').attr('key', 'fill').attr('value', 'true'),
        Kitty.create('script')
          .attr('src', 'https://palette.nekoweb.org/webring.js')
      ),

    Div.render()
      .style({ flex: '1' }),
    Paragraph.render()
      .style({ textAlign: 'center' })
      .md('(c) 2024 ThinLiquid, all rights reserved.')
  )
  .to(document.body)

export default router

loadScript('https://youtube.com/iframe_api', () => {
  console.log('youtube api loaded')

  const player = new (window as any).YT.Player('player', {
    width: '100%',
    height: '175',
    playerVars: {
      modestbranding: 1
    },
    events: {
      onReady: () => {
        player.loadPlaylist({
          listType: 'playlist',
          list: 'PL-16WUz-giDvrLJDNEw8Zcq9QGTmeQgAM'
        })
      },
      onStateChange: (event: any) => {
        if (event.data === -1) {
          player.setShuffle(true)
        }
      }
    }
  })
})
