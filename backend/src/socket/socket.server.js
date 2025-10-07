const { Server } = require('socket.io');
const { generatecaption, generateVector } = require("../service/ai.service")
const cookie = require("cookie");
const userModel = require('../models/user.model');
const messageModel = require("../models/message.model")
const { createMemory, queryMemory } = require("../service/vector.database")
const jwt = require("jsonwebtoken");
const chatModel = require('../models/chat.model');

function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173","https://gidieon-ai-assistant-1.onrender.com"],
            credentials: true
        }
    })

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("authentication error: no token provided"))
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next()

        } catch (err) { next(new Error("authentication error: invalid token")) }
    })

    io.on("connection", (socket) => {
        console.log("a user connected")

        socket.on("ai-message", async (message) => {
            try {
               
                let chatId = message.chat;

                if (!chatId) {
                    const newChat = await chatModel.create({
                        user: socket.user._id,
                        title: message.message.slice(0, 20) || "New Chat"
                    });
                    chatId = newChat._id;
                }
           


            const [createdMessage, vectors] = await Promise.all([ messageModel.create({
                    chat: chatId,
                    user: socket.user._id,
                    content: message.message,
                    role: "user"
                }),

            generateVector(message.message)
        ])

            

            const memory = await queryMemory({
                queryVector: vectors,
                limit: 3,
                metadata: {userId: socket.user._id}
            })



             await createMemory({vectors,
                messageId:createdMessage._id,
                metadata:{
                    chatId: chatId,
                    userId: socket.user._id,
                    text: message.message
                }}
             )   

            const chatHistory = (await messageModel.find({ chat: chatId }).sort({ createdAt: -1 }).limit(20).lean()).reverse();

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })
            const ltm = [
  {
    role: "user",
    parts: [ {
      text: `
Here are some things you should know from earlier conversations. 
Use them naturally if relevant:

${memory.map(item => item.metadata.text).join("\n")}
`
    }]
  }
]

            const result = await generatecaption([...ltm, ...stm]);

            const resultMessage = await messageModel.create({
                chat: chatId,
                user: socket.user._id,
                content: result,
                role: "model"
            })

            const resultVectors = await generateVector(result);
            await createMemory({
                vectors: resultVectors,
                messageId: resultMessage._id,
                metadata: {
                    chat: chatId,
                    user: socket.user._id,
                    text: result,
                }
            })

            socket.emit('ai-response', {
                content: result,
                chat: chatId
            })


          } catch (err) {
            console.log("error in genrating response!")
            socket.emit("ai-response-error", {
    success: false,
    message: "Error in generating response. Please try again."
  });
            }})

        socket.on('disconnect', () => {
            console.log(" a user disconnected")
        })
    })
}

module.exports = setupSocketServer