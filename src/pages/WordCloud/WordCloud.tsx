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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChevronDownIcon, DownloadIcon } from '@chakra-ui/icons';
import { WordCloudBox } from './WordCloudBox';
import { ColorScheme, allColourCodes, colorSchemes } from './colorSchemes';
import { commonWords } from './commonWords';
import { makeSortedArray } from './sortWords';

const defaultNumberWords = 100;

type ModalType = 'customColor' | 'stats';

export function WordCloud() {
  const textField = useRef('');
  const [filterText, setFilterText] = useState('');
  const maxWordsText = useRef(defaultNumberWords);
  const [maxWords, setMaxWords] = useState(defaultNumberWords);
  const [submittedText, submitText] = useState('');
  const [submittedFilter, submitFilter] = useState<Set<string>>(new Set());
  const [colorSchemeKey, setColorScheme] = useState<ColorScheme | 'Custom'>(
    'Kingfisher'
  );
  const [title] = useState('');
  const [customColorScheme, setCustomColorScheme] = useState<string[]>([]);
  const [customColorSchemeInput, setCustomColorSchemeInput] = useState<
    string[]
  >([]);

  const [modal, setModal] = useState<ModalType | null>(null);

  const wordCloudDiv = useRef<HTMLDivElement | null>(null);

  const colorScheme =
    colorSchemeKey === 'Custom'
      ? customColorScheme
      : colorSchemes[colorSchemeKey];
  function renderModal(modal: ModalType) {
    switch (modal) {
      case 'customColor':
        return (
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
                  setModal(null);
                }}
              >
                Set Colour Scheme
              </Button>
            </ModalFooter>
          </ModalContent>
        );
      case 'stats': {
        const [wordMap, words] = makeSortedArray(
          submittedText,
          new Set(),
          commonWords,
          200
        );
        const currentFilter = new Set(filterText.toLowerCase().split(' '));
        return (
          <ModalContent>
            <ModalHeader>Words</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Word</Th>
                      <Th isNumeric>Count</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {words.map((word) => (
                      <Tr>
                        <Td>{word}</Td>
                        <Td>{wordMap.get(word)}</Td>
                        <Td>
                          <Button
                            isDisabled={currentFilter.has(word)}
                            onClick={() =>
                              setFilterText((text) =>
                                (text + ' ' + word).trim()
                              )
                            }
                          >
                            Filter
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </ModalBody>
          </ModalContent>
        );
      }
    }
  }
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
      <div>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <FormControl style={{ width: 'auto', alignSelf: 'flex-start' }}>
            <FormLabel>Set title: (Optional)</FormLabel>
            <textarea
              value={title}
              name="wordCloudTitle"
              placeholder="Please put title here."
              rows={1}
              cols={50}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                border: '1px lightgrey solid',
                borderRadius: 5,
                padding: 8,
                marginRight: 20,
              }}
            />
          </FormControl>
        </div>
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
      </div>
      <br></br>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl style={{ width: 'auto' }}>
          <FormLabel>Filter Words:</FormLabel>
          <textarea
            value={filterText}
            name="filterContent"
            placeholder="Please specify filter words."
            rows={1}
            cols={50}
            onChange={(e) => setFilterText(e.target.value)}
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
            submitFilter(new Set(filterText.toLocaleLowerCase().split(' ')));
            submitText(textField.current);
            setMaxWords(maxWordsText.current);
          }}
        >
          Submit
        </Button>
        <Button onClick={() => setModal('stats')} isDisabled={!submittedText}>
          Stats
        </Button>
        <Button
          onClick={() => {
            const link = document.createElement('a');
            link.setAttribute('download', 'wordcloud.png');
            link.setAttribute(
              'href',
              (
                document.getElementById(
                  'word-cloud-canvas'
                ) as HTMLCanvasElement
              )
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream')
            );
            link.click();
          }}
          isDisabled={!submittedText}
          rightIcon={<DownloadIcon />}
        >
          Download
        </Button>
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
            <MenuItem onClick={() => setModal('customColor')}>
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
          overflow: 'hidden',
        }}
      >
        <div ref={wordCloudDiv} style={{ width, height }}>
          <WordCloudBox
            text={submittedText}
            filteredWords={submittedFilter}
            maxWords={maxWords}
            colorScheme={colorScheme}
            width={width}
            height={height}
          />
        </div>
      </div>
      <Modal isOpen={modal != null} onClose={() => setModal(null)}>
        <ModalOverlay />
        {modal == null ? null : renderModal(modal)}
      </Modal>
    </div>
  );
}
