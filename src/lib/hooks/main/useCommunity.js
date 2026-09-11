'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { communityKeys } from '@/lib/services/community/community.keys';
import {
  addComment, createPost, createSubmission, getComments, getCommunityHero, getCommunitySearch, getFeed, getMentorsOnline, getNotifications, getPost, getSpaceFeed, getSpaces, getSubmissions, getTopCreators, joinSpace, readNotifications, reportContent, submitReview, toggleLike, toggleSave,
} from '@/lib/services/community/community.client';

export const useSpaces = (opts = {}) => useQuery({
  queryKey: communityKeys.spaces(),
  queryFn: getSpaces,
  ...opts,
});

export const useCommunityHero = (opts = {}) => useQuery({
  queryKey: communityKeys.hero(),
  queryFn: getCommunityHero,
  ...opts,
});

export const useSubmissions = (filter, opts = {}) => useQuery({
  queryKey: communityKeys.submissions(filter),
  queryFn: () => getSubmissions(filter),
  ...opts,
});

export const useMentorsOnline = (opts = {}) => useQuery({
  queryKey: communityKeys.mentorsOnline(),
  queryFn: getMentorsOnline,
  ...opts,
});

export const useSubmitReviewMutation = (opts = {}) => useApiMutation({
  mutationFn: submitReview,
  invalidate: [communityKeys.submissions()],
  ...opts,
});

export const useCreateSubmissionMutation = (opts = {}) => useApiMutation({
  mutationFn: createSubmission,
  invalidate: [communityKeys.submissions()],
  ...opts,
});

export const useReportContentMutation = (opts = {}) => useApiMutation({
  mutationFn: reportContent,
  ...opts,
});

export const useCommunitySearch = (query, opts = {}) => useQuery({
  queryKey: communityKeys.all(), // Can be more specific if we add a search key
  queryFn: () => getCommunitySearch(query),
  enabled: Boolean(query),
  ...opts,
});

export const useFeed = (tab = 'foryou', page = 1, opts = {}) => useQuery({
  queryKey: communityKeys.feed(tab, page),
  queryFn: () => getFeed(tab, page),
  ...opts,
});

export const useSpaceFeed = (id, filter = 'latest', page = 1, opts = {}) => useQuery({
  queryKey: communityKeys.spaceFeed(id, filter, page),
  queryFn: () => getSpaceFeed(id, filter, page),
  enabled: Boolean(id),
  ...opts,
});

export const usePost = (id, opts = {}) => useQuery({
  queryKey: communityKeys.post(id),
  queryFn: () => getPost(id),
  enabled: Boolean(id),
  ...opts,
});

export const useComments = (pid, page = 1, opts = {}) => useQuery({
  queryKey: communityKeys.comments(pid, page),
  queryFn: () => getComments(pid, page),
  enabled: Boolean(pid),
  ...opts,
});

export const useTopCreators = (period = 'week', opts = {}) => useQuery({
  queryKey: communityKeys.topCreators(period),
  queryFn: () => getTopCreators(period),
  ...opts,
});

export const useCreatePostMutation = (opts = {}) => useApiMutation({
  mutationFn: createPost,
  invalidate: [communityKeys.posts()],
  ...opts,
});

export const useToggleLikeMutation = (opts = {}) => useApiMutation({
  mutationFn: toggleLike,
  ...opts,
});

export const useToggleSaveMutation = (opts = {}) => useApiMutation({
  mutationFn: toggleSave,
  ...opts,
});

export const useAddCommentMutation = (opts = {}) => useApiMutation({
  mutationFn: addComment,
  ...opts,
});

export const useNotifications = (opts = {}) => useQuery({
  queryKey: communityKeys.all(), // Can use a specific notifs key
  queryFn: getNotifications,
  refetchInterval: 60000,
  ...opts,
});

export const useReadNotificationsMutation = (opts = {}) => useApiMutation({
  mutationFn: readNotifications,
  invalidate: [communityKeys.all()],
  ...opts,
});

export const useJoinSpaceMutation = (opts = {}) => useApiMutation({
  mutationFn: joinSpace,
  invalidate: [communityKeys.spaces()],
  ...opts,
});
