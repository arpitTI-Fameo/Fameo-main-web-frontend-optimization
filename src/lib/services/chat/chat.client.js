'use client';
// services/chat/chat.client.js
// The chat service: every chat HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useChat.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { chatEndpoints } from '@/lib/api/endpoints';

export const getRooms = () =>
  clientFetch(chatEndpoints.rooms());

export const getMessages = (rid) =>
  clientFetch(chatEndpoints.messages(rid));

export const dMRoom = (uid) =>
  clientFetch(chatEndpoints.dmRoom(uid), { method: 'POST' });

export const groupRoom = (data) =>
  clientFetch(chatEndpoints.groupRoom(), { method: 'POST', body: JSON.stringify(data) });

export const messageUpload = ({ roomId, fd }) =>
  clientUpload(chatEndpoints.messages(roomId), fd);
