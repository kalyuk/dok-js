import {Application as BaseApplication} from '../base/Application';
import {HttpService} from './HttpService';
import {ResponseService} from './ResponseService';

export class Application extends BaseApplication {
  static options = {
    services: {
      HttpService: {
        func: HttpService
      },
      ResponseService: {
        func: ResponseService
      }
    }
  };

  init() {
    super.init();
    const httpService = this.getService('HttpService');

    httpService.onRequest((ctx) => {
      return this.runRoute(ctx);
    });
  }

  run() {
    this.getService('HttpService').run();
  }
}