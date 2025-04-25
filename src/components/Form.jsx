import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/form.css";
import "../app.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "تسجيل دخول" : "تسجيل جديد";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      console.log({ username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
        location.reload();
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black rubik">
      <div className="w-full max-w-md px-6 py-8 bg-gray-800 rounded-lg shadow-lg text-white">
        <h1 className="text-4xl mb-8 font-bold text-center">لعبة حروف و ألوف</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="أسم المستخدم"
            autoComplete="on"
          />
          <input
            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoComplete="on"
          />
          {loading && (
            <div className="text-center text-indigo-400 font-bold">جاري التحميل...</div>
          )}
          <button
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            type="submit"
          >
            {name}
          </button>
        </form>

        <div className="mt-8 text-center text-white">
          <p className="text-xl font-bold mb-4">ميزات اللعبة:</p>
          <div className="space-y-3 text-lg font-medium">
            <div className="flex items-center justify-center gap-2">
              <span className="text-indigo-400">✔️</span>
              <span>اسئلة متجددة وحصرية</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-indigo-400">✔️</span>
              <span>فوق 2000 سؤال</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-indigo-400">✔️</span>
              <span>اشتراك مدى الحياة</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-2xl font-extrabold text-yellow-400 mb-4">
              سعر اللعبة فقط: <span className="text-white">11.99 ريال</span>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              احصل على اشتراك مدى الحياة مع أكثر من 2000 سؤال متجددة وحصرية!
            </p>
            <a
              href="https://wa.me/966508559192"
              className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            >
              اشترِ الآن عبر الواتساب
            </a>
            <div className="mt-6 text-sm text-gray-300">
              <span>🌟 اشتراك مدى الحياة - لا يوجد تجديد شهري 🌟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
