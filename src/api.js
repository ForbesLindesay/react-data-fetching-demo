import mongo from 'then-mongo';

const db = mongo(
  process.env.DATABASE,
  ['stories'],
);
const ObjectId = db.ObjectId;

// CREATE
export function addStory(storyBody) {
  return db.stories.insert({
    body: storyBody,
    votes: 0
  });
};

// READ
export function getStoryIds() {
  return db.stories.find().then(stories => {
    return stories.sort((a, b) => b.votes - a.votes).map(s => s._id);
  });
};
export function getStory(id) {
  return db.stories.findOne({_id: new ObjectId(id)});
};

// UPDATE
export function voteStory(id) {
  return db.stories.update(
    {_id: new ObjectId(id)},
    {$inc: {votes: 1}},
  );
};
