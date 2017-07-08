import {getFnParamNames} from './fn';
import {ucFirst} from './string';
import {getApplication} from '../index';

/**
 * @param {Function} INSTANCE
 * @returns {Array}
 */
export function inject(INSTANCE) {
  const args = [];
  getFnParamNames(INSTANCE).forEach((serviceName) => {
    if (serviceName && serviceName.length) {
      args.push(getApplication().getService(ucFirst(serviceName)));
    }
  });

  return args;
}