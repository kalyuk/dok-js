import * as http from 'http';
import {Service} from '../base/Service';
import {LOG_LEVEL} from '../base/LoggerService';
import {ResponseService} from './ResponseService';

export class HttpService extends Service {
  static options = {
    host: '0.0.0.0',
    maxPostBodyLen: 1e6,
    port: 1987,
    timeout: 30
  };
  server = null;

  // eslint-disable-next-line
  $inject(LoggerService, ResponseService) {
    this.logger = LoggerService;
    this.response = ResponseService;
  }

  init() {
    super.init();
    this.server = http.createServer();
    this.server.timeout = this.config.timeout * 1000;
  }

  onClose(callback) {
    this.server.on('close', callback);
  }

  onRequest(callback) {
    this.server.on('request', (request, response) => {
      return this.execute(request, response, callback);
    });
  }

  run() {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, () => {
        const MESSAGE = `==> Listening on port ${this.config.port}. 
Open up http://${this.config.host}:${this.config.port}/ in your browser.`;
        this.logger.render(LOG_LEVEL.INFO, MESSAGE);
        resolve();
      });
    });
  }

  readBody(ctx, request) {
    return new Promise((resolve) => {

      if (request.method === 'POST' || request.method === 'PUT') {
        ctx.body = '';
        request.on('data', (data) => {
          ctx.body += data;
          if (ctx.body.length > this.config.maxPostBodyLen) {
            request.connection.destroy();
          }
        });
        request.on('end', () => {
          resolve(ctx);
        });
      } else {
        resolve(ctx);
      }
    });
  }

  async execute(request, response, callback) {
    let ctx = {
      headers: request.headers,
      method: request.method,
      url: request.url
    };

    try {
      ctx = await this.readBody(ctx, request);
      ctx.content = await callback(ctx);
      this.response.render(response, ctx);
    } catch (e) {
      this.logger.render(LOG_LEVEL.ERROR, e.message);
      ctx.content = {
        headers: {
          'Content-Type': ResponseService.types.html
        },
        status: 500,
        body: e.message
      };
      this.response.render(response, ctx);
    }
  }
}