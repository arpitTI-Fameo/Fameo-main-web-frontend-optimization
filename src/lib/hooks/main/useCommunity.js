import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getSpacesAction,
  getCommunityHeroAction,
  getSubmissionsAction,
  getMentorsOnlineAction,
  submitReviewAction,
  createSubmissionAction,
  reportContentAction,
  getCommunitySearchAction,
  getFeedAction,
  getSpaceFeedAction,
  getPostAction,
  getCommentsAction,
  getTopCreatorsAction,
  createPostAction,
  toggleLikeAction,
  toggleSaveAction,
  addCommentAction,
  getNotificationsAction,
  readNotificationsAction,
  joinSpaceAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const communityKeys = {
  all: () => ['community'],
  spaces: () => [...communityKeys.all(), 'spaces'],
  feed: (tab, page) => [...communityKeys.all(), 'feed', tab, page],
  spaceFeed: (id, filter, page) => [...communityKeys.spaces(), id, 'feed', filter, page],
  spaceMods: (id) => [...communityKeys.spaces(), id, 'mods'],
  spaceTop: (id) => [...communityKeys.spaces(), id, 'top'],
  posts: () => [...communityKeys.all(), 'posts'],
  post: (id) => [...communityKeys.posts(), id],
  comments: (pid, page) => [...communityKeys.post(pid), 'comments', page],
  reports: (status, page) => [...communityKeys.all(), 'reports', status, page],
  submissions: (filter, page) => [...communityKeys.all(), 'submissions', filter, page],
  submission: (id) => [...communityKeys.all(), 'submissions', id],
  userStats: (uid) => [...communityKeys.all(), 'userStats', uid],
  userPosts: (uid, page) => [...communityKeys.all(), 'userPosts', uid, page],
  search: (q) => [...communityKeys.all(), 'search', q],
  topCreators: (period) => [...communityKeys.all(), 'topCreators', period],
  notifications: (page) => [...communityKeys.all(), 'notifications', page],
};


export const useSpaces = (opts = {}) => useQuery({

  queryKey: communityKeys.spaces(),
  queryFn: async () => {
    const response = await getSpacesAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCommunityHero = (opts = {}) => useQuery({

  queryKey: communityKeys.hero(),
  queryFn: async () => {
    const response = await getCommunityHeroAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useSubmissions = (filter, opts = {}) => useQuery({

  queryKey: communityKeys.submissions(filter),
  queryFn: async () => {
    const response = await getSubmissionsAction(filter);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useMentorsOnline = (opts = {}) => useQuery({

  queryKey: communityKeys.mentorsOnline(),
  queryFn: async () => {
    const response = await getMentorsOnlineAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useSubmitReviewMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await submitReviewAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [communityKeys.submissions()],
  ...opts,
});

export const useCreateSubmissionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await createSubmissionAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [communityKeys.submissions()],
  ...opts,
});

export const useReportContentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await reportContentAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCommunitySearch = (query, opts = {}) => useQuery({

  queryKey: communityKeys.all(), // Can be more specific if we add a search key
  queryFn: async () => {
    const response = await getCommunitySearchAction(query);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(query),
  ...opts,
});

export const useFeed = (tab = 'foryou', page = 1, opts = {}) => useQuery({

  queryKey: communityKeys.feed(tab, page),
  queryFn: async () => {
    const response = await getFeedAction(tab, page);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useSpaceFeed = (id, filter = 'latest', page = 1, opts = {}) => useQuery({

  queryKey: communityKeys.spaceFeed(id, filter, page),
  queryFn: async () => {
    const response = await getSpaceFeedAction(id, filter, page);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const usePost = (id, opts = {}) => useQuery({

  queryKey: communityKeys.post(id),
  queryFn: async () => {
    const response = await getPostAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useComments = (pid, page = 1, opts = {}) => useQuery({

  queryKey: communityKeys.comments(pid, page),
  queryFn: async () => {
    const response = await getCommentsAction(pid, page);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(pid),
  ...opts,
});

export const useTopCreators = (period = 'week', opts = {}) => useQuery({

  queryKey: communityKeys.topCreators(period),
  queryFn: async () => {
    const response = await getTopCreatorsAction(period);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCreatePostMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await createPostAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [communityKeys.posts()],
  ...opts,
});

export const useToggleLikeMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await toggleLikeAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useToggleSaveMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await toggleSaveAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useAddCommentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await addCommentAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useNotifications = (opts = {}) => useQuery({

  queryKey: communityKeys.all(), // Can use a specific notifs key
  queryFn: async () => {
    const response = await getNotificationsAction();
    if (!response.code) throw response;
    return response.result;
  },
  refetchInterval: 60000,
  ...opts,
});

export const useReadNotificationsMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await readNotificationsAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [communityKeys.all()],
  ...opts,
});

export const useJoinSpaceMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await joinSpaceAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [communityKeys.spaces()],
  ...opts,
});
