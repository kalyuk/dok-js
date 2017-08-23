import {Service} from '../base/Service';
import crypto from 'crypto';
import Hashids from 'hashids';

export class SecurityService extends Service {
  static options = {
    algorithm: 'sha512',
    salt: '0dmfuw42w3d' + (new Date()).getTime(),
    hashLength: 8,
    hashAlphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  };

  init() {
    super.init();
    this.$hashids = new Hashids(this.config.salt, this.config.hashLength, this.config.hashAlphabet);
  }

  getHash(string, options = {}) {
    const algorithm = options.algorithm || this.config.algorithm;
    const salt = options.salt || this.config.salt;
    const hash = crypto.createHmac(algorithm, salt);
    hash.update(string);
    return hash.digest('hex');
  }

  hashVerify(string, hash, options) {
    return this.getHash(string, options) === hash;
  }

  id2Hash(id) {
    return this.$hashids.encode(id);
  }

  hash2Id(hash) {
    const tmp = this.$hashids.decode(hash);
    if (tmp && tmp.length) {
      return tmp[0];
    }
    return null;
  }
}