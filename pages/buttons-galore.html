<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- im just sigma like that -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>{{ title }}thinliquid's catppuccin heaven</title>
    <meta name="theme-color" content="{{ color }}" />
    <meta name="description" content="{{ description }}" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />

    <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>

    {{ external-styles }}

    <!-- prettier-ignore -->
    <style>
      :root{--color:var(--| color-name |);--color2:var(--| color2-name |)}
      /* styles */
    </style>
    <noscript><style>yescript{
      display:none!important;
    }</style></noscript>
  </head>
  <body>
    <noscript style="padding: 10px;text-align: center;">
      <b>heads up! looks like you have JavaScript disabled... some parts of the site will be unavaliable to you.</b>
    </noscript>
    <nav>
      <div class="inner">
        <div style="max-width: 490px;">
          <a href="/" class="no-style">
            <h1 style="margin:0;font-size:3em;">thnlqd</h1>
          </a><code style="font-size:15px;">v{{ version }}</code>
          <br/>
          <small><a href="https://github.com/ThinLiquid/site/commit/{{ commit-hash }}">{{ commit-hash-short }}</a> - {{ commit-message }}</small>
          <br/>
          <small>{{ commit-date }}</small>
          <br/><br/>
          <yescript>
            <button onclick="toggleCharacter()">
              character and personality
            </button>
            <button onclick="toggleMonospace()">
              monospace mode
            </button>
            <button onclick="toggleNormal()">
              normal
            </button>
          </yescript>
        </div>
        <div class="nav">
          {{ navigation }}
          <br/>
        </div>
      </div>
      <script>
        document.body.setAttribute('class', window.localStorage.getItem("theme") || '');

        function toggleCharacter() {
          document.body.setAttribute('class', 'personality');
          window.localStorage.setItem("theme", 'personality');
        }

        function toggleMonospace() {
          document.body.setAttribute('class', 'monospace');
          window.localStorage.setItem("theme", 'monospace');
        }

        function toggleNormal() {
          document.body.setAttribute('class', '');
          window.localStorage.setItem("theme", '');
        }
      </script>
    </nav>
    <div class="tooltip"><noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" height="0" width="0" referrerpolicy="no-referrer-when-downgrade" /></noscript></div>
    <div id="content">
      <div class="inner"><h1>buttons galore!!!</h1>
<p>my personal collection of 88x31 buttons (that you can contribute to), all in one place!</p>
<noscript>
  <strong>JavaScript is required to view this page.</strong>
</noscript>
<yescript>
<input type="text" id="search" placeholder="search for a button..." />

<div class="options">
  <select id="categories">
    <option>All Categories</option>
  </select>
  <label for="sort"></label>
  <select id="sort">
    <option>Alphabetical</option>
    <option>Order</option>
  </select>
  <select id="creators">
    <option>All Creators</option>
  </select>
</div>

<div class="buttons"></div>
</yescript>

<script>
  const BUTTON_FILE = 'https://raw.githubusercontent.com/ThinLiquid/buttons/main/index.buttonfile'
  const BUTTON_DIRECTORY = 'https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/'

  const fetchButtons = async () => {
    const res = await fetch(`${BUTTON_FILE}`, { cache: 'no-store', heders: { 'Cache-Control': 'no-store' } })
    const data = await res.text()
    const entries = data.split('\n').map((entry, index) => {
      const [categories, tags, filename, description, creator] = entry.split(' | ')
      try {
        return { categories: categories.split(','), tags: tags.split(' '), filename, description, creator: creator || 'N/A' }
      } catch {
        console.error('Error: malformed content\n ->', JSON.stringify(entry), 'at line', index)
        return null
      }
    }).filter(entry => entry !== null)

    return entries
  }

  (async () => {
    const buttons = await fetchButtons()
    const categories = [...new Set(buttons.flatMap(button => button.categories))]
    const creators = [...new Set(buttons.map(button => button.creator))]

    const buttonsContainer = document.querySelector('.buttons')
    const search = document.getElementById('search')
    const categoriesSelect = document.getElementById('categories')
    const sortSelect = document.getElementById('sort')
    const creatorsSelect = document.getElementById('creators')

    categories.forEach(category => {
      const option = document.createElement('option')
      option.innerText = category
      categoriesSelect.appendChild(option)
    })

    creators.forEach(creator => {
      const option = document.createElement('option')
      option.innerText = creator
      creatorsSelect.appendChild(option)
    })

    const renderButtons = async () => {
      buttonsContainer.innerHTML = ''

      const filteredButtons = buttons.filter(button => {
        const category = categoriesSelect.value
        const creator = creatorsSelect.value
        const searchValue = search.value.toLowerCase()

        return (
          (category === 'All Categories' || button.categories.includes(category)) &&
          (creator === 'All Creators' || button.creator === creator) &&
          (button.description.toLowerCase().includes(searchValue) || button.tags.some(tag => tag.includes(searchValue)))
        )
      })

      let i = 0;
      for (const button of filteredButtons) {
        const buttonElement = document.createElement('img')
  
        buttonElement.src = `${BUTTON_DIRECTORY}${button.filename}`
        buttonElement.alt = button.description
        buttonElement.width = 88
        buttonElement.height = 31

        buttonElement.addEventListener('mouseover', () => {
          const tooltip = document.querySelector('.tooltip')
          tooltip.innerHTML = `
            <strong>${button.description}</strong><br />
            Categories: ${button.categories.join(', ')}<br />
            Tags: ${button.tags.join(', ')}<br />
            Creator: ${button.creator}
          `
          tooltip.style.opacity = 1
        })

        buttonElement.addEventListener('mouseout', () => {
          const tooltip = document.querySelector('.tooltip')
          tooltip.style.opacity = 0
        })

        buttonElement.classList.add('squishy')

        buttonElement.style.animationDelay = `${i * 15}ms`

        buttonsContainer.appendChild(buttonElement)

        setTimeout(() => {
          buttonElement.style.opacity = 1
          buttonElement.style.animation = null
        }, 15 * i + 150)
        i++
      }
    }

    renderButtons()

    search.addEventListener('input', renderButtons)
    categoriesSelect.addEventListener('change', renderButtons)
    creatorsSelect.addEventListener('change', renderButtons)
  })()

  const tooltip = document.querySelector('.tooltip')

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    tooltip.style.left = `${mouseX + 10}px`; // Offset to prevent cursor overlap
    tooltip.style.top = `${mouseY + 10}px`;
  });
</script></div>
    </div>
    <footer>
      <div class="inner">
        <div>
          <h4 style="margin: 0;">&copy; 2023-2024 ThinLiquid</h4>
          <p style="margin: 0;">powered by bun | hosted on nekoweb</p>
          <br/>
          <a href="https://thinliquid.dev"><img src="https://thinliquid.dev/thnlqd.png" alt="thinliquid's button" /></a>
          <a href="https://nekoweb.org"><img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/nekoweb12.gif" alt="nekoweb.org"></a>
          <a href="https://archlinux.org"><img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/archlinux.gif" href="i use arch btw"></a>
          <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/handcoded.gif" alt="completely hand-coded!">
          <br/><br/>
          <p style="margin: 0;">last commit hash: <code style="user-select: all;">{{ commit-hash }}</code></p>
        </div>
      </div>
    </footer>
  </body>
</html>
