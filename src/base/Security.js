import crypto from "crypto";
import Hashids from "hashids";
import Service from "./Service";
export default class Security extends Service {

  static defaultOptions = {
    algorithm: "sha512",
    salt: "0dmfuw42w",
    hashLength: 8,
    hashAlphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  };

  init() {
    this.hashids = new Hashids(this.salt, this.hashLength, this.hashAlphabet);
  }

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

  id2Hash(id) {
    return this.hashids.encode(id)
  }

  hash2Id(hash) {
    const tmp = this.hashids.decode(id);
    if (tmp && tmp.length) {
      return tmp[0];
    }
    return null;
  }
}