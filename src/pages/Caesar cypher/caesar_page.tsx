import { useState } from 'react';
import { caesarDecoder, caesarShift } from './caesar_decoder';

export function CaesarPage() {
  const [input, setInput] = useState('Write your common script in this box!');
  const [shift, setShift] = useState('69');
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      Write your common script to "Cummeify":
      <textarea
        name="Input"
        rows={4}
        cols={40}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      Set your offset here: <br />
      <textarea
        name="Input"
        rows={1}
        cols={2}
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      />
      <br />
      <div>Cummeified text!</div>
      <div>{caesarShift(input, parseInt(shift))}</div>
      <br />
      Write your Cummeiform script to "de-cummiefy":
      <textarea
        name="Input"
        rows={4}
        cols={40}
        value={code}
        placeholder="Put your Cummeiform in my box!"
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <div>Common text!</div>
      <div>{caesarDecoder(code)}</div>
    </div>
  );
}
