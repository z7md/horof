import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

export const Confetti = ({Btn}) => {
  const [windowDem, setWindowDem] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const detectSize = () => {
    setWindowDem({ width: window.innerWidth, height: window.innerHeight });
  };
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return window.removeEventListener("resize", detectSize);
  });
  return (
    <>{Btn &&<ReactConfetti width={windowDem.width} height={windowDem.height} >مبروووووك</ReactConfetti>}</>
  );
};
