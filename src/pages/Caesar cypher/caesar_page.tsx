import { useState } from 'react';
import { caesarDecoder, caesarShift } from './caesar_decoder';

export function CaesarPage() {
  return (
    <div>
      <EncodingSection />
      <DecodingSection />
    </div>
  );
}

function DecodingSection() {
  const [code, setCode] = useState('');
  return (
    <div>
      Write your Cummeiform script to "de-cummiefy":
      <br />
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

function EncodingSection() {
  const [input, setInput] = useState('Write your common script in this box!');
  const [shift, setShift] = useState('69');
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
    </div>
  );
}

// function UncontrolledDecodingSection() {
//   const [output, setOutput] = useState('');
//   return (
//     <>
//       <form
//         method="post"
//         onSubmit={(e) => {
//           e.preventDefault();
//           const formData = new FormData(e.target as HTMLFormElement);
//           setOutput(caesarDecoder(formData.get('postContent')));
//         }}
//       >
//         <label>
//           Edit your post:
//           <textarea
//             name="postContent"
//             defaultValue="I really enjoyed biking yesterday!"
//             rows={4}
//             cols={40}
//           />
//         </label>
//         <hr />
//         <button type="reset">Reset edits</button>
//         <button type="submit">Save post</button>
//       </form>
//       <div>{output}</div>
//     </>
//   );
// }
