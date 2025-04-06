import React, { useState, useEffect } from "react";
import Hex from "./components/hex";
import OpenAI from "openai";
import { Confetti } from "./Confetti";
let x = import.meta.env.VITE_SOME_KEY;
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: x,
  dangerouslyAllowBrowser: true,
});
console.log(x);
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
  const [Btn,setBtn] = useState(false);
  const [redHex, setRedHex] = useState([]);
  const [orangeHex, setOrangeHex] = useState([]);
  const [greenHex, setGreenHex] = useState([]);
  const [hexData, setHexData] = useState(new Array(35).fill(""));
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate random letters for each hexagon
  async function generateQuestionFromLetter(letter) {
    setIsLoading(true);
    console.log(letter);
    const controller = new AbortController();
    const timeout = 300000;

    // إعداد مهلة
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        controller.abort(); // يوقف الطلب
        reject(
          new Error("انتهت المهلة، لم يتم الحصول على استجابة في الوقت المحدد.")
        );
      }, timeout)
    );

    // الطلب من OpenAI
    const fetchQuestion = openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: `
  أنت مساعد ذكي وظيفتك إنشاء سؤال عام مع إجابته.
  يجب أن تبدأ الإجابة بالحرف "${letter}" (مع تجاهل "ال" التعريف).
  أجب بصيغة JSON فقط، بدون أي شرح أو رموز إضافية.
  مثال صحيح:
  {
    "question": "ما هو عكس الملح؟",
    "answer": "السكر"
  }
  `,
        },
        {
          role: "user",
          content: letter,
        },
      ],
      signal: controller.signal,
    });

    try {
      const completion = await Promise.race([fetchQuestion, timeoutPromise]);
      setIsLoading(false);
      let responseText = completion.choices[0].message.content.trim();

      // تنظيف الرد
      responseText = responseText
        .replace(/\\boxed\s*{/, "")
        .replace(/}$/, "")
        .trim();
      if (!responseText.startsWith("{")) {
        responseText = `{${responseText}}`;
      }
      console.log(responseText);

      const data = JSON.parse(responseText);
      const question = data.question;
      const answer = data.answer;

      console.log("السؤال:", question);
      console.log("الإجابة:", answer);
      setQuestion(question);
      setAnswer(answer);
    } catch (error) {
      setIsLoading(false);
      console.error("🚫 خطأ:", error.message);
    }
  }

  const handleDisplayAnswer = () => {
    setDisplayAnswer((prev) => !prev); // يقلب الحالة
  };
  const deleteQuestion = () => {
    setAnswer("");
    setQuestion("");
    setDisplayAnswer(false);
  };

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
  const refresh = () => {
    setRedHex([]);
    setGreenHex([]);
    setOrangeHex([]);
  };
  useEffect(() => {
    assignLettersToHexagons();
  }, []); // Empty dependency array means this runs only once on mount
  let answerDiv;
  displayAnswer
    ? (answerDiv = <p>{answer}</p>)
    : (answerDiv = <p className="hidden">{answer}</p>);
  let askButton;
  orangeHex[0]
    ? (askButton = (
        <button
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer"
          onClick={() => generateQuestionFromLetter(orangeHex[1])}
        >
          ابحث عن سؤالًا
        </button>
      ))
    : null;
  let disquestion;
  question
    ? (disquestion = (
        <div className="text-white flex gap-4 justify-center items-center">
          <button
            className="bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer"
            onClick={handleDisplayAnswer}
          >
            أظهر الاجابة
          </button>
          {answerDiv}
          <p>{question}</p>
          <button
            className="bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer"
            onClick={deleteQuestion}
          >
            حذف السؤال
          </button>
        </div>
      ))
    : null;

  let loadingIcon;
  isLoading
    ? (loadingIcon = <div className="text-white">Loading ...</div>)
    : null;

  return (
    <div className="xx flex flex-col gap-4 top-8 h-screen">
      {loadingIcon}
      {disquestion}
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
              orangeHex={orangeHex}
              setOrangeHex={setOrangeHex}
              setBtn={setBtn}
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
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer"
        >
          إعادة ترتيب الحروف
        </button>
        <button
          onClick={refresh}
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer"
        >
          إعادة اللعبة
        </button>
        {askButton}
      </div>
      <div className=" ml-[10%]flex justify-center items-center w-full">
              <Confetti  Btn={Btn}/>
      </div>

    </div>
  );
};

export default App;
