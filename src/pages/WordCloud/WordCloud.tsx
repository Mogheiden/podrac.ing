import { System } from 'detect-collisions';
import { commonWords } from './commonWords';
import { useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function makeSortedArray(
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
  console.log(wordMap);
  const top = Array.from(wordMap.keys())
    .sort((a, b) => wordMap.get(b)! - wordMap.get(a)!)
    .slice(0, maxWords);
  const wordOccurrences = top.reduce(
    (sum, current) => sum + wordMap.get(current)!,
    0
  );
  return [wordMap, top, wordOccurrences] as const;
}
const defaultNumberWords = 100;

const allColourCodes = [
  '#22272b',
  '#495054',
  '#cdd3d6',
  '#ebebeb',
  '#004000',
  '#00aa45',
  '#a8edb3',
  '#dbfadf',
  '#0b3f47',
  '#2e808e',
  '#8cdbe5',
  '#d1eeea',
  '#002664',
  '#146cfd',
  '#8ce0ff',
  '#cbedfd',
  '#441170',
  '#8055f1',
  '#cebfff',
  '#e6e1fd',
  '#65004d',
  '#d912ae',
  '#f4b5e6',
  '#fddef2',
  '#630019',
  '#d7153a',
  '#ffb8c1',
  '#ffe6ea',
  '#941b00',
  '#f3631b',
  '#FFCE99',
  '#fdeddf',
  '#694800',
  '#faaf05',
  '#fde79a',
  '#fff4cf',
  '#523719',
  '#b68d5d',
  '#e8d0b5',
  '#ede3d7',
];

const colorSchemes = {
  Kingfisher: ['#146cfd', '#002664', '#8ce0ff', '#8055f1'],
  Waratah: ['#d7153a', '#941b00', '#f3631b', '#faaf05'],
  Wollemi: ['#004000', '#00aa45', '#a8edb3', '#2e808e'],
} as const;
type ColorScheme = keyof typeof colorSchemes;

export function WordCloud() {
  const textField = useRef('');
  const filterText = useRef('');
  const maxWordsText = useRef(defaultNumberWords);
  const [maxWords, setMaxWords] = useState(defaultNumberWords);
  const [submittedText, submitText] = useState('');
  const [submittedFilter, submitFilter] = useState<Set<string>>(new Set());
  const [colorSchemeKey, setColorScheme] = useState<ColorScheme | 'Custom'>(
    'Kingfisher'
  );
  const [customColorScheme, setCustomColorScheme] = useState<string[]>([]);
  const [customColorSchemeInput, setCustomColorSchemeInput] = useState<
    string[]
  >([]);

  const [modal, setModal] = useState<boolean>(false);
  const colorScheme =
    colorSchemeKey === 'Custom'
      ? customColorScheme
      : colorSchemes[colorSchemeKey];
  const [wordMap, words, wordCount] = makeSortedArray(
    submittedText,
    submittedFilter,
    commonWords,
    maxWords
  );

  const system = new System();

  const width = 800;
  const height = 450;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Heading size="3xl">Word Cloud Generator</Heading>
      <br></br>
      <FormControl style={{ width: 700 }}>
        <FormLabel>Enter text here:</FormLabel>
        <textarea
          name="postContent"
          placeholder="Please insert words here."
          rows={10}
          onChange={(e) => (textField.current = e.target.value)}
          style={{
            border: '1px lightgrey solid',
            borderRadius: 5,
            padding: 8,
            width: '100%',
          }}
        />
      </FormControl>
      <br></br>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl style={{ width: 'auto' }}>
          <FormLabel>Filter Words:</FormLabel>
          <textarea
            name="filterContent"
            placeholder="Please specify filter words."
            rows={1}
            cols={50}
            onChange={(e) => (filterText.current = e.target.value)}
            style={{
              border: '1px lightgrey solid',
              borderRadius: 5,
              padding: 8,
              marginRight: 20,
            }}
          />
        </FormControl>
        <FormControl style={{ width: 'auto' }}>
          <FormLabel>Max word count:</FormLabel>
          <NumberInput
            onChange={(_, n) => (maxWordsText.current = n)}
            defaultValue={defaultNumberWords}
            min={5}
            max={120}
            style={{ width: 150 }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </div>
      <br></br>
      <ButtonGroup>
        <Button
          onClick={() => {
            submitFilter(
              new Set(filterText.current.toLocaleLowerCase().split(' '))
            );
            submitText(textField.current);
            setMaxWords(maxWordsText.current);
          }}
        >
          Submit
        </Button>
        <Button onClick={() => print()}>Print</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Colour Palette: {colorSchemeKey}
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
            <MenuItem onClick={() => setModal(true)}>
              Custom &nbsp;&nbsp;
              {customColorScheme?.map((color) => (
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
      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Custom Colour Scheme</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {new Array(4).fill(0).map((_, i) => (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  style={{ width: 180, marginRight: 10, marginBottom: 10 }}
                >
                  Colour {i + 1}:{' '}
                  <span
                    style={{
                      position: 'absolute',
                      display: 'inline-block',
                      height: 24,
                      width: 24,
                      backgroundColor: customColorSchemeInput[i],
                      marginLeft: 6,
                      borderRadius: 5,
                      marginTop: -3,
                    }}
                  />
                </MenuButton>
                <MenuList
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    minWidth: 'unset',
                    maxWidth: 124,
                  }}
                >
                  {allColourCodes.map((color) => (
                    <MenuItem
                      onClick={() =>
                        setCustomColorSchemeInput((arr) => {
                          arr = structuredClone(arr);
                          arr[i] = color;
                          return arr;
                        })
                      }
                      style={{
                        height: 24,
                        width: 24,
                        backgroundColor: color,
                        marginRight: 3,
                        marginLeft: 3,
                        marginBottom: 6,
                        borderRadius: 5,
                      }}
                    ></MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                setCustomColorScheme(customColorSchemeInput);
                setColorScheme('Custom');
                setModal(false);
              }}
            >
              Set Colour Scheme
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
