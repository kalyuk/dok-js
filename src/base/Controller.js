export default class Controller {
  getBehaviors() {
    return [];
  }

  constructor(viewPath) {
    this.id = this.constructor.name.split("Controller")[0].toLowerCase();
    this.viewPath = viewPath;
  }

}