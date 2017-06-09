import fs from 'fs';
import path from 'path';

function readAndCreateObject(dirPath) {
  let data = {};
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      data[file] = readAndCreateObject(fullPath);
    } else if (file.match(/\.js$/)) {
      const name = file.split('.js')[0];
      data[name] = "require('" + fullPath.replace(path.join(__dirname, '..'), '.') + "')." + name;
    }
  });

  return data;
}

const data = readAndCreateObject(path.join(__dirname, '..', 'dist'));

let string = 'var cache = {}; \n' +
  'exports.setApplication = function(instance){if (cache.application) {' +
  'throw new Error(\'The application is already running\');}cache.application = instance;}; \n' +
  'exports.getApplication = function(){return cache.application;};\n';

Object.keys(data).forEach(key => {
  string += 'exports.' + key + '=' + JSON.stringify(data[key]).replace(/"/ig, '') + ';\n';
});

fs.writeFileSync(path.join(__dirname, '..', 'index.js'), string);