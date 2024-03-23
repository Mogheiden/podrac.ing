export function makeSortedArray(
  input: string,
  filter: Set<string>,
  commonWords: Set<string>,
  maxWords: number
) {
  const wordMap = new Map<string, number>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    while (/[^a-zA-Z]$/.test(word.slice(-1))) {
      word = word.slice(0, -1);
    }
    if (word.length < 2 || commonWords.has(word)) {
      return;
    }
    if (word.endsWith("'s")) {
      word = word.slice(0, -2);
    }
    if (/[^a-zA-Z0-9]$/.test(word[0])) {
      word = word.substring(1);
    }
    if (word.length > 2 && !commonWords.has(word) && !filter.has(word)) {
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
    }
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
