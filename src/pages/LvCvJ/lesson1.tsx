import { useState } from 'react';

export function Lesson1() {
  const [file, setFile] = useState<string | undefined>(undefined);
  return (
    <div>
      <div>insert flavour text here</div>
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFile(undefined);
            const reader = new FileReader();
            const file = e.target.files?.item(0);
            if (!file) {
              return;
            }
            reader.onload = (evt) => setFile(evt.target?.result?.toString());
            reader.readAsDataURL(file);
          }}
        />
      </div>
      <div>
        <img
          src={file}
          style={{
            maxWidth: '100%',
            maxHeight: 512,
          }}
        />
      </div>
    </div>
  );
}
