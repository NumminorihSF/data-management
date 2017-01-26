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
  JSON_VALUE,
  setData,
  getValidType,
  clone
} from '../constants';

const AVAILABLE_TYPES = [ REMOTE_AND_LOCAL, REMOTE_ONLY, LOCAL_ONLY ];
const DEFAULT_TYPE = AVAILABLE_TYPES[0];

export default class Field {
  static [getValidType](type = DEFAULT_TYPE){
    if (AVAILABLE_TYPES.indexOf(type) === -1) {
      return DEFAULT_TYPE;
    }
    return type;
  }

  static [clone](field){
    if (!(field instanceof Field)) throw new Error(`Can\'t clone as Field (${field}).`);
    return new Field(field[SCHEMA], field[TYPE])
  }

  constructor(schema, type = Field[getValidType]()){
    this[SCHEMA] = schema;
    this[TYPE] = type;

    this[IS_VALID] = null;
    this[IS_DELETED] = null;
    this[IS_NEW] = null;
    this[LAST_CHANGED] = null;
    this[LAST_SYNC] = null;
    this[CURRENT_VALUE] = null;
    this[INITIAL_VALUE] = null;
    this[REMOTE_VALUE] = null;
    this[INITIAL_KEY] = null;
    this[REMOTE_KEY] = null;
  }

  clone(){
    return Field[clone](this);
  }

  setInitial(data){
    const result = this.clone();
    result[INITIAL_VALUE] = result[INITIAL_VALUE] || data;
    return result;
  }

  setRemote(data){
    const result = this.clone();
    result[REMOTE_VALUE] = result[REMOTE_VALUE] || data;
    return result;
  }

  set(data){
    const result = this.clone();
    result[CURRENT_VALUE] = result[CURRENT_VALUE] || data;
    return result;
  }

  reventToRemote(){
    return this.set(this[REMOTE_VALUE]);
  }

  revertToImitial(){
    return this.set(this[INITIAL_VALUE]);
  }

  valueOf(){
    return this[CURRENT_VALUE];
  }

  toString(){
    return this[CURRENT_VALUE];
  }
}