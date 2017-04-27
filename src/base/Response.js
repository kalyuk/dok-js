import Service from "./Service";
export default class Response extends Service {
  static getContent(content) {
    if (typeof content === "object") {
      // eslint-disable-next-line
      content = JSON.stringify(content);
    }

    return content + "";
  }

  render() {

  }
}