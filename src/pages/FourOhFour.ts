import Kitty, { Container, Paragraph } from '@thnlqd/kitty'
import router from '../router'

export const onRender = (): void => {
  document.title = '404 Not Found | thinliquid\'s catppuccin heaven v2'
}

export default Container.render()
  .append(
    Kitty.create('h1')
      .text('404 Not Found')
      .style({ textAlign: 'center', margin: '0' }),
    Paragraph.render()
      .text('The page you are looking for does not exist.')
      .style({ textAlign: 'center', margin: '0' }),
    Kitty.create('button')
      .text('Go Home')
      .on('click', () => router.navigate('/'))
      .style({ display: 'block', margin: '0 auto', marginTop: '10px' })
  )
