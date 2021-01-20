# visualizer.gx.ag

music visualizer

## how to use

go to visualize.gx.ag and append the youtube id to the end, like so:

```
https://visualizer.gx.ag/?v=DLzxrzFCyOs
```

## how does it work

it downloads the youtube video using [ytmp3.gx.ag](https://github.com/gx-ag/ytmp3) then uses three.js to play the audio and the [audio analyser](https://threejs.org/docs/#api/en/audio/AudioAnalyser) to bounce with the waveform

## why not use angular / vue / react / svelte to simplify the code

i originally used svelte but felt the overhead wasnt necessary

## you thought svelte was too much overhead but include all of three.js?

yeah