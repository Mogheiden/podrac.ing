export function Lesson1() {
  return (
    <div>
      <div>insert flavour text here</div>
      <div>
        <input
          type="file"
          onChange={(e) => console.log(e.target.files?.item(0))}
        />
      </div>
    </div>
  );
}
