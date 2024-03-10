import { System } from 'detect-collisions';
import { commonWords } from './commonWords';
import { useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function makeSortedArray(input: string, commonWords: Set<string>) {
  const wordMap = new Map<string, number>();
  input.split(' ').forEach((word) => {
    word = word.toLocaleLowerCase();
    while (/[^a-zA-Z]$/.test(word.slice(-1))) {
      word = word.slice(0, -1);
    }
    if (word.endsWith('s') && !word.endsWith('ss')) {
      word = word.slice(0, -1);
    }
    if (/[^a-zA-Z0-9]$/.test(word[0])) {
      word = word.substring(1);
    }
    if (word.length > 2 && !commonWords.has(word)) {
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
    }
  });
  console.log(wordMap);
  const top100 = Array.from(wordMap.keys())
    .sort((a, b) => wordMap.get(b)! - wordMap.get(a)!)
    .slice(0, 100);
  const wordOccurrences = top100.reduce(
    (sum, current) => sum + wordMap.get(current)!,
    0
  );
  return [wordMap, top100, wordOccurrences] as const;
}

const colorSchemes = {
  Kingfisher: ['#146cfd', '#002664', '#8ce0ff', '#8055f1'],
  Waratah: ['#d7153a', '#941b00', '#f3631b', '#faaf05'],
  Wollemi: ['#004000', '#00aa45', '#a8edb3', '#2e808e'],
} as const;
type ColorScheme = keyof typeof colorSchemes;

export function WordCloud() {
  const textField = useRef('');
  const [submittedText, submitText] = useState('');
  const [colorSchemeKey, setColorScheme] = useState<ColorScheme>('Kingfisher');
  const colorScheme = colorSchemes[colorSchemeKey];
  const [wordMap, words, wordCount] = makeSortedArray(
    submittedText,
    commonWords
  );

  const system = new System();

  const width = 800;
  const height = 450;

  return (
    <div>
      <Heading size="3xl">Word Cloud Generator</Heading>
      <br></br>
      <div>
        <textarea
          name="postContent"
          placeholder="Please insert words here."
          rows={10}
          cols={50}
          onChange={(e) => (textField.current = e.target.value)}
          style={{ border: '1px lightgrey solid', borderRadius: 5, padding: 8 }}
        />
      </div>
      <br></br>
      <ButtonGroup>
        <Button onClick={() => submitText(textField.current)}>Submit</Button>
        <Button onClick={() => print()}>Print</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Color Palette: {colorSchemeKey}
          </MenuButton>
          <MenuList>
            {Object.entries(colorSchemes).map(([schemeKey, scheme]) => (
              <MenuItem
                onClick={() => setColorScheme(schemeKey as ColorScheme)}
              >
                {schemeKey}
                &nbsp;&nbsp;
                {scheme.map((color) => (
                  <span
                    style={{
                      height: 16,
                      width: 16,
                      backgroundColor: color,
                      marginRight: 6,
                      borderRadius: 5,
                    }}
                  />
                ))}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </ButtonGroup>
      <br></br> <br></br>
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
    </div>
  );
}

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
