
import { createServerAction } from '@/lib/api/action';
// services/chat/chat.client.js
// The chat service: every chat HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useChat.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { chatEndpoints } from '@/lib/api/endpoints';

export const getRoomsAction = async () => {
  return createServerAction({
    url: chatEndpoints.rooms(),
    method: 'GET',
  });
};

export const getMessagesAction = async (rid) => {
  return createServerAction({
    url: chatEndpoints.messages(rid),
    method: 'GET',
  });
};

export const dMRoomAction = async (uid) => {
  return createServerAction({
    url: chatEndpoints.dmRoom(uid),
    method: 'POST',
  });
};

export const groupRoomAction = async (data) => {
  return createServerAction({
    url: chatEndpoints.groupRoom(),
    method: 'POST',
    body: data,
  });
};

export const messageUploadAction = async ({ roomId, fd }) => {
  return createServerAction({
    url: chatEndpoints.messages(roomId),
    method: 'POST',
    body: fd,
  });
};
