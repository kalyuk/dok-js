import {getApplication} from '../../index';

export function SequelizeModel(schema, options = {}, dbName = 'db') {
  return function (target) {
    return getApplication().getService('DatabaseService').getInstance(dbName)
      .defineModel(target.name, schema, options, target);
  };
}