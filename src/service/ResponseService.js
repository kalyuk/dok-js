import {Service} from '../base/Service';
import {defaultsDeep} from 'lodash';
import fs from 'fs';
import path from 'path';
import _mime from 'mime-type';
import db from 'mime-db';

const mime = _mime(db);

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
        'Content-Type': ResponseService.types.json
      },
      status: code
    };
  }

  renderFile(response, content) {
    if (!fs.existsSync(content.filePath)) {
      content.body = `File not found, ${content.filePath.split('/').pop()}`;
      content.status = 404;
      return this.render(response, content);
    }

    const ext = path.extname(content.filePath);
    let type;
    switch (ext) {
      case 'eot':
        type = 'application/vnd.ms-fontobject';
        break;
      case 'ttf':
        type = 'application/octet-stream';
        break;
      case 'svg':
        type = 'image/svg+xml';
        break;
      case 'woff':
        type = 'application/font-woff';
        break;
      case 'woff2':
        type = 'font/woff2';
        break;
      default:
        type = mime.lookup(content.filePath);
    }

    response.writeHead(200, {'Content-Type': type});

    fs.createReadStream(content.filePath).pipe(response);
    return null;
  }

  render(response, content) {
    const result = defaultsDeep(content, this.config);

    if (result.status === 301 || result.status === 302) {
      response.statusCode = result.status;
      response.setHeader('Location', result.body);
      response.setHeader('Content-Type', 'plain/text');
      return response.end();
    }

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
    return response.end();
  }
}