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
    console.log('No result found');
  } else if (bestIndex === 0) {
    console.log('This was already an english sentence you sussy baka!');
  } else {
    console.log(
      caesarShift(importString, numCorrect.indexOf(Math.max(...numCorrect))),
      `This was shifted ${bestIndex} places.`
    );
  }
}

function caesarShift(encoded: string, shiftSize: number): string {
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
