import BaseResponse from "../base/Response";
import _ from "lodash";

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

  render(content, response) {
    const result = _.defaultsDeep(content, this.config);

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

    response.statusCode = result.state;
    response.setHeader("Content-Length", Buffer.byteLength(data) + "");
    response.write(data);
    response.end();
    return null;
  }

}