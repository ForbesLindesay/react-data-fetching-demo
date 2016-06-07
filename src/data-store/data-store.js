import request from 'then-request';

const subscriptions = new Set();
const cache = {};
const inFlight = {};

export function subscribe(query, fn) {
  // fn(loading, data);
  fn(cache[query] === undefined, cache[query]);
  fetchQuery(query);
  const subscription = {query, fn};
  subscriptions.add(subscription);
  return () => subscriptions.remove(subscription);
};

function fetchQuery(query) {
  if (inFlight[query]) return;
  inFlight[query] = true;
  request('get', query).getBody('utf8').then(JSON.parse).done(
    data => {
      cache[query] = data;
      updateSubscriptions(query);
    },
    err => {
      // TODO: handle errors properly
      inFlight[query] = false;
      updateSubscriptions(query);
      throw err;
    },
  );
}

function updateSubscriptions(query) {
  subscriptions.forEach(subscription => {
    if (subscription.query === query) {
      subscription.fn(
        cache[query] === undefined,
        cache[query],
      );
    }
  });
}

export function addStory(body) {
  request('put', '/api/stories', {json: {body}}).getBody('utf8').then(JSON.parse).done(
    result => {
      cache['/api/stories'] = cache['/api/stories'].concat([result._id]);
      cache['/api/stories/' + result._id] = result;
      updateSubscriptions('/api/stories');
      updateSubscriptions('/api/stories/' + result._id);
    },
    // TODO: handle errors
  );
}
export function voteStory(id) {
  // optimistic update
  const oldValue = cache['/api/stories/' + id];
  if (cache['/api/stories/' + id]) {
    cache['/api/stories/' + id] = {
      ...cache['/api/stories/' + id],
      votes: cache['/api/stories/' + id].votes + 1,
    };
    updateSubscriptions('/api/stories/' + id);
  }
  request('post', '/api/stories/' + id + '/vote').getBody('utf8').then(JSON.parse).done(
    result => {
      cache['/api/stories'] = result.storyIds;
      cache['/api/stories/' + id] = result.story;
      updateSubscriptions('/api/stories');
      updateSubscriptions('/api/stories/' + id);
    },
    err => {
      // roll back optimistic update
      cache['/api/stories/' + id] = oldValue;
      updateSubscriptions('/api/stories/' + id);
      // TODO: proper error handling
      throw err;
    }
  );
}
