import {readFileSync} from 'fs';
import {resolve} from 'path';
import Promise from 'promise';
import babelify from 'babelify';
import browserify from 'browserify-middleware';
import express from 'express';
import prepare from 'prepare-response';
import {json} from 'body-parser';
import * as api from './api';

const app = express();

const index = readFileSync(__dirname + '/../index.html', 'utf8');
[
  'raw',
  'with-data',
  'data-store',
  'bicycle'
].forEach(implementation => {
  const response = prepare(
    index.replace(/\{\{client\}\}/, '/' + implementation + '.js'),
    {'content-type': 'html', 'cache-control': '1 day'},
  );
  app.get('/' + implementation, (req, res, next) => {
    response.send(req, res, next);
  });
  app.get('/' + implementation + '.js', browserify(
    __dirname + '/' + implementation + '/index.js',
    {
      transform: (
        process.env.NODE_ENV === 'production'
        ? require('envify')
        : require('babelify')
      )
    },
  ));
});
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname + '/../home.html'));
});

// CREATE
app.put('/api/stories', json(), (req, res, next) => {
  api.addStory(req.body.body).done(r => res.json(r), next);
});

// READ
app.get('/api/stories', (req, res, next) => {
  api.getStoryIds().done(r => res.json(r), next);
});
app.get('/api/stories/:id', (req, res, next) => {
  api.getStory(req.params.id).done(r => res.json(r), next);
});

// UPDATE
app.post('/api/stories/:id/vote', (req, res, next) => {
  api.voteStory(req.params.id).then(
    () => Promise.all([api.getStory(req.params.id), api.getStoryIds()])
  ).then(
    results => ({story: results[0], storyIds: results[1]})
  ).done(r => res.json(r), next);
});

app.listen(process.env.PORT || 3000);
