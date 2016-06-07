import mongo from 'then-mongo';

const db = mongo(
  process.env.DATABASE,
  ['stories'],
);
const ObjectId = db.ObjectId;

let storiesCache = _getStories();
let cacheById = {};

// CREATE
export function addStory(storyBody) {
  return db.stories.insert({
    body: storyBody,
    votes: 0,
  }).then(result => {
    storiesCache = _getStories();
    cacheById = {};
    return result;
  });
};

function _getStories() {
  return db.stories.find().then(stories => {
    return stories.sort((a, b) => b.votes - a.votes);
  });
}

// READ
export function getStoryIds() {
  return storiesCache.then(stories => {
    return stories.map(s => s._id);
  });
};
export function getStory(id) {
  if (id in cacheById) return cacheById[id];
  return cacheById[id] = db.stories.findOne({_id: new ObjectId(id)});
};
export function getStories() {
  return storiesCache;
}

// UPDATE
export function voteStory(id) {
  return db.stories.update(
    {_id: new ObjectId(id)},
    {$inc: {votes: 1}},
  ).then(result => {
    storiesCache = _getStories();
    cacheById = {};
    return result;
  });
};
