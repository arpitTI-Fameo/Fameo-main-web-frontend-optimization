// hooks/useLiveContent.js
// ─────────────────────────────────────────────────────────────
// Drop this hook into the Resources page and any component
// that shows topics/products/settings.
//
// When admin publishes/archives/toggles a feature:
//   admin.service.js → emitToAll("topic:published") 
//   → Socket.io → this hook → React state update → re-render
//   = Learner sees the change WITHOUT page reload ✓
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

let _socket = null;

function getSocket() {
  if (!_socket) {
    _socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { user: JSON.parse(sessionStorage.getItem("fameo_user") || "null") },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
  }
  return _socket;
}

/**
 * useLiveContent()
 * Returns { topics, products, settings, loading }
 * Automatically updates when admin publishes/archives content.
 *
 * Usage:
 *   const { topics, settings, loading } = useLiveContent();
 */
export function useLiveContent() {
  const [topics,   setTopics]   = useState([]);
  const [products, setProducts] = useState({});
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);

  // ── Initial fetch ──────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [topicsRes, productsRes, settingsRes] = await Promise.all([
        fetch("/api/resources/topics?status=published"),
        fetch("/api/resources/products?status=published"),
        fetch("/api/settings"),
      ]);
      const [td, pd, sd] = await Promise.all([topicsRes.json(), productsRes.json(), settingsRes.json()]);
      setTopics(td.data?.topics || []);
      const prodMap = {};
      (pd.data?.products || []).forEach(p => { prodMap[p._id] = p; });
      setProducts(prodMap);
      setSettings(sd.data?.settings || {});
    } catch (e) {
      console.warn("[useLiveContent] fetch failed:", e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Socket.io live updates ─────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    // ★ Topic published by admin → add to list immediately
    socket.on("topic:published", (payload) => {
      // Fetch the full new topic then prepend
      fetch(`/api/resources/topics/${payload.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.data?.topic) {
            setTopics(prev => {
              const exists = prev.some(t => t._id === payload.id);
              if (exists) return prev.map(t => t._id === payload.id ? d.data.topic : t);
              return [d.data.topic, ...prev];
            });
          }
        })
        .catch(() => {});
    });

    // ★ Topic archived → remove from list immediately
    socket.on("topic:archived", ({ id }) => {
      setTopics(prev => prev.filter(t => t._id !== id));
    });

    // ★ Topic updated (title/body changed while published)
    socket.on("topic:updated", ({ id }) => {
      fetch(`/api/resources/topics/${id}`)
        .then(r => r.json())
        .then(d => {
          if (d.data?.topic) {
            setTopics(prev => prev.map(t => t._id === id ? d.data.topic : t));
          }
        })
        .catch(() => {});
    });

    // ★ Topic deleted
    socket.on("topic:deleted", ({ id }) => {
      setTopics(prev => prev.filter(t => t._id !== id));
    });

    // ★ Topic restored from archive
    socket.on("topic:restored", ({ id }) => {
      fetch(`/api/resources/topics/${id}`)
        .then(r => r.json())
        .then(d => {
          if (d.data?.topic) setTopics(prev => [...prev, d.data.topic]);
        })
        .catch(() => {});
    });

    // ★ Product published
    socket.on("product:published", ({ id }) => {
      fetch(`/api/resources/products/${id}`)
        .then(r => r.json())
        .then(d => { if (d.data?.product) setProducts(prev => ({ ...prev, [id]: d.data.product })); })
        .catch(() => {});
    });

    // ★ Product unpublished
    socket.on("product:unpublished", ({ id }) => {
      setProducts(prev => { const next = { ...prev }; delete next[id]; return next; });
    });

    // ★ Feature flags toggled by super admin
    socket.on("settings:updated", ({ features }) => {
      setSettings(prev => ({ ...prev, features: { ...(prev?.features || {}), ...features } }));
    });

    return () => {
      socket.off("topic:published");
      socket.off("topic:archived");
      socket.off("topic:updated");
      socket.off("topic:deleted");
      socket.off("topic:restored");
      socket.off("product:published");
      socket.off("product:unpublished");
      socket.off("settings:updated");
    };
  }, []);

  return { topics, products, settings, loading, refetch: fetchAll };
}

/**
 * useLiveNotifications()
 * Returns real-time notification toasts from admin broadcasts.
 *
 * Usage:
 *   const { notifications } = useLiveNotifications();
 */
export function useLiveNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("notification:new", (notif) => {
      setNotifications(prev => [{ ...notif, id: Date.now(), read: false }, ...prev]);
    });
    return () => socket.off("notification:new");
  }, []);

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return { notifications, markRead };
}