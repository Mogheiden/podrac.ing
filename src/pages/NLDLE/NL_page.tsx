import { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

type Month = (typeof months)[number];

const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

const years = arrayRange(2010, 2024, 1);

type Guess = Readonly<{ year: number; month: Month; distance: number }>;

const allowedGuesses = 6;

export function Nldle() {
  const [submittedGuesses, setSubmittedGuesses] = useState<Guess[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselContent = [
    <div>1</div>,
    <div>2</div>,
    <div>3</div>,
    <div>4</div>,
    <div>5</div>,
    <div>6</div>,
  ];
  console.log(submittedGuesses.length, carouselIndex);
  return (
    <>
      <div>{carouselContent[carouselIndex]}</div>
      <button
        onClick={() => setCarouselIndex((n) => n - 1)}
        disabled={carouselIndex === 0}
      >
        {'<'}
      </button>
      {carouselContent.map((_, i) => (
        <button
          onClick={() => setCarouselIndex(i)}
          disabled={i > submittedGuesses.length}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCarouselIndex((n) => n + 1)}
        disabled={carouselIndex >= submittedGuesses.length}
      >
        {'>'}
      </button>
      {new Array(allowedGuesses).fill(0).map((_, i) => {
        const currentGuessIdx = submittedGuesses.length;
        return (
          <GuessLine
            mode={(() => {
              if (i === currentGuessIdx) return 'guessing';
              if (i < currentGuessIdx) return 'submitted';
              return 'hidden';
            })()}
            submittedGuess={submittedGuesses[i]}
            submitGuess={(guess) => {
              setCarouselIndex(submittedGuesses.length + 1);
              setSubmittedGuesses(
                submittedGuesses.concat({
                  ...guess,
                  distance: distance(guess.year, guess.month, 2021, 'June'),
                })
              );
            }}
          />
        );
      })}
    </>
  );
}

function GuessLine(props: {
  mode: 'hidden' | 'guessing' | 'submitted';
  submittedGuess: Guess | undefined;
  submitGuess: (guess: Omit<Guess, 'distance'>) => void;
}) {
  const inputsDisabled = props.mode !== 'guessing';
  const [_year, setYear] = useState<number | undefined>();
  const [_month, setMonth] = useState<Month | undefined>();
  const guess = props.submittedGuess ?? { year: _year, month: _month };

  const back = (
    <div
      style={{
        height: 40,
        marginBottom: 10,
        backgroundColor: 'gray',
        borderRadius: 10,
      }}
    ></div>
  );

  const front = (
    <div style={{ height: 40, marginBottom: 10 }}>
      <select
        style={{ fontSize: 20 }}
        name="year"
        disabled={inputsDisabled}
        value={guess.year}
        onChange={(e) =>
          setYear(e.target.value == null ? undefined : parseInt(e.target.value))
        }
      >
        <option value="">--Year--</option>
        {years.map((year) => (
          <option value={year}>{year}</option>
        ))}
      </select>
      <select
        style={{ fontSize: 20 }}
        name="month"
        disabled={inputsDisabled}
        value={guess.month}
        onChange={(e) => setMonth(e.target.value as Month)}
      >
        <option value="">--Month--</option>
        {months.map((month) => (
          <option value={month}>{month}</option>
        ))}
      </select>
      <span style={{ width: 100, height: '100%', display: 'inline-block' }}>
        {props.mode === 'submitted' ? (
          renderDistanceIndicator(assertExists(props.submittedGuess?.distance))
        ) : (
          <button
            disabled={inputsDisabled || !guess.month || !guess.year}
            onClick={() =>
              props.submitGuess({
                year: assertExists(guess.year),
                month: assertExists(guess.month),
              })
            }
            style={{ width: '100%', height: '100%' }}
          >
            Submit
          </button>
        )}
      </span>
    </div>
  );
  return (
    <ReactCardFlip isFlipped={props.mode === 'hidden'} flipDirection="vertical">
      {front}
      {back}
    </ReactCardFlip>
  );
}

function distance(
  selectedYear: number,
  selectedMonth: Month,
  correctYear: number,
  correctMonth: Month
) {
  const selectedYearIndex = years.indexOf(selectedYear);
  const correctYearIndex = years.indexOf(correctYear);
  const selectedMonthIndex = months.indexOf(selectedMonth);
  const correctMonthIndex = months.indexOf(correctMonth);

  return (
    selectedMonthIndex -
    correctMonthIndex +
    (selectedYearIndex - correctYearIndex) * 12
  );
}

function renderDistanceIndicator(distance: number) {
  return (
    <button
      disabled={true}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: (() => {
          const absDistance = Math.abs(distance);
          if (absDistance >= 12) return 'red';
          if (absDistance >= 6) return 'orange';
          if (absDistance > 0) return 'yellow';
          return 'green';
        })(),
        borderRadius: 10,
        color: 'rgba(0,0,0,0.5)',
        minHeight: 0,
        maxHeight: '100%',
      }}
    >
      {(() => {
        if (distance > 0) {
          return '⟵';
        }
        if (distance < 0) {
          return '⟶';
        }
        return '✓';
      })()}
    </button>
  );
}

function assertExists<T>(value: T) {
  if (value == null) throw new Error('Expected non-null value, bucko!');
  return value;
}
