import * as Validator from 'validator';
import {each} from 'async';

export class Model {

  $errors = {};

  attributes() {
    return Object.getOwnPropertyNames(this).filter((attr) => attr[0] !== '$' && attr[0] !== '_');
  }

  addError(attr, rule, message) {
    if (!this.$errors[attr]) {
      this.$errors[attr] = [];
    }
    this.$errors[attr].push({rule, message});
  }

  beforeValidate() {
    return true;
  }

  clearErrors() {
    this.$errors = {};
  }

  isBoolean(attr) {
    if (this[attr] === 'true') {
      this[attr] = true;
    } else if (this[attr] === 'false') {
      this[attr] = false;
    }
    return typeof this[attr] === 'boolean';
  }

  required(attr) {
    return this[attr] !== null && this[attr].length;
  }

  rules() {
    return [];
  }

  async validate() {
    if (await this.beforeValidate()) {
      return new Promise((resolve) => {
        each(this.rules(), (rule, callback) => {
          each(rule[0], async (attr, $callback) => {
            if (
              (this[rule[1]] && !await this[rule[1]](attr))
              || (!this[rule[1]] && Validator[rule[1]] && !Validator[rule[1]](this[attr] + '', rule[2] || {}))
            ) {
              this.addError(attr, rule[1], rule[2].message);
            }
            $callback();
          }, callback);
        }, (err) => {
          if (err) {
            throw new Error(err);
          }
          resolve(true);
        });
      });
    }
    return Promise.reject();
  }

  load(values = {}) {
    this.attributes().forEach((attr) => {
      if (values[attr] !== undefined) {
        this.setAttribute(attr, values[attr]);
      }
    });
  }

  getValidators() {
    return this.rules();
  }

  getValues() {
    const map = {};
    this.attributes().forEach((attr) => {
      map[attr] = this[attr];
    });

    return map;
  }

  getErrors() {
    return this.$errors;
  }

  hasErrors() {
    return Object.keys(this.$errors).length;
  }

  hasAttr(attr) {
    return this[attr] !== undefined && typeof this[attr] !== 'function';
  }

  setAttribute(attr, value) {
    if (this.hasAttr(attr)) {
      this[attr] = value;
    }
  }

  toJSON() {
    const data = {};

    this.attributes().forEach((attr) => {
      data[attr] = this[attr];
    });

    return data;
  }

}