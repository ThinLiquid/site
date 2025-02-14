<script lang="ts">
  import { parseBlob, type ICommonTagsResult } from 'music-metadata'

  function shuffle(array: Array<any>) {
    let currentIndex = array.length;
    
    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array
  }

  let songs = shuffle([
    '/assets/music/01 OSINT.flac',
    '/assets/music/01 Namitape; 東北きりたん - マトメステスト.m4a',
    '/assets/music/03 Namitape; 東北きりたん - 終末クロマティック.m4a',
    '/assets/music/09 Feryquitous - Fervidex (full edit).flac'
  ])

  let currentSongIndex = $state(0)
  // svelte-ignore non_reactive_update
  let audio: HTMLAudioElement;
  let input: HTMLInputElement;
  let isPlaying = $state(false)

  let metadata = $state({} as ICommonTagsResult)
  let picture: null | string = $state(null)

  let currentTime = $state(0)

  $effect(() => {
    currentTime = audio.currentTime

    document.addEventListener('astro:page-load', () => {
      if (audio.paused === true) {
        audio.play()
      }
    })
  })

  function playPause() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying = !isPlaying
  }

  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audio.src = songs[currentSongIndex] || '';
    if (!isPlaying) {
      audio.play();
      isPlaying = true
    }
  }

  function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    audio.src = songs[currentSongIndex] || '';
    if (!isPlaying) {
      audio.play();
      isPlaying = true
    }
  }
</script>

<div class="music">
  <audio
    class="audio"
    volume={0.2}
    src={songs[currentSongIndex]}

    oncanplaythrough={async () => {
      const res = await fetch(songs[currentSongIndex] || '')
      const _metadata = await parseBlob(await res.blob())

      console.log(_metadata)
      metadata = _metadata.common

      if (!_metadata.common.picture || !_metadata.common.picture[0])  return
      const _picture = URL.createObjectURL(new Blob([_metadata.common.picture[0].data], { type: _metadata.common.picture[0].format }))
      picture = _picture

      input.max = audio.duration.toString()
    }}
    
    ontimeupdate={async () => {
      currentTime = audio.currentTime;
    }}

    onended={nextSong}
    
    bind:this={audio}
  ></audio>
  <img src={picture} alt={metadata.title} width="100">
  <div>
    <b>{metadata.title}</b><br/>
    <i>{metadata.artist}</i><br/>
    <button onclick={prevSong}>prev</button>
    <button onclick={playPause}>⏯</button>
    <button onclick={nextSong}>next</button>
    <input class="qqq" type="range" bind:value={currentTime} oninput={(e) => {
      audio.currentTime = parseFloat((e.target as HTMLInputElement).value)
    }} bind:this={input}/>
  </div>
</div>

<style>
  .music {
    background: var(--color-base);
    padding: 8px;
    border-bottom: 1px solid var(--color-surface-0);
    display: flex;
    gap: 16px;
    overflow: hidden;

    & > div {
      flex: 1;
    }

    button {
      background: transparent;
      border: 1px solid var(--color-surface-0);
      height: 32px;
      padding: 0 8px;
      color: var(--color-text);
    }
  }

  input {
    width: 100%;
  }

  button {
    margin: 4px;
  }
</style>