import { System } from 'detect-collisions';
import { commonWords } from './commonWords';
import { useRef, useState } from 'react';

function makeSortedArray(input: string, commonWords: Set<string>): string[] {
  const wordMap = new Map<string, number>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    if (/[^a-zA-Z0-9]$/.test(word.slice(-1))) {
      word = word.slice(0, -1);
    }
    if (word.length > 2 && !commonWords.has(word)) {
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
    }
  });
  return Array.from(wordMap.keys()).sort(
    (a, b) => wordMap.get(b)! - wordMap.get(a)!
  );
}

export function WordCloud() {
  const textField = useRef('');
  const [submittedText, submitText] = useState('');
  const colours = ['#002664', '#146cfd', '#8ce0ff', '#8055f1'];
  const words = makeSortedArray(submittedText, commonWords);

  const system = new System();

  const width = 800;
  const height = 450;

  return (
    <div>
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={10}
        cols={50}
        onChange={(e) => (textField.current = e.target.value)}
      />
      <button onClick={() => submitText(textField.current)}>submit</button>
      <div
        style={{
          width,
          height,
          position: 'relative',
          border: 'solid',
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
              fontSize: getFontSize(i, 36, words.length),
              lineHeight: '100%',
              color: colours[i % colours.length],
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
              while (numOutOfBounds < 5) {
                let dx = 0.5 - Math.random();
                let dy = 0.5 - Math.random();
                const l = Math.sqrt(dx * dx + dy * dy);
                dx /= l;
                dy /= l;
                while (system.checkOne(box)) {
                  box.setPosition(box.pos.x + dx, box.pos.y + dy);
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
              box.isStatic = true;
              el.style.left = `${box.pos.x}px`;
              el.style.top = `${box.pos.y}px`;
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

function getFontSize(index: number, maxSize: number, wordCount: number) {
  if (index === 0) {
    return maxSize * 1.2;
  }
  if (index === 1 || index === 2) {
    return maxSize;
  }
  if (index < wordCount / 3) {
    return Math.floor(maxSize * 0.8);
  }
  if (index < (wordCount / 3) * 2) {
    return Math.floor(maxSize * 0.6);
  }
  return Math.floor(maxSize * 0.5);
}
