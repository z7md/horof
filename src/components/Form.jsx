import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/form.css"
import {Footer} from "./Footer"
import "../app.css"
import { FaWhatsapp } from "react-icons/fa";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "تسجيل دخول" : "Register"
    const handleSubmit = async(e) => {
        setLoading(true)
        e.preventDefault()

        try{
            const res = await api.post(route,{username,password})
            console.log({username,password})
            if (method==="login"){
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
                navigate("/")
                location.reload();
            }else{
                navigate("/login") 
            }
        }catch(error){
            alert(error)
        }finally {
            setLoading(false)
        }

    }
    return <div className="rubik"><form onSubmit={handleSubmit} className="form-container">
    <h1 className="text-4xl mb-10 font-bold">لعبة حروف و ألوف</h1>
        <h1 className="text-2xl mb-2">
            {name} 

        </h1>
        <input className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="أسم المستخدم"
            autoComplete="on"
        />

        <input className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoComplete="on"
        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>

    <p className="text-center font-bold text-2xl">لشراء اللعبة يرجى التواصل عبر الواتساب بالأسفل </p>
    <div className="text-center m-4 text-2xl">سعر اللعبة <span className="text-green-500 font-bold font-stretch-105%">11.99 ريال</span> </div>
    <div className="max-w-5xl mx-auto px-4 flex justify-center items-center gap-8">
            
             <a href="https://wa.me/966508559192" className="opacity-70 hover:opacity-100 cursor-pointer text-white"><FaWhatsapp className="size-12" /></a>

         </div>
    </div>
}

export default Form