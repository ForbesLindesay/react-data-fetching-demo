import fs from 'fs';
import Promise from 'promise';
import loadSchema from 'bicycle/lib/load-schema';

const schema = {objects: [], scalars: []};
fs.readdirSync(__dirname + '/objects').forEach(filename => {
  let t = require('./objects/' + filename);
  if (t.default) t = t.default;
  schema.objects.push(t);
});

export default loadSchema(schema);
