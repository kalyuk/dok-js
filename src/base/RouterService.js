import {Service} from './Service';

export class RouterService extends Service {
  static options = {
    routes: []
  };

  init() {
    super.init();

    Object.keys(this.config.routes).forEach((urlKey) => {
      this.config.routes[urlKey].keyParams = [];
      const splitedUrl = urlKey.split(' ');

      if (splitedUrl.length > 1) {
        this.config.routes[urlKey].method = splitedUrl[0].toUpperCase();
        this.config.routes[urlKey].url = splitedUrl[1];
      } else {
        this.config.routes[urlKey].method = 'ALL';
        this.config.routes[urlKey].url = splitedUrl[0];
      }

      this.config.routes[urlKey].url = this.config.routes[urlKey].url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
        this.config.routes[urlKey].keyParams.push(attr);
        return '(' + key + ')';
      });

      this.config.routes[urlKey].regexp = new RegExp(`^${this.config.routes[urlKey].url}$`);
    });
  }

  matchRoute(ctx) {
    Object.keys(this.config.routes).some((urlKey) => {
      if (this.config.routes[urlKey].method === 'ALL' || this.config.routes[urlKey].method === ctx.method) {
        const match = ctx.url.match(this.config.routes[urlKey].regexp);
        if (match) {
          ctx.route = {
            params: {...this.config.routes[urlKey].params}
          };

          this.config.routes[urlKey].keyParams.forEach((key, index) => {
            const value = match[index + 1];
            ctx.route.params[key] = decodeURIComponent(value);
          });

          ctx.route.actionName = this.config.routes[urlKey].actionName || ctx.route.params.actionName;
          ctx.route.controllerName = this.config.routes[urlKey].controllerName || ctx.route.params.controllerName;
          ctx.route.moduleName = this.config.routes[urlKey].moduleName || ctx.route.params.moduleName;

          return true;
        }
      }
      return false;
    });

    if (!ctx.route.controllerName) {
      throw new Error(`Route: ${ctx.method} ${ctx.url} not found`);
    }
  }
}