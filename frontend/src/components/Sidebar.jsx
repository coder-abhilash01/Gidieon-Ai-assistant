import { useContext, useEffect, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Profile from './Profile'
import axios from "axios"
import { useAppContext } from '../context/AppContext'
import AppContextProvider from '../context/AppContext'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
const Sidebar = ({ isOpen, setIsOpen }) => {

    const { handleNewChat, handleSelectChat, chats, activeChatId, setTitle, title, dialogOpen, setDialogOpen } = useAppContext();
    const [search, setSearch] = useState("");
    const [inputVisibility, setInputVisibility] = useState(false)
    



    const filterdChats = chats.filter(chat => chat.title.toLowerCase().includes(search.toLowerCase()))

    const handlesearch = () => {
        setInputVisibility(!inputVisibility)
        setIsOpen(true)
        setSearch("")

    }



    return (
        <div className={`h-screen ${isOpen ? "md:w-[300px]" : "w-18"} ${isOpen ? "w-75" : "left-[-100px]"} bg-slate-950 px-4 text-white gap-3 flex flex-col transition-all duration-100 fixed md:static z-10 border border-gray-50/20`}>
            <div className='pt-6 pb-5 px-2 cursor-pointer'>
                <i className="ri-menu-line text-xl "
                    onClick={() => setIsOpen(!isOpen)}></i>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger className='w-full flex  gap-4 hover:bg-zinc-700 px-2 py-2 rounded cursor-pointer'>
                    <i className="ri-add-large-line"></i> {isOpen && <span>New Chat</span>}</DialogTrigger>
                <DialogContent className="bg-white/10 backdrop-blur-2xl text-white">
                    <DialogHeader>
                        <DialogTitle className='text-3xl'> Hlo👋this is Gideon! Your Ai assistant
                         </DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <span>Please create a new chat to start messageing</span>
                    <input type='text'
                        placeholder='enter chat name'
                        className=' p-2 border border-gray-50/20 rounded shadow-inner shadow-black'
                        value={title}
                        maxLength={40}
                        required={true}
                        onChange={(e) => setTitle(e.target.value)} />
                    <button className='px-4 py-2 bg-black text-white w-fit rounded cursor-pointer' onClick={()=>{
                        if(!title.trim())return
                        handleNewChat()
                        setDialogOpen(false)

                        }}>Create</button>
                </DialogContent>
            </Dialog>



            <button className='w-full flex gap-4 hover:bg-zinc-700 px-2 py-2 rounded cursor-pointer'
                onClick={handlesearch}>
                <i className="ri-search-line text-lg "> </i> {isOpen && "Search Chats"}</button>
            {inputVisibility && <input type='text' placeholder='search your chat' className='bg-white/90 p-1 px-3 rounded text-black '
                value={search}
                onChange={(e) => setSearch(e.target.value)} />}

            {isOpen && <div className='mt-2 h-[55vh] overflow-y-auto flex flex-col gap-1 px-1'>
                <h3 className='px-3 text-white/60 '>Chats</h3>
                {filterdChats.map(chat => (

                    <p
                        key={chat._id}
                        onClick={() => handleSelectChat(chat._id)}
                        className={` w-full hover:bg-zinc-800 ${activeChatId === chat._id ? "bg-zinc-800" : ""} p-2 px-3 rounded-lg cursor-pointer`}>{chat.title.length>25 ? chat.title.slice(0,20)+ "..." : chat.title}</p>
                ))}
            </div>}


            <Profile isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default Sidebar