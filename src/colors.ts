import {
  Color,
  Texture,
} from 'three';

type Image = any;

function getImageData(image: Image) {
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let context = canvas.getContext('2d')!;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

function getPixel(imageData: ImageData, x: number, y: number): Color {
  let position = (x + imageData.width * y) * 4, data = imageData.data;
  return new Color(data[ position ] / 255, data[ position + 1 ] / 255, data[ position + 2 ] / 255);
}

export async function getTextureColors(texture: Texture): Promise<{ primary: Color, secondary: Color }> {
  const imageData = getImageData(texture.image);
  let avg = new Color(0, 0, 0);
  let hues: { hue: number, count: number }[] = [];
  for (let i = 0; i < 360; ++i) {
    hues[i] = { hue: i, count: 0 };
  }
  let size = texture.image.width * texture.image.height;
  for (let x = 0; x < texture.image.width; ++x) {
    for (let y = 0; y < texture.image.height; ++y) {
      let pixel = getPixel(imageData, x, y);
      avg.r += pixel.r / size;
      avg.g += pixel.g / size;
      avg.b += pixel.b / size;
      let hsl = { h: 0, s: 0, l: 0 };
      pixel.getHSL(hsl);
      if (hsl.l > 0.2 && hsl.l < 0.8 && hsl.s > 0.5) {
        let hue = Math.floor(hsl.h * 360);
        hues[hue].count++;
      }
    }
  }
  let avgHsl = { h: 0, s: 0, l: 0 };
  avg.getHSL(avgHsl);
  hues.sort((a, b) => b.count - a.count);
  for (let hue of hues) {
    if (Math.abs(hue.hue - avgHsl.h * 360) < 60) {
      hue.count = 0;
    }
  }
  hues.sort((a, b) => b.count - a.count);
  let primary = avg;
  avg.setHSL(avgHsl.h, avgHsl.s, 0.7);
  let secondary = new Color();
  if (hues[0].count > 0) {
    secondary.setHSL(hues[0].hue / 360, 1, 0.5);
  } else {
    secondary.setHSL(0, 0, 255);
  }
  return { primary, secondary };
}
