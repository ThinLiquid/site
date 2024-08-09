import Kitty, { Break, Container, Div, Paragraph, TextArea } from '../../kitty-ssg'
import ProjectCard from '../components/ProjectCard'

export const quote = Paragraph.render()
  .style({ margin: '0' })

export const quotes = [
  'how to exit vim?!?!?!??!?!??!',
  'how to exit neovim?!?!?!??!?!??!',
  'neko neko neko neko neko neko',
  'is this thing even on?',
  'chronically online is my middle name',
  'i use arch btw',
  'sudo rm -rf /',
  'are ya winning, son?',
  "TypeError: cannot read property 'length' of undefined",
  'all your base are belong to us',
  'i am a cat, am i a cat? i am a cat. i am a cat, am i a cat? i am a cat.',
  'watashi wa nekodesu ka?',
  'hewwo everynyan! how are you? fine, shank you! OH MAI GAHHH!!!!',
  'skibidi dop dop dop yes yes',
  'i am a cat',
  'professional sussy baka',
  'triple baka (yes this is a miku, teto, and neru reference)'
]

export const onRender = (): void => {
  document.title = 'thinliquid\'s catppuccin heaven v2'
  quote.text(quotes[Math.floor(Math.random() * quotes.length)])
}

export default Container.render()
  .append(
    Kitty.create('img')
      .attr('src', '/liquid_alpha.webp')
      .attr('width', '75px')
      .attr('height', '75px')
      .attr('alt', 'thinliquid')
      .class('button')
      .style({
        display: 'block'
      }),
    Kitty.create('h1')
      .text('hiya, i\'m ')
      .append(...Kitty.createLetters('thinliquid', { class: 'letter', style: 'animation: 2s 0.{index}s sine infinite ease-in-out alternate;' }))
      .appendText('.'),
    Break.render(),
    Paragraph.render()
      .style({ margin: '0' })
      .text('he/him | web developer | GMT Timezone'),
    quote,
    Break.render(),

    // ABOUT ME
    Kitty.create('h2')
      .text('about me'),
    Paragraph.render()
      .text('i\'m a 15-year-old dev who does (mostly) frontend projects... over the span of around 6 years i have acquired javascript typescript, and python skills. i\'m also currently learning rust and flutter rn (pretty goated languages icl).'),

    // PROJECTS
    Kitty.create('h2')
      .text('projects'),
    Div.render()
      .style({
        display: 'grid',
        gap: '10px',
        gridTemplateColumns: '1fr 1fr',
        gridAutoRows: '150px'
      })
      .append(
        ProjectCard.render('thinliquid.dev', 'this website!! duh', 'https://thinliquid.dev'),
        ProjectCard.render('untitled', 'a minimalist web browser on the web', 'https://untitled.thinliquid.dev'),
        ProjectCard.render('kitty', 'a simple, lightweight web framework.', 'https://github.com/ThinLiquid/kitty'),
        ProjectCard.render('nanoMIDI', 'a massive midi repository', 'https://nanomidi.net'),
        ProjectCard.render('the dsp project', 'a large list of discord scam domains', 'https://github.com/Discord-AntiScam/scam-links'),
        ProjectCard.render('FlowOS', 'a now discontinued OS for the web', 'https://flow-works.me'),
        ProjectCard.render('://buffer', 'a spotify client (currently private)', 'https://buffer.thinliquid.dev')
      ),

    Break.render(),

    // BUTTON
    Kitty.create('h2')
      .text('like my site? add my button to your site!'),
    Kitty.create('small')
      .text('(in all its 88x31 glory!)'),

    Break.render(),
    Break.render(),

    Kitty.create('img')
      .attr('width', '100%')
      .attr('height', 'auto')
      .style({
        aspectRatio: '88/31',
      })
      .class('button')
      .attr('src', '/thnlqd.png')
      .attr('alt', 'thinliquid\'s site'),

    Kitty.create('label')
      .attr('for', 'button-code')
      .text('copy the code below and paste it into your site!'),
    TextArea.render()
      .style({
        width: '100%',
        height: '60px',
        margin: '10px 0'
      })
      .attr('id', 'button-code')
      .attr('readonly', '')
      .style({ resize: 'none' })
      .text('<a href="https://thinliquid.dev" target="_blank"><img src="https://thinliquid.dev/thnlqd.png" alt="thinliquid\'s site"></a>')
      .on('click', (e) => {
        e.target.select()
      })
  )
