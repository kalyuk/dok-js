import {Service} from '../base/Service';
import {CoreError} from '../base/CoreError';
import {getApplication} from '../index';

export class RouteService extends Service {

  static options = {
    routes: {}
  };

  parseRoutes(routes) {
    Object.keys(routes).forEach((urlKey) => {
      routes[urlKey].keyParams = [];
      const splitedUrl = urlKey.split(' ');

      if (splitedUrl.length > 1) {
        routes[urlKey].method = splitedUrl[0].toUpperCase();
        routes[urlKey].url = splitedUrl[1];
      } else {
        routes[urlKey].method = 'ALL';
        routes[urlKey].url = splitedUrl[0];
      }

      routes[urlKey].url = routes[urlKey].url.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
        routes[urlKey].keyParams.push(attr);
        return '(' + key + ')';
      });

      routes[urlKey].regexp = new RegExp(`^${routes[urlKey].url}$`);
    });
  }

  init() {
    super.init();
    this.parseRoutes(this.config.routes);
  }

  matchRouteWithRoutes(ctx, routes) {
    Object.keys(routes).some((urlKey) => {
      if (routes[urlKey].method === 'ALL' || routes[urlKey].method === ctx.method) {
        const match = ctx.url.match(routes[urlKey].regexp);
        if (match) {
          ctx.route.params = Object.assign(ctx.route.params || {}, {...routes[urlKey].params});

          routes[urlKey].keyParams.forEach((key, index) => {
            const value = match[index + 1];
            ctx.route.params[key] = decodeURIComponent(value);
          });

          ctx.route.actionName = routes[urlKey].actionName || ctx.route.params.actionName;
          ctx.route.controllerName = routes[urlKey].controllerName || ctx.route.params.controllerName;
          ctx.route.moduleName = routes[urlKey].moduleName || ctx.route.params.moduleName || getApplication().getId();

          return true;
        }
      }
      return false;
    });

    if (!ctx.route) {
      throw new CoreError(404, `Route: ${ctx.method} ${ctx.url} not found`);
    }
  }

  matchRoute(ctx) {
    return this.matchRouteWithRoutes(ctx, this.config.routes);
  }
}