'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { eventKeys } from '@/lib/services/event/event.keys';
import {
  eventDiscussion, eventQA, eventRoom, getEvent, getEventDiscussion, getEventQA, getEvents, getLiveEvent, getReplay, rSVP, raiseHand,
} from '@/lib/services/event/event.client';

export const useEvents = (status, opts = {}) => useQuery({
  queryKey: eventKeys.list(status),
  queryFn: () => getEvents(status),
  ...opts,
});

export const useLiveEvent = (opts = {}) => useQuery({
  queryKey: eventKeys.live(),
  queryFn: getLiveEvent,
  ...opts,
});

export const useEvent = (id, opts = {}) => useQuery({
  queryKey: eventKeys.detail(id),
  queryFn: () => getEvent(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEventQA = (id, opts = {}) => useQuery({
  queryKey: eventKeys.qa(id),
  queryFn: () => getEventQA(id),
  enabled: Boolean(id),
  ...opts,
});

export const useReplay = (id, opts = {}) => useQuery({
  queryKey: eventKeys.replay(id),
  queryFn: () => getReplay(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEventDiscussion = (id, opts = {}) => useQuery({
  queryKey: eventKeys.discussion(id),
  queryFn: () => getEventDiscussion(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEventRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: eventRoom,
  ...opts,
});

export const useEventQAMutation = (opts = {}) => useApiMutation({
  mutationFn: eventQA,
  ...opts,
});

export const useRaiseHandMutation = (opts = {}) => useApiMutation({
  mutationFn: raiseHand,
  ...opts,
});

export const useEventDiscussionMutation = (opts = {}) => useApiMutation({
  mutationFn: eventDiscussion,
  ...opts,
});

export const useRSVPMutation = (opts = {}) => useApiMutation({
  mutationFn: rSVP,
  ...opts,
});
