export default function isFunction(something) {
  if (typeof something === 'function') return true;
  return typeof something === 'object' && Object.prototype.toString.call(something) === '[object Function]';
}
