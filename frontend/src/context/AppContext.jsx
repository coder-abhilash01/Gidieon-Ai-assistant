import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [title, setTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-auth`, {
          withCredentials: true,
        });
        setIsAuthenticated(res.data.success);
        if (res.data.success) {
          // fetch chats after login
          fetchChats();
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [isAuthenticated]);

    useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          const path = window.location.pathname
           const isOnAuthPage = path === "/login"|| path === "/register";
          if(!isOnAuthPage) {toast.error("Session expired! Please log in again.")};

          setIsAuthenticated(false);
          navigate("/login",{replace:true});
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ✅ create socket once
  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_API_BASE_URL}`, { withCredentials: true });

    socketRef.current.on("ai-response", (msg) => {
      setMessages((prev) => [...prev, { type: "ai", content: msg.content }]);
      setLoading(false);
      getMessages(activeChatId);
    });

    socketRef.current.on("ai-response-error", (err) => {
      if (process.env.NODE_ENV === "development") {
  console.error("AI error:", err);
}

      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(()=>{
    getMessages(activeChatId);
  },[activeChatId])

  // ✅ fetch chats
  const fetchChats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats`, { withCredentials: true });
      const chatsList = res.data.chats.reverse()
      setChats(chatsList);
    
      getMessages(res?.data?.chats[0]?._id)
      setActiveChatId(res?.data?.chats[0]?._id)
      if(chatsList.length===0){setDialogOpen(true)}
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
  console.error("Error fetching chats:", err);
}

    }
  };

  // ✅ new chat
  const handleNewChat = async () => {
    if (!title) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats`,
        { title },
        { withCredentials: true }
      );

  

      const newChat = res.data.chat;
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat._id);
      getMessages(activeChatId)
    } catch (err) {
      console.error("Error creating chat:", err);
      
    }
  };

  // ✅ select chat
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    localStorage.setItem("activeChatId", chatId);
    getMessages(chatId);
  };

  // ✅ get messages
  const getMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats/messages/${chatId}`, {
        withCredentials: true,
      });
      setMessages(
        res.data.messages.map((m) => ({
          type: m.role === "user" ? "user" : "ai",
          content: m.content,
        }))
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ send message
  const handleSendMessages = () => {
    if (!activeChatId) {return setDialogOpen(true)};
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: inputValue }]);

    socketRef.current.emit("ai-message", {
      chat: activeChatId,
      message: inputValue,
    });

    setInputValue("");
    setLoading(true);
  };

  const value = {
    handleNewChat,
    handleSelectChat,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    getMessages,
    handleSendMessages,
    inputValue,
    setInputValue,
    messages,
    setMessages,
    setUser,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
    title,
     setTitle,
     dialogOpen, setDialogOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
