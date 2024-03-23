export const allColourCodes = [
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

export const colorSchemes = {
  Kingfisher: ['#146cfd', '#002664', '#8ce0ff', '#8055f1'],
  Waratah: ['#d7153a', '#941b00', '#f3631b', '#faaf05'],
  Wollemi: ['#004000', '#00aa45', '#a8edb3', '#2e808e'],
} as const;
export type ColorScheme = keyof typeof colorSchemes;
