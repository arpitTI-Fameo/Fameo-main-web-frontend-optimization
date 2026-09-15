import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getEventsAction,
  getLiveEventAction,
  getEventAction,
  getEventQAAction,
  getReplayAction,
  getEventDiscussionAction,
  eventRoomAction,
  eventQAAction,
  raiseHandAction,
  eventDiscussionAction,
  rSVPAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const eventKeys = {
  all: () => ['event'],
  list: (status) => [...eventKeys.all(), 'list', status],
  live: () => [...eventKeys.all(), 'live'],
  detail: (id) => [...eventKeys.all(), 'detail', id],
  qa: (id) => [...eventKeys.detail(id), 'qa'],
  replay: (id) => [...eventKeys.detail(id), 'replay'],
  discussion: (id) => [...eventKeys.detail(id), 'discussion'],
};


export const useEvents = (status, opts = {}) => useQuery({

  queryKey: eventKeys.list(status),
  queryFn: async () => {
    const response = await getEventsAction(status);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useLiveEvent = (opts = {}) => useQuery({

  queryKey: eventKeys.live(),
  queryFn: async () => {
    const response = await getLiveEventAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useEvent = (id, opts = {}) => useQuery({

  queryKey: eventKeys.detail(id),
  queryFn: async () => {
    const response = await getEventAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEventQA = (id, opts = {}) => useQuery({

  queryKey: eventKeys.qa(id),
  queryFn: async () => {
    const response = await getEventQAAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useReplay = (id, opts = {}) => useQuery({

  queryKey: eventKeys.replay(id),
  queryFn: async () => {
    const response = await getReplayAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEventDiscussion = (id, opts = {}) => useQuery({

  queryKey: eventKeys.discussion(id),
  queryFn: async () => {
    const response = await getEventDiscussionAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEventRoomMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await eventRoomAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useEventQAMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await eventQAAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useRaiseHandMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await raiseHandAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useEventDiscussionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await eventDiscussionAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useRSVPMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await rSVPAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});
