import Kitty from '@thnlqd/kitty'

export default class ProjectCard extends Kitty {
  constructor (title: string, content: string, url: string) {
    super('button', { class: 'card' })

    this.attr('onclick', `window.open('${url}', '_blank')`)

    this.style({
      background: `linear-gradient(45deg, #11111b, #11111baa), url(
        https://api.screenshotone.com/take?access_key=WlIvVX3v-TJddw&url=${encodeURIComponent(url)}&full_page=false&viewport_width=1920&viewport_height=1080&device_scale_factor=1&format=webp&image_quality=80&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&cache=true&cache_ttl=14400&delay=5&timeout=60
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
