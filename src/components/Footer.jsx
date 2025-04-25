import { FaLinkedin } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
export const Footer = () => {
    return <section id="footer" className="flex items-center justify-center bg-none  flex-col gap-2 mt-14">
                <div className="text-white rubik">
                  تواصل مع المطور
            </div>
            <div className="max-w-3xl mx-auto flex justify-between gap-8 ">
            
               <a href="https://www.linkedin.com/in/hamad-almohaimeed/" className="opacity-70 hover:opacity-100  text-white"><FaLinkedin className="size-8"/></a> 
                <a href="https://wa.me/966508559192" className="opacity-70 hover:opacity-100 cursor-pointer text-white"><FaWhatsapp className="size-8" /></a>

            </div>
    </section>
}