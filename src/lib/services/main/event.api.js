
import { createServerAction } from '@/lib/api/action';
// services/event/event.client.js
// The event service: every event HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useEvent.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { eventEndpoints } from '@/lib/api/endpoints';

export const getEventsAction = async (status) => {
  return createServerAction({
    url: eventEndpoints.getAll(),
    method: 'GET',
    params: { status },
  });
};

export const getLiveEventAction = async () => {
  return createServerAction({
    url: eventEndpoints.live(),
    method: 'GET',
  });
};

export const getEventAction = async (id) => {
  return createServerAction({
    url: eventEndpoints.getOne(id),
    method: 'GET',
  });
};

export const getEventQAAction = async (id) => {
  return createServerAction({
    url: eventEndpoints.qa(id),
    method: 'GET',
  });
};

export const getReplayAction = async (id) => {
  return createServerAction({
    url: eventEndpoints.replay(id),
    method: 'GET',
  });
};

export const getEventDiscussionAction = async (id) => {
  return createServerAction({
    url: eventEndpoints.discussion(id),
    method: 'GET',
  });
};

export const eventRoomAction = async ({ id, role }) => {
  return createServerAction({
    url: `${eventEndpoints.roomToken(id)}?role=${role}`,
    method: 'GET',
  });
};

export const eventQAAction = async ({ id, data }) => {
  return createServerAction({
    url: eventEndpoints.qa(id),
    method: 'POST',
    body: data,
  });
};

export const raiseHandAction = async ({ id, data }) => {
  return createServerAction({
    url: `${eventEndpoints.getOne(id)}/raise-hand`,
    method: 'POST',
    body: data,
  });
};

export const eventDiscussionAction = async ({ id, data }) => {
  return createServerAction({
    url: eventEndpoints.discussion(id),
    method: 'POST',
    body: data,
  });
};

export const rSVPAction = async (id) => {
  return createServerAction({
    url: eventEndpoints.rsvp(id),
    method: 'POST',
  });
};
