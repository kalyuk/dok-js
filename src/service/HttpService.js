import {Service} from '../base/Service';
import http from 'http';
import {LOG_LEVEL} from './LoggerService';
import {createContext} from '../base/Context';
import {ResponseService} from './ResponseService';
import {parse, URL} from 'url';
import q from 'querystring';

export class HttpService extends Service {
  static options = {
    host: '0.0.0.0',
    maxPostBodyLen: 1e6,
    port: 1987,
    timeout: 30
  };

  _server = null;

  constructor(responseService, loggerService) {
    super();
    this.responseService = responseService;
    this.loggerService = loggerService;
  }

  init() {
    super.init();
    this._server = http.createServer();
    this._server.timeout = this.config.timeout * 1000;
    return new Promise((resolve) => {
      this._server.listen(this.config.port, this.config.host, resolve);
    }).then(() => {
      // eslint-disable-next-line
      const MESSAGE = `==> Listening on port ${this.config.port}. Open up http://${this.config.host}:${this.config.port}/ in your browser.`;
      this.loggerService.render(LOG_LEVEL.INFO, MESSAGE);
    });
  }

  onClose(callback) {
    this._server.on('close', callback);
  }

  onRequest(callback) {
    this._server.on('request', (request, response) => {
      return this.execute(request, response, callback);
    });
  }

  readBody(ctx, request) {
    return new Promise((resolve) => {
      if (request.method === 'POST' || request.method === 'PUT') {
        let body = '';
        request.on('data', (data) => {
          body += data;
          if (body.length > this.config.maxPostBodyLen) {
            request.connection.destroy();
          }
        });
        request.on('end', () => {
          const type = request.headers['content-type'].split(';')[0];
          switch (type) {
            case 'application/json':
              ctx.body = JSON.parse(body);
              break;
            default:
              if (body && body.length) {
                ctx.body = q.parse(body);
              }
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  execute(request, response, callback) {

    const u = parse(request.url);
    const $url = new URL('http://' + request.headers.host);
    const ctx = createContext({
      hostname: $url.hostname,
      headers: request.headers,
      method: request.method,
      url: u.pathname,
      ip: (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress
    });

    if (u.query) {
      ctx.route.params = q.parse(u.query);
    }

    this.readBody(ctx, request)
      .then(() => {
        return callback(ctx);
      })
      .catch((e) => {
        const body = {};
        const status = e.code && Number.isInteger(e.code) ? e.code : 500;

        body.code = status;
        body.message = e.message;
        body[status < 300 ? 'data' : 'errors'] = e.fields || {};

        return {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': ResponseService.types.json
          },
          status
        };
      })
      .then((data) => {
        if (data.filePath) {
          return this.responseService.renderFile(response, data);
        }
        return this.responseService.render(response, data);
      });
  }
}
