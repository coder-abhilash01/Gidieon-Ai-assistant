
const express = require("express");
const chatRoutes = require("./routes/chat.routes")
const authRoutes = require("../src/routes/auth.routes");
const cookieParser = require("cookie-parser")
const cors = require('cors')
const app = express();

app.use(cors({
    origin: ["http://localhost:5173",
    "https://gidieon-ai-assistant-1.onrender.com"],
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())
app.use("/auth",authRoutes)
app.use("/api/chats", chatRoutes)



module.exports = app;