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
      <div class="inner"><h1>guestbook</h1>
<iframe src="https://thnlqd.atabook.org" style="width: 100%; height: 20rem; border: none;"></iframe>

<h1>socials</h1>
<p><a href="https://discord.com/users/620492146406981642">
  <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/discord.gif" alt="Discord">
</a><a href="https://github.com/ThinLiquid">
  <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/github.gif" alt="GitHub">
</a><a href="https://www.reddit.com/user/JuiciiYT">
  <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/reddit.gif" alt="Reddit">
</a><a href="https://x.com/thnlqd">
  <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/twitterbutton.gif" alt="X">
</a><a href="https://github.com/ThinLiquid.gpg">
  <img src="https://raw.githubusercontent.com/ThinLiquid/buttons/main/img/pgp-now.gif" alt="PGP">
</a></p>
<p>email: <a href="mailto:thnlqd@gmail.com">thnlqd@gmail.com</a></p>
<h1>webrings</h1>
<noscript>
  <strong>JavaScript is required to view part of this page.</strong>
</noscript>
<yescript>
<div id='nekowebring' style="color: var(--base);">
  <script type="text/javascript" src="https://webring.nekoweb.org/onionring-variables.js"></script>
  <script type="text/javascript" src="https://webring.nekoweb.org/onionring-widget.js"></script>
</div>
<webring-container>
  <config key="type" value="catppuccin-mocha"></config>
  <config key="font" value="Inter, sans-serif"></config>
  <config key="fill" value="true"></config>

  <script src="https://palette.nekoweb.org/webring.js"></script>
</webring-container>
<br/>
<iframe id="bucket-webring" style="width: 100%; height: 3rem; border: none;" src="https://webring.bucketfish.me/embed.html?name=ThinLiquid"></iframe>
</yescript></div>
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