const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const { generateCaption } = require("../service/ai.service");

function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://gidieon-ai-assistant-1.onrender.com",
      ],
      credentials: true,
    },
  });

 
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      if (!cookies.token) return next(new Error("No token"));

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      socket.user = await userModel.findById(decoded.id);
      if (!socket.user) return next(new Error("User not found"));

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.user._id.toString());

    socket.on("ai-message", async ({ chat, message }) => {
      try {
     
        const userText =
          typeof message === "string" ? message.trim() : "";

        if (!userText) {
          socket.emit("ai-response-error", {
            message: "Empty message",
          });
          return;
        }

       
        let chatId = chat;
        if (!chatId) {
          const newChat = await chatModel.create({
            user: socket.user._id,
            title: userText.slice(0, 30),
          });
          chatId = newChat._id;
        }

      
        await messageModel.create({
          chat: chatId,
          user: socket.user._id,
          content: userText,
          role: "user",
        });

       const history = await messageModel
  .find({ chat: chatId, role: "user" })
  .sort({ createdAt: 1 })
  .limit(10)
  .lean();


          const systemPrompt = `
You are an AI assistant named Gideon.
You were created by Abhilash Tiwari.

Rules:
- Always remember the your creator's name is Abhilash Tiwari
- If asked who created you, answer: "I was created by Abhilash Tiwari."
- If asked about the creator, refer to them as Abhilash Tiwari
- Do NOT invent creators or users
- If you do not know something, say you do not know
- Be concise, clear, and helpful
`;

        const messagesForAI = [
          {
            role: "system",
            content:systemPrompt,
          },
          ...history
            .filter((m) => typeof m.content === "string")
            .map((m) => ({
              role: m.role === "model" ? "assistant" : "user",
              content: m.content,
            })),
        ];

     
        const aiResponse = await generateCaption(messagesForAI);

        await messageModel.create({
          chat: chatId,
          user: socket.user._id,
          content: aiResponse,
          role: "model",
        });

       
        socket.emit("ai-response", {
          content: aiResponse,
          chat: chatId,
        });
      } catch (err) {
        console.error("❌ AI ERROR:", err.message);

        socket.emit("ai-response-error", {
          message: "AI failed to respond",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected");
    });
  });
}

module.exports = setupSocketServer;
