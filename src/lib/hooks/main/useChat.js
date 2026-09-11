'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { chatKeys } from '@/lib/services/chat/chat.keys';
import {
  dMRoom, getMessages, getRooms, groupRoom, messageUpload,
} from '@/lib/services/chat/chat.client';

export const useRooms = (opts = {}) => useQuery({
  queryKey: chatKeys.rooms(),
  queryFn: getRooms,
  ...opts,
});

export const useMessages = (rid, opts = {}) => useQuery({
  queryKey: chatKeys.messages(rid),
  queryFn: () => getMessages(rid),
  enabled: Boolean(rid),
  ...opts,
});

export const useDMRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: dMRoom,
  invalidate: [chatKeys.rooms()],
  ...opts,
});

export const useGroupRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: groupRoom,
  invalidate: [chatKeys.rooms()],
  ...opts,
});

export const useMessageUploadMutation = (opts = {}) => useApiMutation({
  mutationFn: messageUpload,
  ...opts,
});
