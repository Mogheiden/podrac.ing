import { memo } from 'react';
import { System } from 'detect-collisions';
import { commonWords } from './commonWords';
import { makeSortedArray } from './sortWords';

export const WordCloudBox = memo(
  ({
    text,
    filteredWords,
    maxWords,
    colorScheme,
    width,
    height,
  }: {
    text: string;
    filteredWords: Set<string>;
    maxWords: number;
    colorScheme: readonly string[];
    width: number;
    height: number;
  }) => {
    const font = 'Public Sans';
    const renderScale = 2;
    const [wordMap, words, wordCount] = makeSortedArray(
      text,
      filteredWords,
      commonWords,
      maxWords
    );

    const system = new System();
    return (
      <canvas
        id="word-cloud-canvas"
        style={{ width: '100%', height: '100%' }}
        ref={(el) => {
          if (!el) return;
          const ctx = el.getContext('2d');
          if (!ctx) throw new Error('Missing canvas context');

          ctx.clearRect(0, 0, width * renderScale, height * renderScale);
          ctx.fillStyle = 'whitesmoke';
          ctx.fillRect(0, 0, width * renderScale, height * renderScale);

          words.forEach((word, i) => {
            const fontSize = getFontSize(i, wordMap.get(word)!, wordCount);
            ctx.font = `${fontSize}px ${font}`;

            const measurement = ctx.measureText(word);
            const wordWidth = measurement.width + 6;
            const wordHeight =
              measurement.actualBoundingBoxAscent +
              measurement.actualBoundingBoxDescent +
              6;

            const initialBoxPos = { x: width / 2, y: height / 2 };
            if (i === 0) {
              initialBoxPos.x -= wordWidth / 2;
              initialBoxPos.y -= wordHeight / 2;
            }
            const box = system.createBox(initialBoxPos, wordWidth, wordHeight);
            let numOutOfBounds = 0;
            while (numOutOfBounds < 200) {
              let dx = 0.5 - Math.random();
              let dy = 0.5 - Math.random();
              const l = Math.sqrt(dx * dx + dy * dy);
              dx /= l;
              dy /= l;
              while (system.checkOne(box)) {
                box.setPosition(box.pos.x + 10 * dx, box.pos.y + 10 * dy);
              }
              if (
                box.pos.x + wordWidth > width ||
                box.pos.x < 0 ||
                box.pos.y + wordHeight > height ||
                box.pos.y < 0
              ) {
                box.setPosition(initialBoxPos.x, initialBoxPos.y);
                numOutOfBounds += 1;
                continue;
              }
              break;
            }
            if (numOutOfBounds >= 20) {
              system.remove(box);
              return;
            }
            box.isStatic = true;

            ctx.font = `${fontSize * renderScale}px ${font}`;
            ctx.fillStyle = colorScheme[i % colorScheme.length];

            ctx.fillText(
              word,
              box.pos.x * renderScale,
              (box.pos.y + measurement.actualBoundingBoxAscent) * renderScale
            );
          });
        }}
        width={width * renderScale}
        height={height * renderScale}
      />
    );
  }
);

function getFontSize(index: number, wordFrequency: number, wordCount: number) {
  let initialSize = Math.floor(1500 * (wordFrequency / wordCount));
  if (initialSize < 10) {
    initialSize = 10;
  }
  if (initialSize > 50) {
    initialSize = 50;
  }
  if (index === 0) {
    return initialSize + 20;
  }
  if (index === 1 || index === 2) {
    return initialSize + 15;
  }
  if (index < 2 && index < 10) {
    return initialSize + 5;
  }
  return initialSize;
}
