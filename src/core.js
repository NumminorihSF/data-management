import {
  SCHEMA,
  IMMUTABLE,
  API,
  DATA,
  IS_CHANGED,
  IS_VALID,
  IS_DELETED,
  IS_NEW,
  TYPE,
  REMOTE_ONLY,
  REMOTE_AND_LOCAL,
  LOCAL_ONLY,
  LAST_CHANGED,
  LAST_SYNC,
  CURRENT_VALUE,
  INITIAL_VALUE,
  REMOTE_VALUE,
  INITIAL_KEY,
  REMOTE_KEY,
  JSON_VALUE
} from './constants';

import plainObjectApi from './api/plainObject';


class DataModel {
  constructor(schema, immutable = false){
    if (this.constructor !== DataModel) {
      return new DataModel(schema);
    }
    this[SCHEMA] = schema;
    this[IMMUTABLE] = immutable;
    this[API] = plainObjectApi;
    this[DATA] = null;

    return DataModel.createProxy(this);
  }

  setApi(api){
    this[API] = api;
    return this;
  }

  setData(data){
    this[DATA] = data;
  }

  static getFunction(context, original){
    const self = context;
    return function(...rest){
      if (!context[IMMUTABLE]) return original.call(self, ...rest);
      if (!original.mutateData) return original.call(self, ...rest);
      const data = original.call(self, ...rest);
      const model = new DataModel(context[SCHEMA], context[IMMUTABLE]);
      model.setApi(context[API]);
      model.setData(data);
      return model;
    }
  }
  static createProxy(context){
    return new Proxy(context, {
      get(target, key){
        if (key in context) return context[key];
        const prop = target[API][key];
        if (!(prop instanceof Function)) return prop;
        return DataModel.getFunction(target, prop);
      },
      has(target, key){
        return ( key in context ) || ( key in target[API] );
      },
      enumerate() {
        return [][Symbol.iterator]();
      },
      getPrototypeOf(target){
        return target;
      }
    })
  }
}
