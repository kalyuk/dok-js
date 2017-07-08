import {Application} from '../base/Application';
import {ResponseConsoleService} from '../service/ResponseConsoleService';
import {MigrateModule} from '../modules/migrate/MigrateModule';

export class ConsoleApplication extends Application {
  static options = {
    modules: {
      migrate: {
        func: MigrateModule
      }
    },
    services: {
      ResponseService: {
        func: ResponseConsoleService
      },
      RouteService: {
        options: {
          routes: {
            'COMMAND migrate:<actionName:up|down|create>': {
              controllerName: 'index',
              moduleName: 'migrate'
            }
          }
        }
      }
    }
  };

  async run() {
    const ctx = {
      headers: {},
      method: 'COMMAND',
      url: this.arguments.route
    };

    const content = await this.runRoute(ctx);

    this.getService('ResponseService').render(content);
  }
}