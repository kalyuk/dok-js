import BaseController from "../base/Controller";
import pug from "pug";
import path from "path";
import _ from "lodash";
import App from "../app";
export default class Controller extends BaseController {

  renderFile(filePath, code = 200, headers = {}) {
    return {
      headers,
      filePath: filePath,
      state: code
    };
  }

  render(template, data = {}, code = 200, headers = {}) {
    const viewPath = path.join(this.viewPath, this.id, template + ".pug");
    const compiledFunction = pug.compileFile(viewPath, {
      cache: !App().isDevMode(),
      compileDebug: false,
      debug: false,
      basedir: App().getViewPath(),
      inlineRuntimeFunctions: true
    });
    const params = _.defaultsDeep(data, {
      meta: {
        title: ""
      }
    });
    const $headers = Object.assign(headers, {
      "Content-Type": "text/html"
    });

    return {
      headers: $headers,
      body: compiledFunction(params),
      state: code
    };
  }

  renderJSON(json, code = 200, headers = {}) {
    return {
      headers,
      body: {
        code,
        data: json
      },
      state: code
    };
  }

  redirectTo(url, code = 301, headers = {}) {
    const $headers = Object.assign(headers, {
      Location: url,
      "Content-Type": "plain/text"
    });

    return {
      headers: $headers,
      body: "",
      state: code
    };
  }

}