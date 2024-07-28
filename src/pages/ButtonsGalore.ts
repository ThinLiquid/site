import '../styles/pages/buttons-galore.scss'
import Kitty, { Break, Container, Div, Image, Input, Select } from "@thnlqd/kitty";

interface IButton {
  categories: string[],
  tags: string[],
  src: string,
  tooltip: string,
  author: string
}

let buttonsData: Array<IButton | null> = [];
let categoriesData = [];
const buttonsPerPage = 100;
let currentPage = 1;

const fetchCategories = async () => {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/ThinLiquid/buttons/main/categories.categoryfile?t=${Date.now()}`);
        if (response.ok) {
            const data = await response.text();
            categoriesData = data.trim().split(', ');
            
            categoriesData.forEach((category) => {
              Kitty.create('option')
                .text(category)
                .attr('value', category.toLowerCase())
                .to(categorizeElement);
          });
        } else {
            console.error('Failed to fetch categories:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}


const fetchButtons = async () => {
  try {
      const response = await fetch(`https://raw.githubusercontent.com/ThinLiquid/buttons/main/index.buttonfile?t=${Date.now()}`);
      if (response.ok) {
          const data = await response.text();
          buttonsData = data
              .trim()
              .split('\n')
              .map((entry, index) => {
                  const data = entry.split(' | ');
                  const author = data[4] || 'N/A';
              
                  if (data.length >= 4) {
                      return {
                          categories: data[0].split(','),
                          tags: data[1].split(' '),
                          src: data[2],
                          tooltip: data[3],
                          author
                      };
                  } else {
                      console.error(`Malformed entry at line ${index + 1}`, data);
                      return null;
                  }
              })
              .filter(button => button !== null);
          sortAndDisplayButtons(buttonsData as IButton[]);
      } else {
          console.error('Failed to fetch buttons:', response.statusText);
      }
  } catch (error) {
      console.error('Error fetching buttons:', error);
  }
};

const displayButtons = (buttons: IButton[]) => {
  buttonsContainer.text('')

  const startIndex = (currentPage - 1) * buttonsPerPage;
  const endIndex = startIndex + buttonsPerPage;
  const buttonsToShow = buttons.slice(startIndex, endIndex);

  buttonsToShow.forEach((btn, index) => {
      const imgSrc = `https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/${btn.src}`;

      const tooltipContainer = Kitty.create('div')
        .class('tooltip-container')
        .style({ animationDelay: `${15 * index}ms` })
      
      setTimeout(() => {
        tooltipContainer.style({
          opacity: '1',
          animation: 'unset'
        })
      }, 15 * index + 200)

      Image.render()
        .attr('src', imgSrc)
        .attr('alt', btn?.tooltip || 'undefined')
        .style({ width: '88px', height: '31px' })
        .class('button-img')
        .class('button')
        .on('error', () => {
          console.error(`Image failed to load: ${imgSrc}`);
        })
        .to(tooltipContainer)

      Kitty.create('span')
        .class('tooltip-text')
        .appendText(btn?.tooltip || 'undefined')
        .append(
          Break.render(),
          Kitty.create('small')
            .style({ fontSize: '10px' })
            .text(`(${btn?.categories.join(', ')})`),
          Break.render(),
          Kitty.create('small')
            .text(`by ${btn?.author}`)
        )
        .to(tooltipContainer)

      tooltipContainer.to(buttonsContainer)
  });

  renderPagination(buttons);
};

const renderPagination = (buttons: IButton[]) => {
  const totalPages = Math.ceil(buttons.length / buttonsPerPage);

  paginationContainer.text('')

  if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = Kitty.create('button')
          .text(i.toString())
          .class('page-btn')
          .on('click', () => {
            currentPage = i;
            filterAndSortButtons();
          })
          .to(paginationContainer)

        if (i === currentPage) {
          pageButton.class('active')
        }
      }
  }
};

const filterAndSortButtons = () => {
  const selectedCategory = categorizeElement.getValue() || '';
  const searchQuery = searchElement.getValue().toLowerCase();
  const searchTags = searchQuery.split(' ').filter(tag => tag !== '');

  const filteredButtons = buttonsData.filter(button => {
      const matchesCategory = selectedCategory === '' || button?.categories.includes(selectedCategory);
      const matchesSearch = searchTags.every(query => button?.tags.some(tag => tag.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
  }) as IButton[];

  sortAndDisplayButtons(filteredButtons);
};


const sortAndDisplayButtons = (buttons: IButton[]) => {
  const sortOrder = sortElement.getValue() || 'alphabetical';

  buttons.sort((a: IButton, b: IButton) => {
      const tooltipA = a.tooltip.toLowerCase();
      const tooltipB = b.tooltip.toLowerCase();

      return sortOrder === 'alphabetical' ? tooltipA.localeCompare(tooltipB) : tooltipB.localeCompare(tooltipA);
  });

  displayButtons(buttons);
};

const searchElement = Input.render()
  .style({ flex: '1' })
  .placeholder('Search by tags')
  .on('input', filterAndSortButtons)

const categorizeElement = Select.render()
  .option('All Categories', '')
  .on('change', filterAndSortButtons)

const sortElement = Select.render()
  .option('Alphabetical', 'alphabetical')
  .option('Alphabetical (Reversed)', 'alphabetical-reversed')
  .on('change', () => {
    sortAndDisplayButtons(buttonsData as IButton[]);
  })

const buttonsContainer = Div.render()
  .class('buttons-container')
const paginationContainer = Div.render()

fetchButtons()
fetchCategories()

export const onRender = () => {
  document.title = 'buttons galore | thinliquid\'s catppuccin heaven v2'
}

export default Container.render()
  .append(
    Kitty.create('h1')
      .text('buttons galore'),

    Kitty.create('p')
      .md(' add buttons or make a change by making a pull request ---> [here](https://github.com/ThinLiquid/buttons)'),
      Div.render()
      .style({ display: 'flex', gap: '5px' })
      .append(
        searchElement,
        categorizeElement,
        sortElement
      ),

    Break.render(),
    
    buttonsContainer
  )