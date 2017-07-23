import {Service} from '../base/Service';

import redis from 'redis';
import {LOG_LEVEL} from './LoggerService';
import {getApplication} from '../index';
import {createContext} from '../base/Context';

export class RedisService extends Service {
  static options = {
    host: '127.0.0.1',
    port: '6379'
  };

  _client = null;

  constructor(loggerService) {
    super();
    this.loggerService = loggerService;
  }

  init() {
    super.init();
    this._client = this._createConnect('Main client');
    this._clientSub = this._createConnect('Subscriber');
    this._clientPub = this._createConnect('Publisher');

    this._clientSub.on('message', async (channel, message) => {
      const data = JSON.parse(message);

      if (data.url) {
        const ctx = createContext({
          method: 'QUEUE',
          url: data.url,
          body: data.body || {}
        });

        try {
          const result = await getApplication().runRoute(ctx);
          this._clientPub.publish(channel, JSON.stringify(result));
        } catch (e) {
          this.loggerService.render(e.code, e.message);
        }
      }
    });

    this._clientSub.subscribe(getApplication().getId());
  }

  _createConnect(name) {
    const client = redis.createClient(this.config);

    client.on('error', (err) => {
      this.loggerService.render(LOG_LEVEL.ERROR, `${name}: ${err}`);
    });

    client.on('connect', () => {
      this.loggerService.render(LOG_LEVEL.INFO, `${name}: Connected`);
    });

    return client;
  }

  set(key, value) {
    this._client.set(key, value);
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (err, value) => {
        if (err) {
          return reject(false);
        }
        return resolve(value);
      });
    });
  }

}