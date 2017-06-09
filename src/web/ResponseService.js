import {Service} from '../base/Service';
import * as _ from 'lodash';

export class ResponseService extends Service {
  static types = {
    html: 'text/html',
    json: 'application/json'
  };

  static options = {
    body: '',
    headers: {
      'Content-Encoding': 'UTF-8',
      'Content-Type': ResponseService.types.json
    },
    status: 200
  };

  // TODO сделать проверку 500 ошибки
  render(response, ctx) {
    const result = _.defaultsDeep(ctx.content, this.config);

    Object.keys(result.headers || {}).forEach((headerName) => {
      if (typeof result.headers[headerName] === 'string') {
        response.setHeader(headerName, result.headers[headerName]);
      } else {
        result.headers[headerName].forEach((data) => {
          response.setHeader(headerName, data);
        });
      }
    });

    response.statusCode = result.status;
    response.setHeader('Content-Length', Buffer.byteLength(result.body).toString());
    response.write(result.body);
    response.end();
  }
}