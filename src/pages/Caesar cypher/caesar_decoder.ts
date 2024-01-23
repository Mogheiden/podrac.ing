const alphabet = 'abcdefghijklmnopqrstuvwxyz';
import Spellchecker from 'hunspell-spellchecker';
import engaff from './eng-dict/en_US.aff?raw';
import engdic from './eng-dict/en_US.dic?raw';

const spellchecker = new Spellchecker();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DICT = spellchecker.parse({ aff: engaff as any, dic: engdic as any });

spellchecker.use(DICT);

// console.log(spellchecker.check('blungus'));

export function caesarDecoder(importString: string): string {
  if (!importString) {
    return '';
  }
  const numCorrect = [];
  for (let i = 0; i < 26; i++) {
    const newString = caesarShift(importString, i);
    const wordList = newString.split(' ');

    numCorrect.push(
      wordList.filter((word) => word.length > 2 && spellchecker.check(word))
        .length
    );
  }
  const bestIndex = numCorrect.indexOf(Math.max(...numCorrect));
  if (numCorrect[bestIndex] <= 1 && importString.split(' ').length > 2) {
    return 'No result found';
  } else if (bestIndex === 0) {
    return 'This was already an english sentence you sussy baka!';
  } else {
    const decoded = caesarShift(
      importString,
      numCorrect.indexOf(Math.max(...numCorrect))
    );
    return `${decoded} This was shifted ${26 - bestIndex} places.`;
  }
}

export function caesarShift(encoded: string, shiftSize: number): string {
  if (isNaN(shiftSize)) {
    return "You didn't enter a number you Cummeian illiterate!";
  }
  let shiftString = '';
  for (const char of encoded) {
    const index = alphabet.indexOf(char.toLocaleLowerCase());
    if (index != -1) {
      shiftString += alphabet[(index + shiftSize) % 26];
    } else {
      shiftString += char;
    }
  }
  return shiftString;
}

// caesarDecoder('In this household, we obey the laws of thermodynamics!');
