---
title: Home
description: super cool home page
color: blue

styles:
  - /style.css
---

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
      <span>.</span>
    </span>
  </h1>
  <div style="position:relative;z-index:10;">
    <span class="chip">:bust_in_silhouette: he/him</span>
    <span class="chip">:uk: en-GB</span>
    <span class="chip">:computer: developer</span>
  </div>
  <div class="blur"></div>
</div>

## about me

i'm a 15-year-old dev who does (mostly) frontend projects...
over around 6 years i learnt ~~javascript~~ typescript, and python skills.
i'm also currently learning rust and flutter as of now!

## projects

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

## add my button(s)
<small>more buttons coming soon!</small>

<label for="main">
  <h3>the original.</h3>
</label>
<div style="display:flex;">
  <img class="squishy" src="/thnlqd.png" style="aspect-ratio:88/31;height:31px;" alt="my button!!!" />
  <textarea readonly id="main"  style="height:31px" onclick="this.select()"><a href="https://thinliquid.dev"><img src="https://thinliquid.dev/thnlqd.png" alt="thinliquid's button" /></a></textarea>
</div>