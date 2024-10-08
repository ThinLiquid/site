---
title: Buttons Galore
description: a massive database of 88x31 buttons!
color: yellow

styles:
  - /style.css
  - /styles/buttons-galore.css
---

# buttons galore!!!
my personal collection of 88x31 buttons (that you can contribute to), all in one place!
github repo [> here <](https://github.com/ThinLiquid/buttons)

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
    <option value="alphabetical">Alphabetical</option>
    <option value="alphabetical-reverse">Alphabetical (Reverse)</option>
    <option value="order">Order</option>
    <option value="order-reverse">Order (Reverse)</option>
    <option value="random">Random</option>
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

      const sortOption = sortSelect.value
      if (sortOption === 'alphabetical') {
        filteredButtons.sort((a, b) => a.description.localeCompare(b.description))
      } else if (sortOption === 'order') {
        // Assuming 'order' means the original order from the file
        // No need to sort as filteredButtons already maintains the original order
      } else if (sortOption === 'random') {
        filteredButtons.sort(() => Math.random() - 0.5)
      } else if (sortOption === 'alphabetical-reverse') {
        filteredButtons.sort((a, b) => b.description.localeCompare(a.description))
      } else if (sortOption === 'order-reverse') {
        filteredButtons.reverse()
      }

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
    sortSelect.addEventListener('change', renderButtons)
  })()

  const tooltip = document.querySelector('.tooltip')

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX + window.scrollX;
    const mouseY = e.clientY + window.scrollY;
    
    tooltip.style.left = `${mouseX + 10}px`; // Offset to prevent cursor overlap
    tooltip.style.top = `${mouseY + 10}px`;
  });
</script>