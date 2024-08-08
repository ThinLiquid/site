import Kitty from '../../kitty-ssg'

export default class ProjectCard extends Kitty {
  constructor (title: string, content: string, url: string) {
    super('button', { class: 'card' })

    this.attr('onclick', `window.open('${url}', '_blank')`)

    this.style({
      background: `linear-gradient(45deg, #11111b, #11111baa), url(
        https://api.apiflash.com/v1/urltoimage?access_key=a5ace5d8d4a64ff98876cbee5a99cb32&url=${encodeURIComponent(url)}&format=webp
      )`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      gap: '10px',
      textAlign: 'left'
    })

    this.append(
      Kitty.create('h2')
        .style({ margin: '0' })
        .text(title),
      Kitty.create('p')
        .style({ margin: '0' })
        .text(content)
    )
  }

  static render (title: string, content: string, url: string): ProjectCard {
    return new ProjectCard(title, content, url)
  }
}
