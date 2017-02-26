import throwErr from '../utils/throwErr';
import isFunction from '../utils/isFunction';

const ALL = Symbol('ALL');

export default class Field {
  constructor(value, hooks = Object.create(null)) {
    this.value = value;
    this.hooks = hooks;

    return this;
  }

  clone() {
    let value = this.value;
    if ('clone' in value) {
      if (isFunction(value.clone)) {
        value = value.clone();
      }
    }
    return new Field(value, this.hooks);
  }

  setValue(newValue) {
    this.value = newValue;
    this._performHooks('setValue', newValue);
    return this;
  }

  getValue() {
    this._performHooks('getValue');
    return this.value;
  }

  toString() {
    return String(this.value);
  }

  valueOf() {
    return this.value;
  }

  addHook(method, hook) {
    this.hooks[method] = this.hooks[method] || new Set();
    this.hooks[method].add(hook);
    return this;
  }

  removeHook(method = ALL, hook = ALL) {
    if (method === ALL) {
      this.hooks = Object.create(null);
    } else if (method in this.hooks) {
      if (hook === ALL) {
        this.hooks[method].clear();
      } else {
        this.hooks[method].delete(hook);
      }
    }
    return this;
  }

  _performHook(hook, args) {
    try {
      hook(this, ...args);
    } catch (err) {
      throwErr(err);
    }
  }

  _performHooks(method, ...args) {
    if (!(method in this.hooks)) return;
    this.hooks[method].forEach(hook => this._performHook(hook, args));
  }
}
