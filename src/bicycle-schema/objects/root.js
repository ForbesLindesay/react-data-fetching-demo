import * as api from '../../api';

export default {
  name: 'Root',
  fields: {
    stories: {
      type: 'Story[]',
      args: {},
      resolve(root, args, context) {
        return api.getStories();
      },
    },
  },
  mutations: {
    refresh: {
      args: {},
      resolve(args, context) {}, // NO-OP
    },
  },
};
