export function createContext(ctx) {
  return Object.assign({
    body: '',
    content: '',
    headers: {},
    url: '',
    route: null,
    method: ''
  }, ctx);
}
