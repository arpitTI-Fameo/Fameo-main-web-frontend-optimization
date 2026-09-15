import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getRoomsAction,
  getMessagesAction,
  dMRoomAction,
  groupRoomAction,
  messageUploadAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const chatKeys = {
  all: () => ['chat'],
  rooms: () => [...chatKeys.all(), 'rooms'],
  messages: (rid) => [...chatKeys.all(), 'messages', rid],
};


export const useRooms = (opts = {}) => useQuery({

  queryKey: chatKeys.rooms(),
  queryFn: async () => {
    const response = await getRoomsAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useMessages = (rid, opts = {}) => useQuery({

  queryKey: chatKeys.messages(rid),
  queryFn: async () => {
    const response = await getMessagesAction(rid);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(rid),
  ...opts,
});

export const useDMRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await dMRoomAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [chatKeys.rooms()],
  ...opts,
});

export const useGroupRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await groupRoomAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [chatKeys.rooms()],
  ...opts,
});

export const useMessageUploadMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await messageUploadAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});
