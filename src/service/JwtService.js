import {Service} from '../base/Service';
import jwt from 'jsonwebtoken';
import {getService} from '../index';

export class JwtService extends Service {

  static options = {
    expiresIn: 60 * 60,
    salt: 'd9ks7nv9xm3' + (new Date()).getTime()
  };

  sign(payload) {
    const exp = Math.floor(Date.now() / 1000) + this.config.expiresIn;
    const data = {exp, payload};
    const accessToken = jwt.sign(data, this.config.salt);
    return {
      accessToken,
      accessTokenExpire: exp,
      refreshToken: getService('SecurityService').getHash(accessToken)
    };
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.config.salt, (err, decoded) => {
        if (err) {
          reject('sec.access_token_invalid');
        }
        resolve(decoded);
      });
    });
  }

}
