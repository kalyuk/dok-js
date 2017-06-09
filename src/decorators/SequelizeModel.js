import _ from 'lodash';
import {getApplication} from '../../index';

export function SequelizeModel(options = {}) {
  const params = _.defaultsDeep({db: 'db'}, options);
  return function (target) {
    return getApplication().getService('DatabaseService').getInstance(params.db)
      .defineModel(target.name, options.schema, params, target);
  };
}