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
      <div class="inner"><!-- prettier-ignore -->
<div style="text-align:center;position:relative;margin: 120px 0;">
  <h1 style="position:relative;z-index:10;font-size: 3em;margin:15px 0;">
    hiya, i'm <span class="letters">
      <span class="letter">t</span>
      <span class="letter">h</span>
      <span class="letter">i</span>
      <span class="letter">n</span>
      <span class="letter">l</span>
      <span class="letter">i</span>
      <span class="letter">q</span>
      <span class="letter">u</span>
      <span class="letter">i</span>
      <span class="letter">d</span>
    </span>.
  </h1>
  <div style="position:relative;z-index:10;">
    <span class="chip">:bust_in_silhouette: he/him</span>
    <span class="chip">:uk: en-GB</span>
    <span class="chip">:computer: developer</span>
  </div>
  <div class="blur"></div>
</div>

<h2>about me</h2>
<p>i&#39;m a 15-year-old dev who does (mostly) frontend projects...
over around 6 years i learnt <del>javascript</del> typescript, and python skills.
i&#39;m also currently learning rust and flutter as of now!</p>
<h2>projects</h2>
<projects-container>
  <project-card onclick="window.open('https://nanomidi.net')" style="--color:var(--red);">
    <h3>nanoMIDI</h3>
    <p>a massive midi repository</p>
  </project-card>

  <project-card onclick="window.open('https://buffer.thinliquid.dev')" style="--color:var(--maroon);">
    <h3>://buffer</h3>
    <p>a web-based spotify client</p>
  </project-card>

  <project-card onclick="window.open('https://untitled.thinliquid.dev')" style="--color:var(--peach);">
    <h3>untitled</h3>
    <p>a minimalist browser on the web</p>
  </project-card>

  <project-card onclick="window.open('https://neko.thinliquid.dev')" style="--color:var(--yellow);">
    <h3>nekoOS</h3>
    <p>an operating system on the web</p>
  </project-card>


  <project-card onclick="window.open('https://deploy.nekoweb.org')" style="--color:var(--green);">
    <h3>deploy2nekoweb</h3>
    <p>an easy way to deploy to nekoweb</p>
  </project-card>

  <project-card onclick="window.open('https://docs.nekoweb.org')" style="--color:var(--teal);">
    <h3>Nekoweb API Docs</h3>
    <p>an unofficial documentation for the nekoweb api</p>
  </project-card>
</projects-container>
<br/>

<h2>add my button(s)</h2>
<p><small>more buttons coming soon!</small></p>
<label for="main">
  <h3>the original.</h3>
</label>
<div style="display:flex;">
  <img class="squishy" src="/thnlqd.png" style="aspect-ratio:88/31;height:31px;" alt="my button!!!" />
  <textarea readonly id="main"  style="height:31px" onclick="this.select()"><a href="https://thinliquid.dev"><img src="https://thinliquid.dev/thnlqd.png" alt="thinliquid's button" /></a></textarea>
</div></div>
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
