'use client';
// services/community/community.client.js
// The community service: every community HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useCommunity.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { communityEndpoints } from '@/lib/api/endpoints';

export const getSpaces = () =>
  clientFetch(communityEndpoints.spaces());

export const getCommunityHero = () =>
  clientFetch(communityEndpoints.hero());

export const getSubmissions = (filter) =>
  clientFetch(`${communityEndpoints.submissions()}?filter=${filter}`);

export const getMentorsOnline = () =>
  clientFetch(communityEndpoints.mentorsOnline());

export const submitReview = ({ subId, data }) =>
  clientFetch(communityEndpoints.submissionReviews(subId), { method: 'POST', body: JSON.stringify(data) });

export const createSubmission = (fd) =>
  clientUpload(communityEndpoints.submissions(), fd);

export const reportContent = (data) =>
  clientFetch(communityEndpoints.reports(), { method: 'POST', body: JSON.stringify(data) });

export const getCommunitySearch = (query) =>
  clientFetch(`${communityEndpoints.search()}?q=${encodeURIComponent(query)}`);

export const getFeed = (tab, page) =>
  clientFetch(communityEndpoints.feed(), { params: { tab, page, limit: 20 } });

export const getSpaceFeed = (id, filter, page) =>
  clientFetch(communityEndpoints.spaceFeed(id), { params: { filter, page, limit: 20 } });

export const getPost = (id) =>
  clientFetch(communityEndpoints.post(id));

export const getComments = (pid, page) =>
  clientFetch(communityEndpoints.postComments(pid), { params: { page, limit: 30 } });

export const getTopCreators = (period) =>
  clientFetch(communityEndpoints.topCreators(), { params: { period, limit: 5 } });

export const createPost = (data) =>
  clientFetch(communityEndpoints.posts(), { method: 'POST', body: JSON.stringify(data) });

export const toggleLike = (id) =>
  clientFetch(communityEndpoints.postLike(id), { method: 'POST' });

export const toggleSave = (id) =>
  clientFetch(communityEndpoints.postSave(id), { method: 'POST' });

export const addComment = ({ pid, data }) =>
  clientFetch(communityEndpoints.postComments(pid), { method: 'POST', body: JSON.stringify(data) });

export const getNotifications = () =>
  clientFetch(communityEndpoints.notifications());

export const readNotifications = () =>
  clientFetch(communityEndpoints.readAllNotifs(), { method: 'POST' });

export const joinSpace = (id) =>
  clientFetch(communityEndpoints.joinSpace(id), { method: 'POST' });
