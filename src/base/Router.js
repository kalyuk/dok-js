import Service from "./Service";
export default class Router extends Service {

  static defaultOptions = {
    routes: {}
  };

  init() {
    Object.keys(this.routes).forEach((route) => {
      this.routes[route].keyParams = [];
      this.routes[route].$route = route.replace(/<(.*?):(.*?)>/ig, (m, attr, key) => {
        this.routes[route].keyParams.push(attr);
        return "(" + key + ")";
      });
    });
  }

  getRoute(method, url) {
    let $route = null;

    Object.keys(this.routes).some((key) => {
      const route = this.routes[key].$route;
      let $method = "all";
      const tmp = route.split(" ");
      let $url = tmp[0];

      if (tmp.length > 1) {
        $method = tmp[0].toUpperCase();
        $url = tmp[1];
      }

      const re = new RegExp(`^${$url}$`);

      const $match = url.match(re);

      if (($method === "all" || $method === method) && $match) {
        $route = {
          moduleName: this.routes[key].module || "",
          controllerName: this.routes[key].controller || "",
          actionName: (this.routes[key].action || "") + "Action"
        };

        $route = Object.assign($route, this.routes[key].params || {});

        this.routes[key].keyParams.forEach((attr, index) => {
          const attrName = ["controller", "module", "action"].indexOf(attr) !== -1 ? attr + "Name" : attr;
          const value = $match[index + 1];
          $route[attrName] = attr === "action" ? value + "Action" : value;
        });

        return true;
      }
      return false;
    });

    if ($route === null) {
      throw new Error("Route " + url + " not found");
    }

    return $route;
  }
}