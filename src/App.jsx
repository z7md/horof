import React, { useState, useEffect } from "react";
import Hex from "./components/hex";
let arabicLetters = [
  "أ",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "هـ",
  "و",
  "ي",
];

const numbers = [0, 6, 7, 13, 14, 20, 21, 27, 28, 34, 40, 41, 47];
const App = () => {
    const [redHex,setRedHex]=useState([ ])
    const [greenHex,setGreenHex]=useState([ ])
  const [hexData, setHexData] = useState(new Array(35).fill(""));

  // Function to generate random letters for each hexagon
  const assignLettersToHexagons = () => {
    // Filter out the red hexagon indices
    const shuffledLetters = [...arabicLetters].sort(() => Math.random() - 0.5);

    // Create a new array of hexData with Arabic letters for non-red hexagons
    const lettersForGrid = new Array(35).fill(""); // Initialize an array of 49 empty strings

    // Assign letters to the non-red hexagons
    let letterIndex = 0;
    for (let i = 0; i < 35; i++) {
      if (!numbers.includes(i) && letterIndex < shuffledLetters.length) {
        lettersForGrid[i] = shuffledLetters[letterIndex]; // Assign a letter to non-red hexagons
        letterIndex++;
      }
    }
    console.log(lettersForGrid);
    setHexData(lettersForGrid); // Update the grid with the shuffled letters
  };
  const refresh = ()=>{
    setRedHex([])
    setGreenHex([])
  }
  useEffect(() => {
    assignLettersToHexagons();
  }, []); // Empty dependency array means this runs only once on mount
  return (
    <div className="xx">
      <h1 className="text-white text-5xl mb-10">أستراحة ابو يس</h1>
      <div className="container grid-cols-7 grid-rows-7">
        <div className={`bg-red-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-green-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-green-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-red-500 hexagon select-none`}></div>

        {hexData.map((item, index) => {
          return !numbers.includes(index) ? (
            <Hex
              value={item}
              index={index}
              arabicLetters={item}
              className="hexagon"
              redHex={redHex}
              greenHex={greenHex}
              setGreenHex={setGreenHex}
              setRedHex={setRedHex}
            />
          ) : (
            <div className={`bg-red-500 hexagon select-none`}></div>
          );
        })}

        <div className={`bg-red-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-green-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-green-500 hexagon select-none`}></div>
        <div className={`bg-green-500 hexagon select-none mt-6`}></div>
        <div className={`bg-red-500 hexagon select-none`}></div>
      </div>
        <div className="flex justify-center items-center gap-2">
      <button
        onClick={assignLettersToHexagons}
        className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4"
      >
        إعادة ترتيب الحروف
      </button>
      <button
        onClick={refresh}
        className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4"
      >
         إعادة اللعبة
      </button>
      </div>
    </div>
  );
};

export default App;
