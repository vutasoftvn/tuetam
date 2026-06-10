type Rgba = [number, number, number, number];

export function hasEnoughLineContrast(pixels: Uint8ClampedArray): boolean {
  let min = 255;
  let max = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    min = Math.min(min, brightness);
    max = Math.max(max, brightness);
  }
  return max - min >= 80;
}

function isBoundary(pixels: Uint8ClampedArray, index: number): boolean {
  const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
  return brightness < 80;
}

export function floodFillPixels({
  pixels,
  width,
  height,
  x,
  y,
  color,
}: {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
  x: number;
  y: number;
  color: Rgba;
}): Uint8ClampedArray {
  const output = new Uint8ClampedArray(pixels);
  const start = (y * width + x) * 4;
  if (isBoundary(output, start)) return output;

  const queue: Array<[number, number]> = [[x, y]];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    const key = `${cx}:${cy}`;
    if (seen.has(key) || cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    seen.add(key);
    const index = (cy * width + cx) * 4;
    if (isBoundary(output, index)) continue;
    output[index] = color[0];
    output[index + 1] = color[1];
    output[index + 2] = color[2];
    output[index + 3] = color[3];
    queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  return output;
}
