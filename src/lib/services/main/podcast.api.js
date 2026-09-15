

import { podcastEndpoints } from '@/lib/api/endpoints';
import { createServerAction } from '@/lib/api/action';

// ── Actions ─────────────────────────────────────────────────────────────────

export const getShowsAction = async () => {
  return createServerAction({
    url: podcastEndpoints.shows(),
    method: 'GET',
  });
};

export const getShowAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.show(id),
    method: 'GET',
  });
};

export const getEpisodesAction = async (sid) => {
  return createServerAction({
    url: podcastEndpoints.episodes(sid),
    method: 'GET',
  });
};

export const getEpisodeAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.episode(id),
    method: 'GET',
  });
};

export const getEpisodeTranscriptionAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.episodeTranscription(id),
    method: 'GET',
  });
};

export const getEpisodeCommentsAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.episodeComments(id),
    method: 'GET',
    params: { limit: 50 },
  });
};

export const toggleEpisodeLikeAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.episodeLike(id),
    method: 'POST',
  });
};

export const toggleEpisodeSaveAction = async (id) => {
  return createServerAction({
    url: podcastEndpoints.episodeSave(id),
    method: 'POST',
  });
};

export const episodeCommentsAction = async ({ id, content, replyTo }) => {
  return createServerAction({
    url: podcastEndpoints.episodeComments(id),
    method: 'POST',
    body: { content, replyTo },
  });
};

export const createEpisodeAction = async ({ showId, data }) => {
  return createServerAction({
    url: `/podcast/shows/${showId}/episodes`,
    method: 'POST',
    body: data,
  });
};

export const updateEpisodeAction = async ({ id, data }) => {
  return createServerAction({
    url: `/podcast/episodes/${id}`,
    method: 'PATCH',
    body: data,
  });
};

export const publishEpisodeAction = async (id) => {
  return createServerAction({
    url: `/podcast/episodes/${id}/publish`,
    method: 'POST',
  });
};

// ── Hooks ───────────────────────────────────────────────────────────────────
