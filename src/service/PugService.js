import {Service} from '../base/Service';
import pug from 'pug';
import _ from 'lodash';
import path from 'path';

export class PugService extends Service {

  static options = {
    pugOptions: {
      cache: true,
      compileDebug: false,
      debug: false,
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

  init() {
    super.init();
    this.config.baseDir = path.join(this.config.viewPath, this.config.template);
  }

  render(pathTemplate, data = {}) {
    const fullPath = path.join(this.config.baseDir, 'views', pathTemplate + '.pug');
    const compiledFunction = pug.compileFile(fullPath, this.config.pugOptions);

    const params = _.defaultsDeep(data, this.config.fields);

    return compiledFunction(params);
  }

}