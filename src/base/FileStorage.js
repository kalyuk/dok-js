import path from "path";
import Service from "./Service";

export default class FileStorage extends Service {
  static defaultOptions = {
    deepLevel: 3
  };

  getPath() {
    return this.path;
  }

  getDirectoryPath(id) {
    const p = [];

    let n = id;
    for (let i = 0; i < this.deepLevel; i++) {
      n = Math.floor(n / 1000);
      p.push(n);
    }

    return path.join(this.getPath(), p.join("/"), id.toString())
  }

  getDirectoryPathByHash(hash) {
    const p = [];

    for (let i = 0; i < Math.floor(hash.length / 2); i++) {
      p.push(hash.substr(i * 2, 2));
    }
    return path.join(this.getPath(), p.join("/"), hash)
  }

  getUrlByHash(hash, prefix = "") {
    return prefix + this.getDirectoryPathByHash(hash).replace(this.getPath(), "").replace(/\\/ig, "/");
  }

}