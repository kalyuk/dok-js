export class CoreError extends Error {
  code = 500;

  constructor(code = 500, message, fields = {}) {
    super(message);
    this.code = code;
    this.fields = fields;
  }
}
