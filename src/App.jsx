import React, { useState, useEffect } from "react";
import Hex from "./components/hex";
import OpenAI from "openai";
import { Confetti } from "./Confetti";
import { Footer } from "./components/Footer";
const apiKey = import.meta.env.VITE_SOME_KEY;
const BASE_URL=import.meta.env.VITE_URL_KEY
const MODEL = import.meta.env.MODEL_KEY 

const openai = new OpenAI({
  baseURL: BASE_URL,
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});
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
  const [Btn, setBtn] = useState(false);
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
    const timeout = 300000; // 5 دقائق
  
    // إعداد مهلة
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(
          new Error("انتهت المهلة، لم يتم الحصول على استجابة في الوقت المحدد.")
        );
      }, timeout)
    );
  
    // إعداد الطلب للمودل
    const prompt = `
  أنت مساعد ذكي. سيتم تزويدك بحرف عربي.
  مهمتك هي:
  1. اختيار كلمة عربية تبدأ بهذا الحرف (تجاهل "ال" التعريف).
  2. إنشاء سؤال عام تكون هذه الكلمة إجابته.
  3. إعادة النتيجة بصيغة JSON فقط، ولا شيء غير ذلك.
  
  مثال:
  {
    "question": "ما هو عكس الملح؟",
    "answer": "السكر"
  }
  
  الحرف هو: "${letter}"
  `;
  
    const fetchQuestion = openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that responds only in valid JSON format."
        },
        {
          role: "user",
          content: prompt.trim()
        }
      ],
      signal: controller.signal,
    });
  
    try {
      const completion = await Promise.race([fetchQuestion, timeoutPromise]);
      setIsLoading(false);
  
      let responseText = completion.choices[0].message.content.trim();
  
      // تنظيف Markdown و LaTeX format
      responseText = responseText
      .replace(/^```json\s*/i, "") 
      .replace(/^```/, "")         
      .replace(/```$/, "")       
      .replace(/\\boxed\s*{/, "") 
      .replace(/}$/, "")         
      .trim();
  
      // تأكد أن النص يبدأ بـ { وينتهي بـ }
      if (!responseText.startsWith("{")) {
        responseText = `{${responseText}}`;
      }
  
      console.log("النص النهائي:", responseText);
  
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
    setRedHex([]);
    setGreenHex([]);
    setOrangeHex([]);
    setBtn(false);
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
    setBtn(false);
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
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer min-w-fit"
          onClick={() => generateQuestionFromLetter(orangeHex[1])}
        >
          ابحث عن سؤالًا
        </button>
      ))
    : null;
  let disquestion;
  question
    ? (disquestion = (
        <div className="text-white flex gap-4 justify-center items-center max-md:scale-75">
          <button
            className="bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer min-w-fit"
            onClick={handleDisplayAnswer}
          >
            أظهر الاجابة
          </button>
          {answerDiv}
          <p className="min-w-fit">{question}</p>
          <button
            className="bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer min-w-fit"
            onClick={deleteQuestion}
          >
            حذف السؤال
          </button>
        </div>
      ))
    : null;

  let loadingIcon;
  isLoading
    ? (loadingIcon = <div className="text-white text-xl font-serif">

    
    <span className="inline-flex space-x-1">
    <span className="animate-bounce [animation-delay:.1s]">
      Loading
    </span> 
  <span className="animate-bounce [animation-delay:.1s]">.</span>
  <span className="animate-bounce [animation-delay:.2s]">.</span>
  <span className="animate-bounce [animation-delay:.3s]">.</span>
</span>
    
    </div>)
    : null;

  return (
    <div className="xx max-md:scale-75 md:scale-90 flex flex-col gap-4 top-8 h-screen">
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
      <div className="flex justify-center items-center gap-2 text-center max-md:scale-75">
        <button
          onClick={assignLettersToHexagons}
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer min-w-fit"
        >
           ترتيب الحروف
        </button>
        <button
          onClick={refresh}
          className="mt-12 bg-blue-500 py-2 rounded-3xl text-xl text-white px-4 cursor-pointer  min-w-fit"
        >
          إعادة اللعبة
        </button>
        {askButton}
      </div>
      <div className=" ml-[10%] flex justify-center items-center w-full">
        <Confetti Btn={Btn} />
      </div>
      <Footer/>
    </div>
  );
};

export default App;
