export class Controller {
  $module = null;

  init(module) {
    this.$module = module;
  }

  getBehaviors() {
    return [];
  }

  render(status, body) {
    return {
      body,
      headers: {},
      status
    };
  }
}