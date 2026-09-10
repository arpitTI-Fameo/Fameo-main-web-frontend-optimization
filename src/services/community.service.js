// services/community.service.js — Full Fameo Community + Events + Chat + Podcast API layer

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fameo_token') ||
    document.cookie.match(/fameo_token=([^;]+)/)?.[1] || null;
}

async function req(method, path, body = null, isForm = false) {
  const token = getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
  };
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    ...(body ? { body: isForm ? body : JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json.data ?? json;
}

const get    = (p)          => req('GET',    p);
const post   = (p, b, f)    => req('POST',   p, b, f);
const patch  = (p, b)       => req('PATCH',  p, b);
const del    = (p)          => req('DELETE', p);

// SPACES
export const getSpaces          = ()           => get('/community/spaces');
export const joinSpace          = (id)         => post(`/community/spaces/${id}/join`);
export const leaveSpace         = (id)         => post(`/community/spaces/${id}/leave`);
export const getSpaceFeed       = (id,f,pg=1)  => get(`/community/spaces/${id}/posts?filter=${f||'latest'}&page=${pg}&limit=20`);
export const getSpaceMods       = (id)         => get(`/community/spaces/${id}/moderators`);
export const getTopContributors = (id)         => get(`/community/spaces/${id}/top-contributors`);

// FEED
export const getFeed = (tab='foryou',pg=1,lim=20) => get(`/community/feed?tab=${tab}&page=${pg}&limit=${lim}`);

// POSTS
export const createPost  = (data) => post('/community/posts', data);
export const getPost     = (id)   => get(`/community/posts/${id}`);
export const deletePost  = (id)   => del(`/community/posts/${id}`);
export const toggleLike  = (id)   => post(`/community/posts/${id}/like`);
export const toggleSave  = (id)   => post(`/community/posts/${id}/save`);

// COMMENTS
export const getComments       = (pid,pg=1) => get(`/community/posts/${pid}/comments?page=${pg}&limit=30`);
export const addComment        = (pid,data) => post(`/community/posts/${pid}/comments`, data);
export const deleteComment     = (id)       => del(`/community/comments/${id}`);
export const toggleCommentLike = (id)       => post(`/community/comments/${id}/like`);

// REPORTS
export const reportContent = (data)         => post('/community/reports', data);
export const getReports    = (st,pg=1)      => get(`/community/reports?status=${st||'pending'}&page=${pg}&limit=20`);
export const actionReport  = (id,data)      => patch(`/community/reports/${id}/action`, data);

// FEEDBACK
export const getSubmissions    = (f='reel',pg=1) => get(`/community/feedback/submissions?filter=${f}&page=${pg}&limit=10`);
export const getSubmission     = (id)             => get(`/community/feedback/submissions/${id}`);
export const createSubmission  = (fd)             => post('/community/feedback/submissions', fd, true);
export const submitReview      = (id,data)        => post(`/community/feedback/submissions/${id}/reviews`, data);
export const setBrandReadiness = (id,data)        => patch(`/community/feedback/submissions/${id}/brand-readiness`, data);

// FOLLOW / BLOCK
export const toggleFollow = (uid) => post(`/community/users/${uid}/follow`);
export const blockUser    = (uid) => post(`/community/users/${uid}/block`);

// USER
export const getUserStats = (uid)      => get(`/community/users/${uid}/stats`);
export const getUserPosts = (uid,pg=1) => get(`/community/users/${uid}/posts?page=${pg}&limit=20`);

// SEARCH
export const search = (q) => get(`/community/search?q=${encodeURIComponent(q)}`);

// RECOGNITION
export const getTopCreators = (period='week') => get(`/community/recognition/top?period=${period}&limit=5`);

// NOTIFICATIONS
export const getNotifications  = (pg=1) => get(`/community/notifications?page=${pg}&limit=10`);
export const markAllNotifsRead = ()     => post('/community/notifications/read-all');

// EVENTS
export const getEvents          = (f='upcoming',pg=1) => get(`/events?filter=${f}&page=${pg}&limit=12`);
export const getLiveEvent       = ()                   => get('/events/live');
export const getEventById       = (id)                 => get(`/events/${id}`);
export const getRoomToken       = (id,role='listener') => get(`/events/${id}/room?role=${role}`);
export const getQA              = (id)                 => get(`/events/${id}/qa`);
export const submitQuestion     = (id,question)        => post(`/events/${id}/qa`, { question });
export const getReplay          = (id)                 => get(`/events/${id}/replay`);
export const getEventDiscussion = (id,pg=1)            => get(`/events/${id}/discussion?page=${pg}`);
export const rsvpEvent          = (id)                 => post(`/events/${id}/rsvp`);
export const cancelRSVP         = (id)                 => del(`/events/${id}/rsvp`);
export const createEvent        = (data)               => post('/events', data);
export const startEvent         = (id)                 => post(`/events/${id}/start`);
export const endEvent           = (id)                 => post(`/events/${id}/end`);

// CHAT
export const getMyRooms   = (pg=1)       => get(`/chat/rooms?page=${pg}&limit=30`);
export const getDMRoom    = (uid)        => post(`/chat/rooms/dm/${uid}`);
export const createGroup  = (data)      => post('/chat/rooms/group', data);
export const getMessages  = (rid,opts)  => get(`/chat/rooms/${rid}/messages?limit=${opts?.limit||50}${opts?.before?`&before=${opts.before}`:''}`);
export const markRoomRead = (rid)       => post(`/chat/rooms/${rid}/read`);

// PODCAST
export const getPodcastShows    = (pg=1)          => get(`/podcast?page=${pg}&limit=12`);
export const getPodcastShow     = (id)             => get(`/podcast/${id}`);
export const getEpisodes        = (sid,pg=1)       => get(`/podcast/shows/${sid}/episodes?page=${pg}&limit=20`);
export const getEpisode         = (id)             => get(`/podcast/episodes/${id}`);
export const toggleEpLike       = (id)             => post(`/podcast/episodes/${id}/like`);
export const toggleEpSave       = (id)             => post(`/podcast/episodes/${id}/save`);
export const getEpComments      = (id,pg=1)        => get(`/podcast/episodes/${id}/comments?page=${pg}&limit=30`);
export const addEpComment       = (id,data)        => post(`/podcast/episodes/${id}/comments`, data);
export const toggleSubscribe    = (id)             => post(`/podcast/${id}/subscribe`);
export const getMySubscriptions = ()               => get('/podcast/me/subscriptions');
export const getSavedEpisodes   = (pg=1)           => get(`/podcast/me/saved?page=${pg}&limit=20`);