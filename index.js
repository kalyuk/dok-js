var data = require('./dist/index');

Object.keys(data).forEach(function(key) {
  exports[key] = data[key];
})