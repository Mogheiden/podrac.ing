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
  }: {
    text: string;
    filteredWords: Set<string>;
    maxWords: number;
    colorScheme: readonly string[];
  }) => {
    const [wordMap, words, wordCount] = makeSortedArray(
      text,
      filteredWords,
      commonWords,
      maxWords
    );

    const system = new System();
    const width = 800;
    const height = 450;

    return (
      <div
        className="printable"
        style={{
          width,
          height,
          position: 'relative',
          border: '1px lightgrey solid',
          borderRadius: 5,
          background: 'whitesmoke',
        }}
      >
        {words.map((word, i) => (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              padding: 3,
              fontFamily: 'Public Sans',
              fontSize: getFontSize(i, wordMap.get(word)!, wordCount),
              lineHeight: '100%',
              color: colorScheme[i % colorScheme.length],
            }}
            ref={(el) => {
              if (!el) return;
              const { width: wordWidth, height: wordHeight } =
                el.getBoundingClientRect();
              const initialBoxPos = { x: width / 2, y: height / 2 };
              if (i === 0) {
                initialBoxPos.x -= wordWidth / 2;
                initialBoxPos.y -= wordHeight / 2;
              }
              const box = system.createBox(
                initialBoxPos,
                wordWidth,
                wordHeight
              );
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
              el.style.left = `${box.pos.x}px`;
              el.style.top = `${box.pos.y}px`;
            }}
          >
            {word}
          </div>
        ))}
      </div>
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
