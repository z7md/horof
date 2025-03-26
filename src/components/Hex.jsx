import React, { useState } from "react";
import "../App.css";

const Hex = ({ index, arabicLetters }) => {
  const [color, setColor] = useState("bg-gray-500");

  const numbers = [1, 3, 5, 8, 10, 12, 19, 26, 33, 15, 22, 29, 17, 24, 31];
  const handleClick = () => {
    if (color === "bg-gray-500") {
      setColor("bg-red-500"); // Change to green
    } else if (color === "bg-red-500") {
      setColor("bg-green-500"); // Change to blue
    } else {
      setColor("bg-gray-500"); // Change back to red
    }
  };

  return numbers.includes(index) ? (
    <div className={`${color} hexagon mt-6 select-none `} onClick={handleClick}>
      <p>
        {arabicLetters}

      </p>
    </div>
  ) : (
    <div className={`${color} hexagon select-none `} onClick={handleClick}>
      <p>
        {arabicLetters}
 
      </p>
    </div>
  );
};

export default Hex;
