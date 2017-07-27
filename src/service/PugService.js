import Service from '../base/Service';
import pug from 'pug';
import _ from 'lodash';

export class PugService extends Service {

  static options = {
    pugOptions: {
      cache: true,
      compileDebug: false,
      debug: false,
      basedir: '',
      inlineRuntimeFunctions: true
    },
    fields: {
      meta: {
        title: ''
      }
    },
    template: 'default',
    viewPath: ''
  };

  render(pathTemplate, data = {}) {
    const compiledFunction = pug.compileFile(pathTemplate + '.pug', this.config.pugOptions);

    const params = _.defaultsDeep(data, this.config.fields);

    return compiledFunction(params);
  }

}