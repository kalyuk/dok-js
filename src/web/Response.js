import BaseResponse from "../base/Response";
import _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

export default class Response extends BaseResponse {

  static defaultOptions = {
    config: {
      body: "",
      headers: {
        "Content-Encoding": "UTF-8",
        "Content-Type": "application/json"
      },
      state: 200
    }
  };

  renderFile(content, response) {
    if (!fs.existsSync(content.filePath)) {
      return {
        headers: {
          "Content-Type": "plain/text"
        },
        body: "file not found",
        state: 404
      };
    }
    const ext = path.extname(content.filePath);
    let type;
    switch (ext) {
      case "eot":
        type = "application/vnd.ms-fontobject";
        break;
      case "ttf":
        type = "application/octet-stream";
        break;
      case "svg":
        type = "image/svg+xml";
        break;
      case "woff":
        type = "application/font-woff";
        break;
      case "woff2":
        type = "font/woff2";
        break;
      default:
        type = mime.contentType(content.filePath)
    }

    response.writeHead(200, {
      "Content-Type": type
    });
    fs.createReadStream(content.filePath).pipe(response);
    return null;
  }

  render(ctx, content, response) {
    let result = _.defaultsDeep(content, this.config);

    if (content.filePath) {
      let r = this.renderFile(content, response);
      if (r === null) {
        return null;
      }
      result = Object.assign(result, {
        headers: {
          "Content-Type": "plain/text"
        },
        body: "file not found",
        state: 404
      });
    }

    const data = Response.getContent(result.body);

    Object.keys(result.headers).forEach((header) => {
      if (typeof result.headers[header] === "string") {
        response.setHeader(header, result.headers[header]);
      } else {
        result.headers[header].forEach(hData => {
          response.setHeader(header, hData);
        });
      }
    });

    if (ctx.cookie.__.new.length) {
      ctx.cookie.__.new.forEach(cookie => {
        response.setHeader("Set-Cookie", cookie);
      });
    }

    if (ctx.cookie.__.remove.length) {
      ctx.cookie.__.remove.forEach(cookie => {
        response.setHeader("Set-Cookie", cookie);
      });
    }

    response.statusCode = result.state;
    response.setHeader("Content-Length", Buffer.byteLength(data) + "");
    response.write(data);
    response.end();
    return null;
  }

}