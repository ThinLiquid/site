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
      <div class="inner"><p>so (yet again) the other day, it was around 2am... i was programming on mobile data (cuz my mother unplugged the wifi that night) and i was using <strong>&quot;EE Stay Connected&quot;</strong> (the slowest unlimited data plan everrr). just to make a simple web search on any search engine, it would take around 5 minutes to load the page. so i thought to myself, &quot;why not make a search engine that&#39;s super lightweight and fast?&quot; and that&#39;s how i started making my own &quot;search engine&quot;.</p>
<p>so i started by scraping DuckDuckGo with a library called <code>duck-duck-scrape</code>. i then made a simple html page using <strong>bun</strong> and <strong>elysia&#39;s jsx plugin</strong> (god i love bun) with a search bar and a list of search results. i then added a little bit of css to make it look nice and voilà! i had my own search engine.</p>
<p>i later added an actual main page which was just a heading and input lmao... this is actually a pretty fun project to work on, and would also make a fun started project for anyone who wants to get into web/backend development.</p>
<p>anyways i hope i can update this blog some more.... au revoir :3</p>
</div>
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