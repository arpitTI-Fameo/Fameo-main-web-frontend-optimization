export const notificationKeys = {
  all: () => ['notification'],
  lists: () => [...notificationKeys.all(), 'list'],
};
