export class Controller {
  $module = null;

  init(module, id) {
    this.id = id;
    this.$module = module;
  }

  getBehaviors() {
    return [];
  }

  render(status, body, headers = {}) {
    return {
      body,
      headers,
      status
    };
  }
}