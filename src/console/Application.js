import {Application as BaseApplication} from '../base/Application';
import {ResponseService} from '../console/ResponseService';
import {MigrateModule} from '../modules/migrate/MigrateModule';

export class Application extends BaseApplication {
  static options = {
    services: {
      RouterService: {
        options: {
          routes: {
            'COMMAND migrate:<actionName:up|down|create>': {
              moduleName: 'migrate',
              controllerName: 'index'
            }
          }
        }
      },
      ResponseService: {
        func: ResponseService
      }
    },
    modules: {
      migrate: {
        func: MigrateModule
      }
    }
  };

  async run() {
    let ctx = {
      headers: {},
      method: 'COMMAND',
      url: this.arguments.route
    };

    ctx.content = await this.runRoute(ctx);

    this.getService('ResponseService').render(ctx);
  }

}