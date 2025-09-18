import { WebSocketServer } from "ws";
import dotenv from "dotenv"
dotenv.config()

const serverESP = new WebSocketServer({port:8086});





export {serverESP};