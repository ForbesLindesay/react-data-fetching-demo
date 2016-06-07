if (process.env.NODE_ENV === 'production') {
  require('./lib');
} else {
  require('babel-register');
  require('./src');
}
