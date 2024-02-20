import { Box, System } from 'detect-collisions';

const commonWords = [
  'and',
  'but',
  'for',
  'too',
  'since',
  'from',
  'the',
  'say',
  'get',
  'know',
  'about',
  'into',
  'over',
  'after',
  'you',
];

function makeSortedArray(input: string, commonWords: string[]): string[] {
  const wordMap = new Map<string, number>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    if (word.length > 2 && !commonWords.includes(word)) {
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
    }
  });
  return Array.from(wordMap.keys()).sort(
    (a, b) => wordMap.get(b)! - wordMap.get(a)!
  );
}

export function WordCloud() {
  const str =
    "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings would simply not be able to lift its fat little body off of the ground. The bee, of course, flies anyway, because bees don't care what humans think is impossible.";
  const words = makeSortedArray(str, commonWords);

  const system = new System();

  return (
    <div style={{ position: 'relative' }}>
      {words.map((word) => (
        <div
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={(el) => {
            if (!el) return;
            const { width, height } = el.getBoundingClientRect();
            const box = new Box(
              { x: 0 * Math.random(), y: 0 * Math.random() },
              width,
              height
            );
            system.insert(box);
            system.separate();
            el.style.left = `${box.pos.x}px`;
            el.style.top = `${box.pos.y}px`;
            console.log(box.pos);
          }}
        >
          {word}
        </div>
      ))}
    </div>
  );
}
