'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplication = setApplication;
exports.getApplication = getApplication;
exports.getService = getService;
exports.defineModel = defineModel;

var _CoreError = require('./base/CoreError');

var cache = {};

function setApplication(instance) {
  if (cache.application) {
    throw new _CoreError.CoreError(500, 'The application is already running');
  }
  cache.application = instance;
}

function getApplication() {
  return cache.application;
}

function getService(name) {
  return getApplication().getService(name);
}

function defineModel(attributes, options) {
  var db = options.db,
      modelName = options.modelName;

  delete options.db;
  delete options.modelName;
  return getService('DatabaseService').getInstance(db).define(modelName, attributes, options);
}