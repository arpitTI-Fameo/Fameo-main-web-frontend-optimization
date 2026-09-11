'use client';

import { useQuery } from '@tanstack/react-query';

import { useApiMutation } from '@/lib/query/mutation';
import { podcastKeys } from '@/lib/services/podcast/podcast.keys';
import {
  createEpisode, episodeComments, getEpisode, getEpisodeComments, getEpisodeTranscription, getEpisodes, getShow, getShows, publishEpisode, toggleEpisodeLike, toggleEpisodeSave, updateEpisode,
} from '@/lib/services/podcast/podcast.client';

export const useShows = (opts = {}) => useQuery({
  queryKey: podcastKeys.shows(),
  queryFn: getShows,
  ...opts,
});

export const useShow = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.show(id),
  queryFn: () => getShow(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodes = (sid, opts = {}) => useQuery({
  queryKey: podcastKeys.episodes(sid),
  queryFn: () => getEpisodes(sid),
  enabled: Boolean(sid),
  ...opts,
});

export const useEpisode = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.episode(id),
  queryFn: () => getEpisode(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodeTranscription = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.transcription(id),
  queryFn: () => getEpisodeTranscription(id),
  enabled: Boolean(id),
  ...opts,
});

export const useEpisodeComments = (id, opts = {}) => useQuery({
  queryKey: podcastKeys.comments(id),
  queryFn: () => getEpisodeComments(id),
  enabled: Boolean(id),
  ...opts,
});

export const useToggleEpisodeLikeMutation = (opts = {}) => useApiMutation({
  mutationFn: toggleEpisodeLike,
  ...opts,
});

export const useToggleEpisodeSaveMutation = (opts = {}) => useApiMutation({
  mutationFn: toggleEpisodeSave,
  ...opts,
});

export const useEpisodeCommentsMutation = (opts = {}) => useApiMutation({
  mutationFn: episodeComments,
  invalidate: [podcastKeys.episodes()],
  ...opts,
});

export const useCreateEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: createEpisode,
  ...opts,
});

export const useUpdateEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: updateEpisode,
  ...opts,
});

export const usePublishEpisodeMutation = (opts = {}) => useApiMutation({
  mutationFn: publishEpisode,
  ...opts,
});
