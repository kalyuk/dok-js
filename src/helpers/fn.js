export function getFnParamNames(fn) {
  const fstr = fn.toString();
  return fstr.match(/\(.*?\)/)[0].replace(/[()]/gi, '').replace(/\s/gi, '').split(',');
}