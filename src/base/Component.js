export default class Component {

  static defaultOptions = {};

  /**
   * @param {Object} config
   */
  constructor(config) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    });
  }

  /**
   * @return {string}
   */
  className() {
    return this.constructor.name;
  }

  preInit() {

  }

  init() {
    this.preInit();
  }

}