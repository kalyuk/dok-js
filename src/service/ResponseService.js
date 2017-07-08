import {Service} from '../base/Service';
import {defaultsDeep} from 'lodash';


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

  static renderError(code, errors, message) {
    return {
      body: JSON.stringify({
        code,
        errors,
        message
      }),
      headers: {
        'Content-type': ResponseService.types.json
      },
      status: code
    };
  }

  render(response, content) {
    const result = defaultsDeep(content, this.config);

    Object.keys(result.headers || {}).forEach((headerName) => {
      if (typeof result.headers[headerName] === 'string') {
        response.setHeader(headerName, result.headers[headerName]);
      } else {
        (result.headers[headerName]).forEach((data) => {
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