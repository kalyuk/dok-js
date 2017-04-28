import Service from "../base/Service";

export default class MemorySession extends Service {
  $cache = {};

  setValue(id, key, value) {
    if (!this.$cache[id]) {
      this.$cache[id] = {};
    }

    this.$cache[id][key] = value;
  }

  getValue(id, key) {
    return this.$cache[id] && this.$cache[id][key];
  }

  remove(id) {
    delete this.$cache[id];
  }

}