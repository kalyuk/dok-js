var cache = {};
/**
 * @param {Application} instance
 */
exports.setApplication = function (instance) {
  if (cache.application) {
    throw new Error('The application is already running');
  }
  cache.application = instance;
};
/**
 * @returns {Application}
 */
exports.getApplication = function () {
  return cache.application;
};
