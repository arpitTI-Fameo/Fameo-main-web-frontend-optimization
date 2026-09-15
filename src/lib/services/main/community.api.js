
import { createServerAction } from '@/lib/api/action';
// services/community/community.client.js
// The community service: every community HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useCommunity.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { communityEndpoints } from '@/lib/api/endpoints';

export const getSpacesAction = async () => {
  return createServerAction({
    url: communityEndpoints.spaces(),
    method: 'GET',
  });
};

export const getCommunityHeroAction = async () => {
  return createServerAction({
    url: communityEndpoints.hero(),
    method: 'GET',
  });
};

export const getSubmissionsAction = async (filter) => {
  return createServerAction({
    url: `${communityEndpoints.submissions()}?filter=${filter}`,
    method: 'GET',
  });
};

export const getMentorsOnlineAction = async () => {
  return createServerAction({
    url: communityEndpoints.mentorsOnline(),
    method: 'GET',
  });
};

export const submitReviewAction = async ({ subId, data }) => {
  return createServerAction({
    url: communityEndpoints.submissionReviews(subId),
    method: 'POST',
    body: data,
  });
};

export const createSubmissionAction = async (fd) => {
  return createServerAction({
    url: communityEndpoints.submissions(),
    method: 'POST',
    body: fd,
  });
};

export const reportContentAction = async (data) => {
  return createServerAction({
    url: communityEndpoints.reports(),
    method: 'POST',
    body: data,
  });
};

export const getCommunitySearchAction = async (query) => {
  return createServerAction({
    url: `${communityEndpoints.search()}?q=${encodeURIComponent(query)}`,
    method: 'GET',
  });
};

export const getFeedAction = async (tab, page) => {
  return createServerAction({
    url: communityEndpoints.feed(),
    method: 'GET',
    params: { tab, page, limit: 20 },
  });
};

export const getSpaceFeedAction = async (id, filter, page) => {
  return createServerAction({
    url: communityEndpoints.spaceFeed(id),
    method: 'GET',
    params: { filter, page, limit: 20 },
  });
};

export const getPostAction = async (id) => {
  return createServerAction({
    url: communityEndpoints.post(id),
    method: 'GET',
  });
};

export const getCommentsAction = async (pid, page) => {
  return createServerAction({
    url: communityEndpoints.postComments(pid),
    method: 'GET',
    params: { page, limit: 30 },
  });
};

export const getTopCreatorsAction = async (period) => {
  return createServerAction({
    url: communityEndpoints.topCreators(),
    method: 'GET',
    params: { period, limit: 5 },
  });
};

export const createPostAction = async (data) => {
  return createServerAction({
    url: communityEndpoints.posts(),
    method: 'POST',
    body: data,
  });
};

export const toggleLikeAction = async (id) => {
  return createServerAction({
    url: communityEndpoints.postLike(id),
    method: 'POST',
  });
};

export const toggleSaveAction = async (id) => {
  return createServerAction({
    url: communityEndpoints.postSave(id),
    method: 'POST',
  });
};

export const addCommentAction = async ({ pid, data }) => {
  return createServerAction({
    url: communityEndpoints.postComments(pid),
    method: 'POST',
    body: data,
  });
};

export const getNotificationsAction = async () => {
  return createServerAction({
    url: communityEndpoints.notifications(),
    method: 'GET',
  });
};

export const readNotificationsAction = async () => {
  return createServerAction({
    url: communityEndpoints.readAllNotifs(),
    method: 'POST',
  });
};

export const joinSpaceAction = async (id) => {
  return createServerAction({
    url: communityEndpoints.joinSpace(id),
    method: 'POST',
  });
};
