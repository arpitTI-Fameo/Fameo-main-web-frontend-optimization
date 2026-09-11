export const userKeys = {
  all: () => ['user'],
  profile: () => [...userKeys.all(), 'profile'],
  favorites: () => [...userKeys.all(), 'favorites'],
  addresses: () => [...userKeys.all(), 'addresses'],
};
