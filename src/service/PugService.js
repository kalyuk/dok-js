import {Service} from '../base/Service';
import pug from 'pug';
import _ from 'lodash';
import path from 'path';
import {getApplication} from '../index';

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
    ext: '.pug',
    template: 'default',
    viewPath: ''
  };


  render(pathTemplate, data = {}, templateName = this.config.template) {
    const fullPath = path.join(this.config.viewPath, templateName, 'views', pathTemplate + this.config.ext);
    const compiledFunction = pug.compileFile(fullPath, this.config.pugOptions);

    const params = _.defaultsDeep(data, this.config.fields);
    params.env = getApplication().arguments.env;

    return compiledFunction(params);
  }

}