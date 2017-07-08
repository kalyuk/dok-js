export class CoreError extends Error {
  code = 500;

  constructor(code = 500, message) {
    super(message);
    this.code = code;
  }
}