import {Application} from '../../src/web/Application';
import path from 'path';

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'example.js');
export const APP = new Application(CONFIG_PATH);
APP.init();
APP.run();
