import React, { useEffect } from "react";
import "../App.css";

const Hex = ({
  index,
  arabicLetters,
  setGreenHex,
  setRedHex,
  redHex,
  greenHex,
  orangeHex,
  setOrangeHex,
  setBtn,
}) => {
  const gridGraph = {
    // Index 0 is connected to indices 1, 7, and 8
    1: [2, 8, 9], // Index 1 is connected to indices 0, 2, 8, and 9
    2: [1, 3, 9], // Index 2 is connected to indices 1, 3, 9, and 10
    3: [2, 4, 9, 10, 11], // Index 3 is connected to indices 2, 4, 10, and 11
    4: [3, 5, 11], // Index 4 is connected to indices 3, 5, 11, and 12
    5: [4, 11, 12],
    8: [1, 9, 16, 15], // Index 8 is connected to indices 0, 1, 7, 9, 16, and 17
    9: [1, 2, 3, 10, 16, 8], // Index 9 is connected to indices 1, 2, 8, 10, 17, and 18
    10: [3, 9, 11, 18, 17, 16], // Index 10 is connected to indices 2, 3, 9, 11, 18, and 19
    11: [3, 4, 10, 12, 18, 5], // Index 11 is connected to indices 3, 4, 10, 12, 19, and 20
    12: [5, 11, 18, 19], // Index 12 is connected to indices 4, 5, 11, 13, 20, and 21
    15: [8, 16, 23, 22], // Index 15 is connected to indices 7, 14, 16, 22, 23, and 24
    16: [9, 8, 15, 17, 23, 10], // Index 16 is connected to indices 7, 8, 15, 17, 23, and 24
    17: [10, 23, 16, 18, 24, 25], // Index 17 is connected to indices 8, 9, 16, 18, 24, and 25
    18: [11, 10, 17, 19, 25, 12], // Index 18 is connected to indices 9, 10, 17, 19, 25, and 26
    19: [10, 11, 18, 20, 26, 27], // Index 19 is connected to indices 10, 11, 18, 20, 26, and 27

    22: [30, 15, 23, 29], // Index 22 is connected to indices 14, 15, 23, and 29
    23: [15, 16, 22, 24, 17, 30], // Index 23 is connected to indices 15, 16, 22, 24, 29, and 30
    24: [32, 17, 23, 25, 30, 31], // Index 24 is connected to indices 15, 16, 23, 25, 30, and 31
    25: [18, 17, 24, 26, 19, 32], // Index 25 is connected to indices 16, 17, 24, 26, 31, and 32
    26: [19, 25, 32, 33], // Index 26 is connected to indices 17, 18, 25, 27, 32, and 33

    29: [22, 30], // Index 29 is connected to indices 22, 23, 28, and 30
    30: [23, 24, 29, 31, 22], // Index 30 is connected to indices 23, 24, 29, and 31
    31: [24, 30, 32], // Index 31 is connected to indices 24, 25, 30, and 32
    32: [25, 26, 31, 33, 24], // Index 32 is connected to indices 25, 26, 31, and 33
    33: [26, 32], // Index 33 is connected to indices 26, 27, and 32
  };

  function isConnectedPath(indexes, gridGraph, color) {
    // Define which nodes are start and target nodes
    let startNodes = [1, 2, 3, 4, 5];
    let targetNodes = [29, 30, 31, 32, 33];

    if (color == "green") {
      startNodes = [1, 2, 3, 4, 5];
      targetNodes = [29, 30, 31, 32, 33];
    } else {
      startNodes = [1, 8, 15, 22, 29];
      targetNodes = [5, 12, 19, 26, 33];
    }

    // First check if the array contains at least one start and one target node
    const hasStartNode = indexes.some((index) => startNodes.includes(index));
    const hasTargetNode = indexes.some((index) => targetNodes.includes(index));

    if (!hasStartNode || !hasTargetNode) {
      return false;
    }

    // Create a set for faster lookup
    const indexSet = new Set(indexes);

    // Check connectivity using BFS
    const visited = new Set();
    const queue = [];

    // Initialize queue with any start node present in the input
    for (const node of indexes) {
      if (startNodes.includes(node)) {
        queue.push(node);
        visited.add(node);
        break;
      }
    }

    while (queue.length > 0) {
      const current = queue.shift();

      // If we reached a target node, return true
      if (targetNodes.includes(current)) {
        return true;
      }

      // Get neighbors from the gridGraph
      const neighbors = gridGraph[current] || [];

      for (const neighbor of neighbors) {
        if (indexSet.has(neighbor) && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return false;
  }
  let winner;

  useEffect(() => {
    if (isConnectedPath(greenHex, gridGraph, "green")) {
      setBtn(true);
      console.log("الاخضر فاز");
    } else if (isConnectedPath(redHex, gridGraph, "red")) {
      setBtn(true);
    } else {
      setBtn(false);
      winner;
    }
  }, [redHex, greenHex]);

  const numbers = [1, 3, 5, 8, 10, 12, 19, 26, 33, 15, 22, 29, 17, 24, 31];
  const handleClick = () => {
    if (
      !orangeHex.includes(index) &&
      !redHex.includes(index) &&
      !greenHex.includes(index)
    ) {
      setOrangeHex([index, arabicLetters]);
    } else if (!redHex.includes(index) && !greenHex.includes(index)) {
      setOrangeHex([]);
      setRedHex((prevArray) => [...prevArray, index]);
    } else if (redHex.includes(index)) {
      setRedHex((prevArray) => prevArray.filter((el) => el !== index));
      setGreenHex((prevArray) => [...prevArray, index]);
    } else {
      setGreenHex((prevArray) => prevArray.filter((el) => el !== index));
    }
  };
  let hex1;
  if (orangeHex.includes(index)) {
    hex1 = (
      <div
        className={"bg-[#ffae00] hexagon select-none rubik"}
        onClick={() => handleClick()}
      >
        <p>{arabicLetters}</p>
      </div>
    );
  } else if (redHex.includes(index)) {
    hex1 = (
      <div
        className={"bg-red-500 hexagon select-none rubik"}
        onClick={() => handleClick()}
      >
        <p>{arabicLetters}</p>
      </div>
    );
  } else if (greenHex.includes(index)) {
    hex1 = (
      <div
        className={"bg-green-500 hexagon select-none rubik"}
        onClick={() => handleClick()}
      >
        <p>{arabicLetters}</p>
      </div>
    );
  } else {
    hex1 = (
      <div
        className={"bg-gray-500 hexagon  select-none rubik"}
        onClick={() => handleClick()}
      >
        <p>{arabicLetters}</p>
      </div>
    );
  }

  return numbers.includes(index) ? (
    <div className="mt-6 text-center m-0 p-0">{hex1}</div>
  ) : (
    <div onClick={() => handleClick()} className="text-center m-0 p-0">
      {hex1}
    </div>
  );
};

export default Hex;
