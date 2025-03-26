// import { useState, useEffect, useRef, useCallback } from "react";

// /**
//  * useWebSockets - A custom hook for managing WebSocket connections.
//  * 
//  * @param {string} url - The WebSocket server URL.
//  * @param {function} onMessage - Callback to handle incoming messages.
//  * @param {boolean} autoReconnect - Whether to auto-reconnect on disconnect.
//  * @param {number} reconnectInterval - Reconnection attempt interval in ms.
//  */
// const useWebSockets = ({
//   url,
//   onMessage,
//   autoReconnect = true,
//   reconnectInterval = 5000,
// }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [lastMessage, setLastMessage] = useState(null);
//   const socketRef = useRef(null);
//   const reconnectRef = useRef(null);

//   /**
//    * Establish WebSocket connection
//    */
//   const connect = useCallback(() => {
//     if (socketRef.current) return; // Avoid multiple connections

//     console.log("🔌 Connecting to WebSocket:", url);
//     const ws = new WebSocket(url);

//     ws.onopen = () => {
//       console.log("✅ WebSocket Connected!");
//       setIsConnected(true);
//       clearTimeout(reconnectRef.current);
//     };

//     ws.onmessage = (event) => {
//       console.log("📩 Received Message:", event.data);
//       setLastMessage(event.data);
//       if (onMessage) onMessage(event.data);
//     };

//     ws.onclose = () => {
//       console.log("❌ WebSocket Disconnected.");
//       setIsConnected(false);
//       socketRef.current = null;

//       if (autoReconnect) {
//         console.log(`🔄 Reconnecting in ${reconnectInterval / 1000}s...`);
//         reconnectRef.current = setTimeout(connect, reconnectInterval);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("⚠️ WebSocket Error:", error);
//       ws.close(); // Close on error to trigger reconnect
//     };

//     socketRef.current = ws;
//   }, [url, onMessage, autoReconnect, reconnectInterval]);

//   /**
//    * Send a message through WebSocket
//    */
//   const sendMessage = useCallback((message) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       console.log("📤 Sending Message:", message);
//       socketRef.current.send(JSON.stringify(message));
//     } else {
//       console.warn("⚠️ WebSocket not connected. Message not sent.");
//     }
//   }, []);

//   /**
//    * Close WebSocket connection
//    */
//   const disconnect = useCallback(() => {
//     if (socketRef.current) {
//       console.log("🔌 Closing WebSocket...");
//       socketRef.current.close();
//       socketRef.current = null;
//     }
//   }, []);

//   // Establish WebSocket connection on mount
//   useEffect(() => {
//     connect();
//     return () => disconnect(); // Cleanup on unmount
//   }, [connect, disconnect]);

//   return { isConnected, lastMessage, sendMessage, disconnect };
// };

// export default useWebSockets;
