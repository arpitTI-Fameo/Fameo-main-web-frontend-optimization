export const chatKeys = {
  all: () => ['chat'],
  rooms: () => [...chatKeys.all(), 'rooms'],
  messages: (rid) => [...chatKeys.all(), 'messages', rid],
};
