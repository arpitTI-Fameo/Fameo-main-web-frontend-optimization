export const podcastKeys = {
  all: () => ['podcast'],
  shows: () => [...podcastKeys.all(), 'shows'],
  show: (id) => [...podcastKeys.shows(), id],
  episodes: (sid) => [...podcastKeys.show(sid), 'episodes'],
  episode: (id) => [...podcastKeys.all(), 'episode', id],
  comments: (id) => [...podcastKeys.episode(id), 'comments'],
  transcription: (id) => [...podcastKeys.episode(id), 'transcription'],
  mySubscriptions: () => [...podcastKeys.all(), 'subscriptions'],
  mySaved: () => [...podcastKeys.all(), 'saved'],
};
