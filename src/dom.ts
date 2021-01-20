import { Color } from 'three';
import { Spec } from './spec';

const elements = {
  interaction: document.getElementById('interaction')!,
  loading: document.getElementById('loading')!,
  loadingText: document.getElementById('loading-text')!,
  loadingPercent: document.getElementById('loading-percent')!,
  bg: document.getElementById('bg')!,
  bgOverlay: document.getElementById('bg-overlay')!,
  thumbnail: document.getElementById('thumbnail')!,
  specs: document.getElementById('specs')!,
  spec: [] as HTMLDivElement[],
  content: document.getElementById('content')!,
  title: document.getElementById('title')!,
  artist: document.getElementById('artist')!,
  frequency: document.getElementById('frequency')!,
  frequencyBar: [] as HTMLDivElement[],
  realtime: document.getElementById('realtime')!,
  realtimeBars: [] as HTMLDivElement[],
};

function colorToCss(color: Color, alpha = 1) {
  let rgb = `${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}`;
  if (alpha == 1) {
    return `rgb(${rgb})`;
  } else {
    return `rgba(${rgb}, ${alpha})`;
  }
}

export function requestInteraction(cb: () => void) {
  elements.interaction.style.display = 'block';
  return new Promise<void>(resolve => {
    elements.interaction.onclick = () => {
      elements.interaction.style.display = 'none';
      cb();
      resolve();
      cb = () => {};
    };
  });
}

export function setInteractionColors(primary: Color, secondary: Color) {
  let primaryHsl = { h: 0, s: 0, l: 0 };
  let secondaryHsl = { h: 0, s: 0, l: 0 };
  primary.getHSL(primaryHsl);
  primary.setHSL(primaryHsl.h, primaryHsl.s, 0.1);
  secondary.getHSL(secondaryHsl);
  secondary.setHSL(secondaryHsl.h, secondaryHsl.s * 0.7, secondaryHsl.l * 1.2);

  elements.interaction.style.backgroundColor = colorToCss(primary);
  elements.loading.style.backgroundColor = colorToCss(primary);
  elements.interaction.style.color = colorToCss(secondary);
}

export function setLoading(loading: boolean) {
  if (loading) {
    elements.loading.classList.remove('loading-hidden');
  } else {
    elements.loading.classList.add('loading-hidden');
  }
}

export function setLoadingText(str: string) {
  if (elements.loadingText.innerText != str) {
    setLoadingPercent(0);
  }
  elements.loadingText.innerText = str;
}

export function setLoadingPercent(percent: number) {
  elements.loadingPercent.innerText = String(Math.floor(percent * 100)) + '%';
}

export function setBgImage(url: string) {
  return new Promise(resolve => {
    elements.bg.style.backgroundImage = `url("${url}")`;
    elements.bg.onload = resolve;
  });
}

export function setBgOverlayOpacity(opacity: number) {
  elements.bgOverlay.style.opacity = String(opacity);
}

export function setSpecsBlur(blur: number) {
  elements.specs.style.filter = `blur(${blur}px)`;
}

export function createSpecs(specs: Spec[]) {
  for (let spec of specs) {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.backgroundColor = 'white';
    div.style.borderRadius = '50%';
    div.style.width = `${200 - spec.distance * spec.distance}px`;
    div.style.height = `${200 - spec.distance * spec.distance}px`;
    div.style.opacity = String(((spec.distance / 15) ** 2) * 0.05);
    elements.specs.appendChild(div);
    elements.spec.push(div);
  }
}

export function updateSpecs(specs: Spec[]) {
  for (let i = 0; i < specs.length; ++i) {
    let div = elements.spec[i];
    let spec = specs[i];
    div.style.left = `${spec.x}px`;
    div.style.top = `${spec.y}px`;
  }
}

export function setContentEffects(intensity: number) {
  let scale = 1 + intensity / 50;
  elements.content.style.transform = `scale(${scale})`;

  intensity = (intensity / 10) ** 3;
  elements.content.style.opacity = String(1 - intensity * 0.1);
  elements.content.style.filter = `blur(${intensity})`;
}

export function setTitle(title: string, color: Color) {
  elements.title.innerText = title;
  elements.title.style.color = colorToCss(color);
}

export function setArtist(artist: string, color: Color) {
  elements.artist.innerText = artist;
  elements.artist.style.color = colorToCss(color);
}

export function setThumbnailImage(url: string) {
  elements.thumbnail.setAttribute('src', url);
}

export function createFrequencyBars(count: number) {
  for (let i = 0; i < count; ++i) {
    let div = document.createElement('div');
    div.classList.add('frequency-bar');
    elements.frequency.appendChild(div);
    elements.frequencyBar.push(div);
  }
}

export function updateFrequencyBars(frequencies: number[], color: Color) {
  for (let i = 0; i < frequencies.length; ++i) {
    let div = elements.frequencyBar[i];
    if (!div) return;
    let frequency = frequencies[i];
    div.style.transform = `scaleY(${frequency})`;
    div.style.opacity = String(frequency);
    div.style.backgroundColor = colorToCss(color, frequency);
  }
}