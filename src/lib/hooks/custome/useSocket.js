// hooks/useSocket.js
// Live sync between admin actions and frontend resources page
// Import this in any admin page that should react to live events

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { SOCKET_ORIGIN } from "@/lib/api/config";

let _socket = null;

function getSocket() {
  if (!_socket) {
    const user = (() => { try { return JSON.parse(sessionStorage.getItem("fameo_user") || "null"); } catch { return null; } })();
    _socket = io(SOCKET_ORIGIN, {
      auth: { user },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
  }
  return _socket;
}

/**
 * useSocket(handlers)
 * handlers = { "topic:published": fn, "topic:archived": fn, ... }
 */
export function useSocket(handlers = {}) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const socket = getSocket();
    const entries = Object.entries(handlersRef.current);
    entries.forEach(([event, fn]) => socket.on(event, fn));
    return () => entries.forEach(([event, fn]) => socket.off(event, fn));
  }, []);

  return getSocket();
}

export function emitAdmin(event, data) {
  getSocket()?.emit(event, data);
}