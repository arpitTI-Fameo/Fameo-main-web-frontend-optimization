import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getShowsAction,
  getShowAction,
  getEpisodesAction,
  getEpisodeAction,
  getEpisodeTranscriptionAction,
  getEpisodeCommentsAction,
  toggleEpisodeLikeAction,
  toggleEpisodeSaveAction,
  episodeCommentsAction,
  createEpisodeAction,
  updateEpisodeAction,
  publishEpisodeAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const podcastKeys = {
  all: () => ['podcast'],
  shows: () => [...podcastKeys.all(), 'shows'],
  show: (id) => [...podcastKeys.shows(), id],
  episodes: (sid) => [...podcastKeys.show(sid), 'episodes'],
  episode: (id) => [...podcastKeys.all(), 'episode', id],
  comments: (id) => [...podcastKeys.episode(id), 'comments'],
  transcription: (id) => [...podcastKeys.episode(id), 'transcription'],
  mySubscriptions: () => [...podcastKeys.all(), 'subscriptions'],
  mySaved: () => [...podcastKeys.all(), 'saved'],
};

// ── Hooks ──────────────────────────────────────────────────────────────────
export const useShows = (opts = {}) => useQuery({
  queryKey: podcastKeys.shows(),
  queryFn: async () => {
    const response = await getShowsAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useShow = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.show(id),
  queryFn: async () => {
    const response = await getShowAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodes = (sid, opts = {}) => useQuery({
  queryKey: podcastKeys.episodes(sid),
  queryFn: async () => {
    const response = await getEpisodesAction(sid);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(sid),
  ...opts,
});

export const useEpisode = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.episode(id),
  queryFn: async () => {
    const response = await getEpisodeAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodeTranscription = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.transcription(id),
  queryFn: async () => {
    const response = await getEpisodeTranscriptionAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodeComments = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.comments(id),
  queryFn: async () => {
    const response = await getEpisodeCommentsAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useToggleEpisodeLikeMutation = (opts = {}) => useApiMutation({
  mutationFn: async (id) => {
    const response = await toggleEpisodeLikeAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useToggleEpisodeSaveMutation = (opts = {}) => useApiMutation({
  mutationFn: async (id) => {
    const response = await toggleEpisodeSaveAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useEpisodeCommentsMutation = (opts = {}) => useApiMutation({
  mutationFn: async (params) => {
    const response = await episodeCommentsAction(params);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [podcastKeys.episodes()],
  ...opts,
});

export const useCreateEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: async (params) => {
    const response = await createEpisodeAction(params);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useUpdateEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: async (params) => {
    const response = await updateEpisodeAction(params);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const usePublishEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: async (id) => {
    const response = await publishEpisodeAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});
