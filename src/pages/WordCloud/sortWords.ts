import { stemmer } from 'stemmer';

export function makeSortedArray(
  input: string,
  filter: Set<string>,
  commonWords: Set<string>,
  maxWords: number
) {
  const stems = new Map<string, Map<string, number>>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    while (/[^a-zA-Z]$/.test(word.slice(-1))) {
      word = word.slice(0, -1);
    }
    if (/[^a-zA-Z0-9]$/.test(word[0])) {
      word = word.substring(1);
    }
    if (word.length < 2 || commonWords.has(word)) {
      return;
    }
    if (word.length > 2 && !commonWords.has(word) && !filter.has(word)) {
      const wordStem = stemmer(word);
      const subMap = stems.get(wordStem) ?? new Map<string, number>();
      subMap.set(word, (subMap.get(word) ?? 0) + 1);
      stems.set(wordStem, subMap);
    }
  });
  const wordMap = new Map<string, number>();
  stems.forEach((subMap) => {
    let mostCommonWord = '';
    let mostCommonFreq = 0;
    let total = 0;
    subMap.forEach((frequency, word) => {
      if (frequency > mostCommonFreq) {
        mostCommonFreq = frequency;
        mostCommonWord = word;
      }
      total += frequency;
    });
    wordMap.set(mostCommonWord, total);
  });
  const top = Array.from(wordMap.keys())
    .sort((a, b) => wordMap.get(b)! - wordMap.get(a)!)
    .slice(0, maxWords);
  const wordOccurrences = top.reduce(
    (sum, current) => sum + wordMap.get(current)!,
    0
  );
  return [wordMap, top, wordOccurrences] as const;
}
