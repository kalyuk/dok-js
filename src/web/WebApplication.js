import {Application} from '../base/Application';
import {HttpService} from '../service/HttpService';
import {ResponseService} from '../service/ResponseService';
import {PugService} from '../service/PugService';
import {StaticModule} from '../modules/static/StaticModule';
import {JwtService} from '../service/JwtService';

export class WebApplication extends Application {
  static options = {
    modules: {
      migrate: {
        func: StaticModule
      }
    },
    services: {
      JwtService: {
        func: JwtService
      },
      HttpService: {
        func: HttpService
      },
      ResponseService: {
        func: ResponseService
      },
      PugService: {
        func: PugService
      }
    }
  };

  init() {
    super.init();
    this.httpService = this.getService('HttpService');
  }

  listen() {
    this.init();
    this.httpService.onRequest((ctx) => {
      return this.runRoute(ctx);
    });
  }
}
