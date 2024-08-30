<meta>
  <title>Home</title>
  <description>super cool home page</description>

  <use-style>/style.scss</use-style>

  <modfile>gemini-bleeps.mod</modfile>
</meta>
---
<!-- prettier-ignore -->
<h1>
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

he/him | gmt+0 | british

## about me

i'm a 15-year-old dev who does (mostly) frontend projects...
over around 6 years i learnt ~~javascript~~ typescript, and python skills.
i'm also currently learning rust and flutter as of now!

## projects

<projects-container>
  <project-card onclick="window.open('https://nanomidi.net')">
    <name>nanoMIDI</name>
    <description>a massive midi repository</description>
  </project-card>

  <project-card onclick="window.open('https://buffer.thinliquid.dev')">
    <name>://buffer</name>
    <description>a spotify client (will be public soon!!)</description>
  </project-card>

  <project-card onclick="window.open('https://untitled.thinliquid.dev')">
    <name>untitled</name>
    <description>a minimalist browser on the web</description>
  </project-card>

  <project-card onclick="window.open('https://neko.thinliquid.dev')">
    <name>nekoOS</name>
    <description>an operating system on the web</description>
  </project-card>
</projects-container>
<br/>

## add my button

<img class="squishy" src="/thnlqd.png" width="100%" style="aspect-ratio:88/31;" alt="my button!!!" />

<label for="copy">made with &lt;3 by me, in the glorious 88x31 size!</label>
<textarea id="copy" readonly style="resize:none;width:100%;" onclick="this.select()"><a href="https://thinliquid.dev"><img src="https://thinliquid.dev/thnlqd.png" alt="thinliquid's button" /></a></textarea>
