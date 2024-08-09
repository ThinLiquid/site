import Kitty, { Anchor, Break, Button, Div, Paragraph } from '../../kitty-ssg'

declare global {
  interface Window {
    env: {
      COMMIT_HASH: string
      COMMIT_DATE: string
    }
  }
}

export const loadStyle = (url: string) => {
  Kitty.create('link')
    .attr('rel', 'stylesheet')
    .attr('href', url)
    .to(document.head)
}

export const onRender = () => {
  loadStyle('https://webring.nekoweb.org/onionring.css')

  if (window.localStorage.getItem('lcd') === "true" || window.localStorage.getItem('lcd') === null) document.body.classList.add('lcd')
  if (window.localStorage.getItem('pixelate') === "true") document.body.classList.add('pixelate')

  commit.html(`~> <a href="https://github.com/ThinLiquid/site/commit/${window.env.COMMIT_HASH}">${(window.env.COMMIT_HASH).slice(0, 7)}</a> (${window.env.COMMIT_DATE})`)

  Button.render()
    .text('<- close')
    .class('toggle-sidebar')
    .on('click', (e) => {
      document.querySelector('.sidebar')?.classList.toggle('open')
      if (document.querySelector('.sidebar')?.classList.contains('open') === true) {
        e.target.innerText = '<- close'
      } else {
        e.target.innerText = '-> open'
      }
    })
    .to(document.body)

  pixelate.attr('checked',  document.body.classList.contains('pixelate') === false ? null : '')
  lcd.attr('checked', document.body.classList.contains('lcd') === false ? null : '')
}

export const commit = Kitty.create('small')
  .style({ display: 'block', marginTop: '10px' })

export const lcd = Kitty.create('input')
  .on('click', (e) => {
    if (e.target.checked) {
      document.body.classList.add('lcd')
      window.localStorage.setItem('lcd', 'true')
    } else {
      document.body.classList.remove('lcd')
      window.localStorage.setItem('lcd', 'false')
    }
  })
  .style({
    height: '20px',
    width: '20px',
  })
  .attr('id', 'lcd')
  .attr('type', 'checkbox')

export const pixelate = Kitty.create('input')
  .on('click', (e) => {
    if (e.target.checked) {
      document.body.classList.add('pixelate')
      window.localStorage.setItem('pixelate', 'true')
    } else {
      document.body.classList.remove('pixelate')
      window.localStorage.setItem('pixelate', 'false')
    }
  })
  .style({
    height: '20px',
    width: '20px',
  })
  .attr('id', 'pixelate')
  .attr('type', 'checkbox')

export default Div.render()
  .class('sidebar')
  .class('open')
  .append(
    Kitty.create('h2')
      .text('thinliquid\'s catppuccin heaven v2'),
    Kitty.create('small')
      .text('the most ultimate site ever!!1!!11!1!'),
    commit,
    Break.render(),
    Div.render()
      .style({ display: 'flex', justifyContent: 'space-between' })
      .append(
        pixelate,
        Kitty.create('label')
          .attr('for', 'pixelate')
          .text('pixelate?'),
      ),
    Div.render()
    .style({ display: 'flex', justifyContent: 'space-between' })
    .append(
      lcd,
      Kitty.create('label')
        .attr('for', 'lcd')
        .text('lcd?'),
    ),


    Kitty.create('h3')
      .text('follow me!'),
    Anchor.render({ href: 'https://nekoweb.org/follow/thnlqd' })
      .class('btn')
      .style({ textAlign: 'center' })
      .text('click me, click me!'),

    Kitty.create('h3')
      .text('navigation'),
    Anchor.render({ href: '/' })
      .class('btn')
      .text('home'),
    Anchor.render({ href: '/buttons-galore' })
      .class('btn')
      .text('buttons galore'),
    Anchor.render({ href: 'https://thnlqd.atabook.org' })
      .class('btn')
      .text('guestbook'),

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
      .text('(c) 2024 ThinLiquid, all rights reserved.')
  )
