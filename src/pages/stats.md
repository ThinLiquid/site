<meta>
  <title>Code::Stats</title>
  <description>my code::stats progress</description>
  <color>lavender</color>

  <use-style>/style.scss</use-style>
</meta>
---

# code::stats

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
      <b>Level ${getLevel(xp)}</b> (${xp} XP)${value.get_xps > 0 ? ` (+${value.get_xps})` : ''}
      <div style="position:relative;height:20px;margin-top: 5px;">
        <span style="position:absolute;left:50%;top:0px;transform:translateX(-50%);color:rgb(var(--color));z-index:5;mix-blend-mode:difference;">${getLevelProgress(xp)}%</span>
        <progress value="${getLevelProgress(xp)}" max="100" style="width:100%"></progress>
      </div>
    `
    document.querySelector('.container').appendChild(lang)
  }
</script>
