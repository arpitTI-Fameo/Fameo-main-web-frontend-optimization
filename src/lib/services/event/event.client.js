'use client';
// services/event/event.client.js
// The event service: every event HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useEvent.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { eventEndpoints } from '@/lib/api/endpoints';

export const getEvents = (status) =>
  clientFetch(eventEndpoints.getAll(), { params: { status } });

export const getLiveEvent = () =>
  clientFetch(eventEndpoints.live());

export const getEvent = (id) =>
  clientFetch(eventEndpoints.getOne(id));

export const getEventQA = (id) =>
  clientFetch(eventEndpoints.qa(id));

export const getReplay = (id) =>
  clientFetch(eventEndpoints.replay(id));

export const getEventDiscussion = (id) =>
  clientFetch(eventEndpoints.discussion(id));

export const eventRoom = ({ id, role }) =>
  clientFetch(`${eventEndpoints.roomToken(id)}?role=${role}`);

export const eventQA = ({ id, data }) =>
  clientFetch(eventEndpoints.qa(id), { method: 'POST', body: JSON.stringify(data) });

export const raiseHand = ({ id, data }) =>
  clientFetch(`${eventEndpoints.getOne(id)}/raise-hand`, { method: 'POST', body: JSON.stringify(data) });

export const eventDiscussion = ({ id, data }) =>
  clientFetch(eventEndpoints.discussion(id), { method: 'POST', body: JSON.stringify(data) });

export const rSVP = (id) =>
  clientFetch(eventEndpoints.rsvp(id), { method: 'POST' });
