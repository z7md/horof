import React, { useState, useEffect } from "react";
import Hex from "./components/hex";
import OpenAI from "openai";
import { Confetti } from "./Confetti";
import { Footer } from "./components/Footer";
const apiKey = import.meta.env.VITE_SOME_KEY;
const BASE_URL = import.meta.env.VITE_URL_KEY
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
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Function to generate random letters for each hexagon

  const categoriesList = [
    "أطعمة ومشروبات",
    "حيوانات",
    "أماكن",
    "مشاعر",
    "مفاهيم علمية",
    "ألغاز ذكية"
  ];

  const handleCatClick = (category) => {
    if (
      !selectedCategories.includes(category)
    ) {
      setSelectedCategories((prevArray) => [...prevArray, category]);
    }  else {
      setSelectedCategories((prevArray) => prevArray.filter((el) => el !== category));
    }
    console.log(selectedCategories)
  };

  async function generateQuestionFromLetter(letter) {
    setIsLoading(true);
    setAnswer[""]
    setQuestion[""]
    console.log(letter);

    const maxRetries = 3;
    const timeout = 300000; // 5 دقائق

    function isValidAnswer(answer, letter) {
      const cleaned = answer.trim().replace(/^ال/, ""); // Remove "ال" if present
      return cleaned.startsWith(letter);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => {
          controller.abort();
          reject(
            new Error("انتهت المهلة، لم يتم الحصول على استجابة في الوقت المحدد.")
          );
        }, timeout)
      );

      const prompt = `
      أنت مساعد ذكي جدًا، ومتخصص في إنشاء أسئلة عامة ذكية باللغة العربية، بناءً على حرف معين وتصنيف محدد. اتبع التعليمات التالية بدقة شديدة:
      
      ---
      
      📌 أولاً: الشروط الصارمة:
      
      1. ✅ **الإجابة (الكلمة)**:
         - يجب أن تبدأ بالحرف المحدد فقط.
         - يجب أن تكون كلمة عربية معروفة، بدون "ال" التعريف.
      
      2. ✅ **السؤال**:
         - يجب أن تكون صياغته ذكية، واضحة، وله إجابة واحدة فقط (وهي الكلمة).
         - يجب أن يكون من نفس التصنيف المطلوب، وليس عامًا أو عشوائيًا.
      
      3. ✅ **التصنيف**:
         - لا يُسمح باستخدام كلمة لا تنتمي إلى التصنيفات المحددة.
         - لا يُسمح بالخروج عن التصنيفات أو اختراع تصنيف جديد.
      
      4. ✅ **الإخراج يجب أن يكون بصيغة JSON فقط** (بدون أي توضيحات أو كلام خارجي).
      
      ---
      
      🎓 أمثلة ممتازة:
      
      🍽️ أطعمة ومشروبات:
      1. {"category": "أطعمة ومشروبات", "question": "ما هو المشروب الذي يصنع من القهوة ويبدأ بحرف ك؟", "answer": "كابتشينو"}
      2. {"category": "أطعمة ومشروبات", "question": "ما هو الطعام الذي يصنع من الحليب ويبدأ بحرف ج؟", "answer": "جبن"}
      3. {"category": "أطعمة ومشروبات", "question": "ما هو المشروب الغازي المشهور ويبدأ بحرف س؟", "answer": "سفن"}
      4. {"category": "أطعمة ومشروبات", "question": "ما هو الطعام الذي يحبه الكثير ويصنع من البطاطس ويبدأ بحرف ف؟", "answer": "فطيرة"}
      5. {"category": "أطعمة ومشروبات", "question": "ما هو الشيء الأبيض الذي نستخدمه لتحلية الشاي ويبدأ بحرف س؟", "answer": "سكر"}
      
      🐾 حيوانات:
      1. {"category": "حيوانات", "question": "ما هو الحيوان الذي يعيش في الغابة وله أنف طويل؟", "answer": "فيل"}
      2. {"category": "حيوانات", "question": "ما هو الحيوان الذي يزأر ويبدأ بحرف أ؟", "answer": "أسد"}
      3. {"category": "حيوانات", "question": "ما هو الحيوان الذي يبيض ويبدأ بحرف ب؟", "answer": "بطة"}
      4. {"category": "حيوانات", "question": "ما هو الحيوان البحري الكبير ويبدأ بحرف ح؟", "answer": "حوت"}
      5. {"category": "حيوانات", "question": "ما هو الحيوان الذي يحمل منزله على ظهره؟", "answer": "سلحفاة"}
      
      🗺️ أماكن:
      1. {"category": "أماكن", "question": "ما هي الدولة التي تقع في شمال أفريقيا وتبدأ بحرف م؟", "answer": "مغرب"}
      2. {"category": "أماكن", "question": "ما هي المدينة المشهورة بالبيت الحرام؟", "answer": "مكة"}
      3. {"category": "أماكن", "question": "ما هي العاصمة التي تبدأ بحرف ر؟", "answer": "رياض"}
      4. {"category": "أماكن", "question": "ما هي القارة التي تضم مصر ونيجيريا؟", "answer": "أفريقيا"}
      5. {"category": "أماكن", "question": "ما هي الدولة الخليجية التي عاصمتها الدوحة؟", "answer": "قطر"}
      
      😊 مشاعر:
      1. {"category": "مشاعر", "question": "ما هو الشعور الذي ينتاب الإنسان عند خسارة عزيز؟", "answer": "حزن"}
      2. {"category": "مشاعر", "question": "ما هو الشعور الذي يعاكس الغضب؟", "answer": "هدوء"}
      3. {"category": "مشاعر", "question": "ما هو الشعور الذي يدل على السعادة الشديدة؟", "answer": "فرح"}
      4. {"category": "مشاعر", "question": "ما هو الشعور الذي يصيبك عند التوتر والخوف؟", "answer": "قلق"}
      5. {"category": "مشاعر", "question": "ما هو الشعور الذي تحس به عند كرهك لشيء؟", "answer": "اشمئزاز"}
      
      🧠 مفاهيم علمية:
      1. {"category": "مفاهيم علمية", "question": "ما هو اسم العملية التي يتحول فيها الماء إلى بخار؟", "answer": "تبخر"}
      2. {"category": "مفاهيم علمية", "question": "ما هو الجهاز المسؤول عن ضخ الدم في جسم الإنسان؟", "answer": "قلب"}
      3. {"category": "مفاهيم علمية", "question": "ما هو العنصر الكيميائي الذي رمزه O؟", "answer": "أكسجين"}
      4. {"category": "مفاهيم علمية", "question": "ما هو اسم الكوكب الرابع في المجموعة الشمسية؟", "answer": "مريخ"}
      5. {"category": "مفاهيم علمية", "question": "ما هو المصطلح الذي يطلق على انتقال الحرارة بالتوصيل؟", "answer": "توصيل"}
      
      🧩 ألغاز ذكية:
      1. {"category": "ألغاز ذكية", "question": "شيء تمشي عليه لكنه لا يمشي؟", "answer": "أرض"}
      2. {"category": "ألغاز ذكية", "question": "شيء تملكه ويستخدمه الآخرون أكثر منك؟", "answer": "اسم"}
      3. {"category": "ألغاز ذكية", "question": "ما هو الشيء الذي لا يُؤكل في الليل؟", "answer": "فطور"}
      4. {"category": "ألغاز ذكية", "question": "ما هو الشيء الذي كلما زاد نقص؟", "answer": "عمر"}
      5. {"category": "ألغاز ذكية", "question": "ما هو الشيء الذي يسمع بلا أذن ويتكلم بلا لسان؟", "answer": "هاتف"}
      
      ---
      
      ⬇️ الآن، باستخدام نفس الأسلوب تمامًا:
      
      🔠 الحرف هو: **"${letter}"**  
      📂 التصنيفات المختارة: [${selectedCategories.map(c => `"${c}"`).join(", ")}]
      
      🔄 اختر تصنيفًا عشوائيًا من القائمة، وابدأ بإنشاء **سؤال واحد فقط** بجودة مماثلة للأمثلة.
      
      📤 الإخراج بصيغة JSON فقط.

        ***تاكد ان الاجابة صحيحة***
        ***تاكد ان الاجابة صحيحة***
        ***تاكد ان الاجابة صحيحة***
        ***تاكد ان الاجابة صحيحة***
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
        let responseText = completion.choices[0].message.content.trim();

        // تنظيف Markdown و LaTeX format
        responseText = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .replace(/\\boxed\s*{/, "")
          .replace(/}$/, "")
          .trim();

        if (!responseText.startsWith("{")) {
          responseText = `{${responseText}}`;
        }

        console.log("النص النهائي:", responseText);

        const data = JSON.parse(responseText);
        const question = data.question;
        const answer = data.answer;

        if (isValidAnswer(answer, letter)) {
          console.log("✅ محاولة ناجحة:", attempt);
          console.log("السؤال:", question);
          console.log("الإجابة:", answer);
          setQuestion(question);
          setAnswer(answer);
          break;
        } else {
          console.warn(`🚫 محاولة ${attempt}: الكلمة "${answer}" لا تبدأ بالحرف "${letter}"`);
          if (attempt === maxRetries) {
            throw new Error("فشل الحصول على إجابة صحيحة بعد عدة محاولات.");
          }
        }
      } catch (error) {
        if (attempt === maxRetries) {
          setIsLoading(false);
          console.error("🚫 خطأ:", error.message);
        }
      }
    }

    setIsLoading(false);
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
  let categorize;
  orangeHex[0]
    ? categorize = <div className="flex gap-2 text-white justify-center items-center rubik">
      {categoriesList.map(category => (
          selectedCategories.includes(category)?
          <div onClick={()=>handleCatClick(category)} className="p-2 border-white rounded-4xl text-white bg-[#0285ff] min-w-fit  border cursor-pointer">{category}</div>
          :
          <div className="p-2 border-white rounded-4xl text-white border text-center min-w-fit cursor-pointer" onClick={()=>handleCatClick(category)}>{category}</div>
      ))}
    </div> : categorize = <div className="flex gap-2 text-white opacity-0">
      {categoriesList.map(category => (
        

          selectedCategories.includes(category)?
          <div  className="p-2 border-white rounded-4xl text-white bg-[#323232d9] border">{category}</div>
          :
          <div className="p-2 border-white rounded-4xl text-white border">{category}</div>
      ))}
    </div>;
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
    <div className="xx max-md:scale-75 md:scale-90 flex flex-col gap-4 top-8 h-screen rubik">
      {categorize}
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
