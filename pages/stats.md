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
      <div class="inner"><h1>code::stats</h1>
<noscript>
  <strong>JavaScript is required to view this page.</strong>
</noscript>
<yescript>
  <div class="container" style="display: flex;flex-wrap:wrap;gap:10px;"></div>
</yescript>

<script type="module">
  const fetchStats = async () => {
    const res = await fetch('https://codestats.net/api/users/thnlqd')
    const data = await res.json()
    return data
  }

  const getLevelProgress = (xp) => {
    const level = getLevel(xp)
    const current_level_xp = getNextLevelXP(level - 1)
    const next_level_xp = getNextLevelXP(level)

    const have_xp = xp - current_level_xp
    const needed_xp = next_level_xp - current_level_xp

    return Math.round(have_xp / needed_xp * 100)
  }

  const getNextLevelXP = (level) => {
    return Math.pow(Math.ceil((level + 1) / LEVEL_FACTOR), 2)
  }

  const getLevel = (xp) => parseInt(Math.floor(LEVEL_FACTOR * Math.sqrt(xp)))

  const LEVEL_FACTOR = 0.025
  

  const data = await fetchStats()

  const languages = Object.entries(data.languages).sort((a, b) => b[1].xps - a[1].xps)

  for (const [key, value] of languages) {
    const xp = value.xps
    const lang = document.createElement('div')
    lang.style.width = 'calc(50% - 10px)'
    lang.innerHTML = `
      <h3>${key}</h3>
      <b>Level ${getLevel(xp)}</b> (${xp} XP)${value.new_xps > 0 ? ` (+${value.new_xps})` : ''}
      <div style="position:relative;height:20px;margin-top: 5px;">
        <span style="position:absolute;left:50%;top:0px;transform:translateX(-50%);color:rgb(var(--color));z-index:5;mix-blend-mode:difference;">${getLevelProgress(xp)}%</span>
        <progress value="${getLevelProgress(xp)}" max="100" style="width:100%"></progress>
      </div>
    `
    document.querySelector('.container').appendChild(lang)
  }
</script>
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
