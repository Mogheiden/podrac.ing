let wordarray = [];

function makeSortedArray(input: string) {
  const wordMap = new Map<string, number>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    if (wordMap.has(word)) {
      wordMap.set(word, wordMap.get(word)! + 1);
    } else {
      wordMap.set(word, 1);
    }
  });
}
