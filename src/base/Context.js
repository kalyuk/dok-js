export function createContext(ctx) {
  return Object.assign({
    body: '',
    content: '',
    hostname: '',
    headers: {},
    url: '',
    route: {},
    payload: {},
    method: ''
  }, ctx);
}
