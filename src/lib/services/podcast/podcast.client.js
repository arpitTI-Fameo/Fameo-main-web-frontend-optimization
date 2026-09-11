'use client';
// services/podcast/podcast.client.js
// The podcast service: every podcast HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/usePodcast.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { podcastEndpoints } from '@/lib/api/endpoints';

export const getShows = () =>
  clientFetch(podcastEndpoints.shows());

export const getShow = (id) =>
  clientFetch(podcastEndpoints.show(id));

export const getEpisodes = (sid) =>
  clientFetch(podcastEndpoints.episodes(sid));

export const getEpisode = (id) =>
  clientFetch(podcastEndpoints.episode(id));

export const getEpisodeTranscription = (id) =>
  clientFetch(podcastEndpoints.episodeTranscription(id));

export const getEpisodeComments = (id) =>
  clientFetch(podcastEndpoints.episodeComments(id), { params: { limit: 50 } });

export const toggleEpisodeLike = (id) =>
  clientFetch(podcastEndpoints.episodeLike(id), { method: 'POST' });

export const toggleEpisodeSave = (id) =>
  clientFetch(podcastEndpoints.episodeSave(id), { method: 'POST' });

export const episodeComments = ({ id, content, replyTo }) =>
  clientFetch(podcastEndpoints.episodeComments(id), { method: 'POST', body: JSON.stringify({ content, replyTo }) });

export const createEpisode = ({ showId, data }) =>
  clientFetch(`/podcast/shows/${showId}/episodes`, { method: 'POST', body: JSON.stringify(data) });

export const updateEpisode = ({ id, data }) =>
  clientFetch(`/podcast/episodes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const publishEpisode = (id) =>
  clientFetch(`/podcast/episodes/${id}/publish`, { method: 'POST' });
