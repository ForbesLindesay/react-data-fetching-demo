import * as api from '../../api';

export default {
  name: 'Story',
  id(story) {
    return 'Story:' + story._id;
  },
  fields: {
    id: {
      type: 'string',
      resolve(story, args, context) {
        return '' + story._id;
      },
    },
    body: 'string',
    votes: 'number',
  },
  mutations: {
    create: {
      args: {body: 'string'},
      resolve({body}, context) {
        return api.addStory(body);
      },
    },
    vote: {
      args: {id: 'string'},
      resolve({id}, context) {
        return api.voteStory(id);
      },
    },
  },
};
