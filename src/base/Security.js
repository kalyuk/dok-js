import crypto from "crypto";
import Service from "./Service";
export default class Security extends Service {

  static defaultOptions = {
    algorithm: "sha512",
    salt: "0dmfuw42w"
  };

  getHash(string, options = {}) {
    const algorithm = options.algorithm || this.algorithm;
    const salt = options.salt || this.salt;
    const hash = crypto.createHmac(algorithm, salt);
    hash.update(string);
    return hash.digest("hex");
  }

  hashVerify(string, hash, options) {
    return this.getHash(string, options) === hash;
  }
}