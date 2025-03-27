import React from "react";
import "../App.css";

const Hex = ({ index, arabicLetters,setGreenHex,setRedHex,redHex,greenHex }) => {



  const numbers = [1, 3, 5, 8, 10, 12, 19, 26, 33, 15, 22, 29, 17, 24, 31];
  const handleClick = (letter) => {
    if (!redHex.includes(arabicLetters) &&!greenHex.includes(letter)) {
      setRedHex((prevArray) => [...prevArray, letter]);
    } else if (redHex.includes(arabicLetters)) {
      setRedHex((prevArray) => prevArray.filter((el) => el !== letter));
      setGreenHex((prevArray) => [...prevArray, letter]);
    }else{
      setGreenHex((prevArray) => prevArray.filter((el) => el !== letter));
    }
  };
  let hex1 ;
  if(redHex.includes(arabicLetters)){
     hex1 =
    <div className={`bg-red-500 hexagon select-none `} onClick={() => handleClick(arabicLetters)}>
    <p>
      {arabicLetters}

    </p>
  </div>
  }else if(greenHex.includes(arabicLetters)){
    hex1 = 
   <div className={`bg-green-500 hexagon select-none `} onClick={()=>handleClick(arabicLetters)}>
    <p>
      {arabicLetters}

    </p>
  </div>

  }else{
     hex1 = <div className={`bg-gray-500 hexagon  select-none `} onClick={()=>handleClick(arabicLetters)}>
    <p>
      {arabicLetters}

    </p>
  </div>
  }

  return numbers.includes(index) ? (
    <div className="mt-6">{hex1}</div>
  ) : (
    <div  onClick={()=>handleClick(arabicLetters)}>
    {hex1}
    </div>
  );
};

export default Hex;
