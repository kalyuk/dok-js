import {CoreError} from './base/CoreError';

const cache = {};

export function setApplication(instance) {
  if (cache.application) {
    throw new CoreError(500, 'The application is already running');
  }
  cache.application = instance;
}

export function getApplication() {
  return cache.application;
}

export function getService(name) {
  return getApplication().getService(name);
}

export function defineModel(attributes, options) {
  const {db, modelName} = options;
  delete options.db;
  delete options.modelName;
  return getService('DatabaseService').getInstance(db).define(modelName, attributes, options);
}
