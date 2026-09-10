'use client';
// hooks/useCommunity.js
// SWR-based hooks for all community data — clean API for page components

import { useState, useEffect, useCallback, useRef } from 'react';
import * as svc from '@/services/community.service';

// ── Generic fetcher hook ──────────────────────────────────────────────────────
function useFetch(fetcher, deps = []) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

// ── FEED ─────────────────────────────────────────────────────────────────────
export function useFeed(tab = 'foryou') {
  const [posts, setPosts]     = useState([]);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset when tab changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    svc.getFeed(tab, 1).then(res => {
      const items = Array.isArray(res) ? res : res?.data || [];
      setPosts(items);
      setHasMore(items.length >= 20);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tab]);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const res  = await svc.getFeed(tab, next).catch(() => null);
    const items = res ? (Array.isArray(res) ? res : res?.data || []) : [];
    setPosts(prev => [...prev, ...items]);
    setPage(next);
    setHasMore(items.length >= 20);
    setLoadingMore(false);
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 } : p));
    svc.toggleLike(postId).catch(() => {
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 } : p));
    });
  };

  const toggleSave = (postId) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, saved: !p.saved } : p));
    svc.toggleSave(postId).catch(() => {
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, saved: !p.saved } : p));
    });
  };

  return { posts, loading, loadingMore, hasMore, loadMore, toggleLike, toggleSave };
}

// ── SPACES ────────────────────────────────────────────────────────────────────
export function useSpaces() {
  const { data, loading, refetch } = useFetch(() => svc.getSpaces());

  const join = async (id) => {
    await svc.joinSpace(id);
    refetch();
  };
  const leave = async (id) => {
    await svc.leaveSpace(id);
    refetch();
  };

  return { spaces: data || [], loading, join, leave, refetch };
}

// ── SPACE FEED ────────────────────────────────────────────────────────────────
export function useSpaceFeed(spaceId, filter = 'latest') {
  const { data, loading, refetch } = useFetch(
    () => svc.getSpaceFeed(spaceId, filter),
    [spaceId, filter]
  );
  return { posts: Array.isArray(data) ? data : data?.data || [], loading, refetch };
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export function useNotifications() {
  const [notifs, setNotifs]     = useState([]);
  const [unread, setUnread]     = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    svc.getNotifications().then(res => {
      const items = Array.isArray(res) ? res : res?.data || [];
      setNotifs(items);
      setUnread(items.filter(n => !n.read).length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await svc.markAllNotifsRead();
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return { notifs, unread, loading, markAllRead };
}

// ── TOP CREATORS ──────────────────────────────────────────────────────────────
export function useTopCreators(period = 'week') {
  return useFetch(() => svc.getTopCreators(period), [period]);
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
export function useEvents(filter = 'upcoming') {
  return useFetch(() => svc.getEvents(filter), [filter]);
}

export function useLiveEvent() {
  return useFetch(() => svc.getLiveEvent(), []);
}

export function useEventQA(eventId) {
  const { data, loading, refetch } = useFetch(() => svc.getQA(eventId), [eventId]);

  const submit = async (question) => {
    await svc.submitQuestion(eventId, question);
    refetch();
  };

  return { qa: Array.isArray(data) ? data : [], loading, submit, refetch };
}

// ── FEEDBACK ─────────────────────────────────────────────────────────────────
export function useSubmissions(filter = 'reel') {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setLoading(true);
    svc.getSubmissions(filter, 1).then(res => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setItems(data);
      setHasMore(data.length >= 10);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter]);

  return { items, loading, hasMore };
}

// ── USER STATS ────────────────────────────────────────────────────────────────
export function useUserStats(userId) {
  return useFetch(() => userId ? svc.getUserStats(userId) : Promise.resolve(null), [userId]);
}

export function useUserPosts(userId) {
  return useFetch(() => userId ? svc.getUserPosts(userId) : Promise.resolve([]), [userId]);
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const show = useCallback((msg, type = 'info') => {
    if (typeof window !== 'undefined') {
      window.showToast?.(msg, type);
    }
  }, []);
  return show;
}

// ── REPORTS (admin) ───────────────────────────────────────────────────────────
export function useReports(status = 'pending') {
  return useFetch(() => svc.getReports(status), [status]);
}

// ── PODCAST ───────────────────────────────────────────────────────────────────
export function usePodcastShows(page = 1) {
  return useFetch(() => svc.getPodcastShows(page), [page]);
}

export function useEpisodes(showId) {
  return useFetch(() => showId ? svc.getEpisodes(showId) : Promise.resolve([]), [showId]);
}

// ── CHAT ROOMS ────────────────────────────────────────────────────────────────
export function useChatRooms() {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const totalUnread = rooms.reduce((a, r) => a + (r.unreadCount || 0), 0);

  useEffect(() => {
    svc.getMyRooms().then(res => {
      setRooms(Array.isArray(res) ? res : res?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { rooms, loading, totalUnread };
}