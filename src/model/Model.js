

import throwErr from '../utils/throwErr';

const ALL = Symbol('ALL');
const FIELDS = Symbol('fields');
const MIDDLEWARES = Symbol('middlewares');
const SYMBOLS = Symbol('symbols');
const NO_ARG = Symbol('NO_ARG');

let throwCb = throwErr;


export default class Model {
  static setThrowCallback(callback) {
    throwCb = callback;
  }

  static extend(modelName, Parent = NO_ARG) {
    if (Parent === NO_ARG) return Model.extend(Model, modelName);
    const res = class extends Parent {};

    res.extend = childModelName => Model.extend(childModelName, res);

    res.use = usePlugin(res);

    res.name = modelName;
    return res;
  }

  static clone(model) {
    return model.clone();
  }

  constructor(descriptor, options = {}) {
    const {
      [SYMBOLS]: symbols = [],
      [FIELDS]: fields = Object.create(null),
      [MIDDLEWARES]: middlewares = Object.create(null),
    } = options;
    this.descriptor = descriptor;
    this[FIELDS] = fields;
    this[MIDDLEWARES] = middlewares;
    this[SYMBOLS] = symbols;


    return this;
  }

  clone() {
    const { descriptor } = this;
    return new this.constructor(descriptor, this);
  }

  field(fieldName, fieldValue) {
    this[FIELDS][fieldName] = fieldValue;
    return this;
  }

  set(field, value, ...rest) {
    this[FIELDS][field] = this._performMiddlewares(field, value, ...rest);
    return this;
  }

  get(field) {
    return this[FIELDS][field].getValue();
  }

  _performMiddleware(middleware, value, ...rest) {
    let result = value;
    try {
      result = middleware.call(this, value, ...rest);
    } catch (err) {
      throwCb(err);
    }
    return result;
  }

  _performMiddlewares(field, value, ...rest) {
    if (!this[MIDDLEWARES][field]) return value;
    return this[MIDDLEWARES][field].reduce((result, middleware) => {
      const nextResult = this._performMiddleware(middleware, result, ...rest);
      return nextResult;
    }, value);
  }


  addMiddleware(field, middleware) {
    this[MIDDLEWARES][field] = this[MIDDLEWARES][field] || [];
    this[MIDDLEWARES][field].push(middleware);
    return this;
  }

  removeMiddleware(field = ALL, middleware = ALL) {
    if (field === ALL) {
      this[MIDDLEWARES] = Object.create(null);
    } else if (field in this[MIDDLEWARES]) {
      if (middleware === ALL) {
        this[MIDDLEWARES][field] = [];
      } else {
        this[MIDDLEWARES][field] = this[MIDDLEWARES][field].filter(mid => middleware !== mid);
      }
    }
    return this;
  }

}

Model.use = usePlugin(Model);

function usePlugin(ModelConstructor) {
  return function use(plugin) {
    plugin.getMethods().forEach(({ name, method, isStatic }) => {
      const target = isStatic ? ModelConstructor : ModelConstructor.prototype;
      if (Object.prototype.hasOwnProperty.call(target, name)) {
        throw new Error(`Model(${ModelConstructor.name}) already has method with name ${name}.`);
      }
      target[name] = method;
    });
    return ModelConstructor;
  };
}
