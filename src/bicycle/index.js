import Bicycle from 'bicycle/lib/client';
import {Provider} from 'react-bicycle';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';


const client = new Bicycle();

client.definieOptimisticUpdaters({
  Story: {
    vote({args: {id}}, cache) {
      if (!cache['Story:' + id]) return {};
      return {['Story:' + id]: {'votes': cache['Story:' + id].votes + 1}};
    },
  },
});

setInterval(
  () => client.update('Root.refresh', {}),
  3000,
);

ReactDOM.render(
  <Provider client={client}>
    <App/>
  </Provider>,
  document.getElementById('container'),
);
