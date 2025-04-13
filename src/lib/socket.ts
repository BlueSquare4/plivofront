// @/lib/socket.js
import { io } from "socket.io-client";

const socket = io("https://plivoback.onrender.com");  // <— make sure this matches your ASGI server
export default socket;
