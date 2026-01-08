require("dotenv").config()
const http = require("http")
const app = require("./src/app");
const connectDB = require("./src/db/db");
const setupSocketServer = require("./src/socket/socket.server")
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app)
setupSocketServer(httpServer)
connectDB();

httpServer.listen(PORT,()=>{console.log(`server is running on port 3000`)})