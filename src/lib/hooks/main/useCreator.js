'use client';

import { useQuery } from '@tanstack/react-query';
import { creatorKeys } from '@/lib/services/creator/creator.keys';
import {
  getCreator, getCreators, getMyCreatorProfile,
} from '@/lib/services/creator/creator.client';

export const useCreators = (opts = {}) => useQuery({
  queryKey: creatorKeys.lists(),
  queryFn: getCreators,
  ...opts,
});

export const useCreator = (id, opts = {}) => useQuery({
  queryKey: creatorKeys.detail(id),
  queryFn: () => getCreator(id),
  enabled: Boolean(id),
  ...opts,
});

export const useMyCreatorProfile = (opts = {}) => useQuery({
  queryKey: creatorKeys.me(),
  queryFn: getMyCreatorProfile,
  ...opts,
});
