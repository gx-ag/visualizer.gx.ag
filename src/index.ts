import { ytmp3 } from './ytmp3';
import { getTextureColors } from './colors';
import { Jam } from './jam';
import { Spec } from './spec';
import CanAutoplay from 'can-autoplay';
import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  Texture,
  TextureLoader,
} from 'three';
import * as dom from './dom';

const randomVideos = [
  /* 28 Days Later - SYN */                                 'jDigbTQ7xAM',
  /* Exile (Modestep Remix) - Enya */                       'hH-v6d4eOhw',
  /* FALLING - MONXX */                                     'qBvft8J5xxs',
  /* First Snow - Kerusu */                                 'LHODkrToLM8',
  /* Guided Rhythm - Tantrum Desire */                      'SJ_RATsYJP0',
  /* I Said Meow - Azazal & Said */                         'Byuhn6hkJbM',
  /* Idols (EDM Mashup) - Virtual Riot */                   'nEt1bKGlCpM',
  /* Just Imagine - Tsunamii */                             'J-k2JaGsL_I',
  /* Kitty - Snails House */                                '1EHfNGxy4R8',
  /* Left Behind - Rameses B */                             'q3JrfYEWaUI',
  /* Like U Say - Futuristik*/                              '3XRBnuRF2_U',
  /* Moneko - Geoxor */                                     'RQV96Bxsxsw',
  /* Moonlight - Rameses B */                               '_ILsdcs__ME',
  /* Morph - Snails House */                                'EfuFyKrjCSo',
  /* Neon Eyes - Geoxor */                                  'BqDH7GT_PTc',
  /* Pegasus - Muzzy */                                     'fGryXdWP3oI',
  /* Plastic Pop (I Miss You) - Mordi */                    'T-zqFEo0anA',
  /* Pneumatic Tokyo - EnV */                               '2sW08zLO8S8',
  /* Rainbow Camellia - Sensitive Heart */                  'T-Ob4hlZRkY',
  /* Setsuna (Kirara Magic Remix) - Xomu & Justin Klyvis */ 'zUnGbQubAcA',
  /* The City - Madeon */                                   'gEABPD4wNCg',
];

const urlParams = new URLSearchParams(window.location.search);
const video = urlParams.get('v') || randomVideos[Math.floor(Math.random() * randomVideos.length)];
if (video === 'HAIDqt2aUek' || video === 'W2TE0DjdNqI') {
  document.getElementById('credits')!.innerText += '【=◈˰◈=】';
}

type Image = any;

function getImageDataURL(image: Image): string {
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let context = canvas.getContext('2d')!;
  context.drawImage(image, 0, 0);
  return canvas.toDataURL();
}

(async() => {
  const specs: Spec[] = [];
  for (let i = 0; i < 50; ++i) {
    specs.push(new Spec(i % 15));
  }

  const listener = new AudioListener();
  const loader = new AudioLoader();
  const audio = new Audio(listener);

  const mp3 = ytmp3(video, (progress) => {
    dom.setLoadingText('grabbing video');
    dom.setLoadingPercent(progress)
  });
  const buffer = await loader.loadAsync(mp3.url, (event) => {
    dom.setLoadingText('fetching tunes');
    dom.setLoadingPercent(event.loaded / event.total);
  });
  audio.setBuffer(buffer);

  dom.setLoadingText('decorating');
  const textureLoader = new TextureLoader();
  const texture: Texture = await textureLoader.loadAsync(mp3.thumb, event => {
    dom.setLoadingPercent(event.loaded / event.total);
  });
  let dataURL = getImageDataURL(texture.image);
  const colors = await getTextureColors(texture);
  const info = await mp3.promise;
  dom.setBgImage(dataURL);
  dom.createSpecs(specs);
  dom.setTitle(info.title, colors.primary);
  dom.setArtist(info.artist, colors.primary);
  dom.setThumbnailImage(dataURL);
  document.title = `${info.title} - ${info.artist}`;

  const analyser = new AudioAnalyser(audio, 1024);
  analyser.getFrequencyData();
  const barCount = Math.floor(analyser.data.length * 0.6);
  dom.createFrequencyBars(barCount);

  try {
    let { result } = await CanAutoplay.audio();
    if (!result) {
      throw new Error('Can\'t autoplay');
    }
    await audio.play();
  } catch (err) {
    dom.setInteractionColors(colors.primary, colors.secondary);
    await dom.requestInteraction(() => audio.play());
  }

  const jam = new Jam();
  dom.setLoading(false);
  function animate() {
    requestAnimationFrame(animate);

    for (let spec of specs) {
      spec.update();
    }

    let frequencies: number[] = [];
    analyser.getFrequencyData();
    for (let i = 0; i < barCount; ++i) {
      frequencies.push(analyser.data[i] / 255);
    }

    jam.update(frequencies);

    dom.setBgOverlayOpacity(0.8 - (jam.flash / 10));
    dom.setSpecsBlur(15 * (1 - jam.intensity / 10));
    dom.setContentEffects(jam.intensity);
    dom.updateSpecs(specs);
    dom.updateFrequencyBars(frequencies, colors.secondary);
  }
  animate();
})();