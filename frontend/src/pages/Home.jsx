import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef(null);
   const [isRecording, setIsRecording] = useState(false);
  const { handleSendMessages, inputValue, setInputValue, messages, loading, activeChatId, } = useAppContext()

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

textarea.style.height = "auto";
textarea.style.height = `${Math.min(textarea.scrollHeight, 9 * 24)}px`;

  }, [inputValue]);



const handleVoiceInput = ()=>{
  if (!("webkitSpeechRecognition" in window)) {
  toast.error("Your browser doesn't support speech recognition!");
  return;
}


const recognition = new window.webkitSpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

recognition.onstart = () => {
  toast.info("🎙 Listening... Speak now", { autoClose: 3000 });
  setIsRecording(true)
};
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setInputValue((prev) => prev + (prev ? " " : "") + transcript);
  toast.success(" Voice converted to text");
  setIsRecording(false)
};

 recognition.onerror = (event) => {
    console.error("Voice error:", event.error);
    toast.error("Voice recognition failed");
    setIsRecording(false)
  };

  recognition.start();

}

  return (

    <div className="w-full h-screen flex bg-[url('/aiBg.png')] bg-center bg-cover"
    >


      {/* Sidebar imported */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      { /*chat Section*/}

      <div className="w-full h-screen text-black flex flex-col items-center bg-black/50 backdrop-blur-xs ">

        <header className='w-full shadow-lg p-4 flex items-center gap-5 bg-zinc-800/10 backdrop-blur-lg '
        >
          <i className="ri-menu-line text-xl text-white md:hidden cursor-pointer m-1"
            onClick={() => setIsOpen(!isOpen)}></i> <h1 className='text-2xl text-white'> Gideon </h1>
        </header >


        <div className=" md:w-7/9  lg:w-7/10 max-w-4xl w-full flex-1 p-4 flex flex-col overflow-y-auto ">

          <div className=' flex-1 p-4 space-y-3 flex flex-col overflow-y-auto text-white relative overflow-hidden'
          >

            {

              messages.map((message, i) => (<div key={i} className={`p-2 px-5 rounded-lg ${message.type === 'user' ? 'align-self-end bg-white/50' : 'align-self-start bg-zinc-800/80 '}  backdrop-blur-2xl shadow-inner shadow-black`}>{message.content}</div>))

            }
            {
              loading && <div className="p-2 px-3 rounded bg-gray-900 backdrop-blur-xl"> <i className="ri-loader-2-line animate-spin inline-block"></i> typing...</div>
            }

            <div ref={messagesEndRef} />
          </div>


          <div className=' w-full border border-gray-50/30 p-2 px-2 sm:px-5 md:py-4 md:px-8  rounded-3xl mx-auto flex gap-3 shadow-xs shadow-amber-50/40 bg-slate-900/20 backdrop-blur-2xl items-center'
          >

            <div className='flex flex-1 rounded-3xl outline-none bg-white'>
            <textarea
              type="text"
               ref={textareaRef}
              onChange={(e) =>
                setInputValue(e.target.value)
}
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessages();
                }
              }}
              rows={1}
              placeholder="Ask anything..."
              className="custom-scroll flex-1 resize-none whitespace-pre-wrap break-words leading-relaxed 
             p-2 px-3  text-lg
             rounded-3xl outline-none bg-white relative "
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className=" text-xl p-2 cursor-pointer text-zinc-700  active:scale-105 rounded-full mr-2 "
            >
             {isRecording? <i className={`ri-mic-fill ${isRecording && "text-red-500 animate-pulse"}`}></i>:<i className='ri-mic-off-line'></i>} 
            </button> </div>
            <button className={` w-12 h-12 border border-gray-600  p-2 px-4 text-2xl cursor-pointer text-white bg-[#27323e3d]  hover:bg-[#262d35bb] hover:shadow-inner active:scale-95 rounded-full flex justify-center items-center ${!inputValue.trim() ? "bg-[#3a3b3b] cursor-not-allowed" : ""}`}
              disabled={!inputValue.trim()}
              onClick={handleSendMessages}>
              <i className="ri-arrow-up-line"></i></button>
          </div>

        </div>

      </div>


    </div>
  )
}

export default Home
