export default class Plugin {
  static hasField(plugin, name){
    return plugin.fields.some((field) => field.name === name);
  }

  constructor(name, namespace = Symbol('unique namespace')) {
    this.name = name;
    this.ns = namespace;
    this.methods = {};
    this.fields = [];
  }

  namespace(namespace) {
    this.ns = namespace;
    return this;
  }

  method(methodName, methodBody, isStatic = false) {
    if (Object.prototype.hasOwnProperty.call(this.methods, methodName)) {
      throw new Error(`Plugin(${this.name}) already has method with name "${methodName}".`);
    }
    this.methods[methodName] = { method: methodBody, isStatic };
    return this;
  }

  field(name, initValue) {
    if (Plugin.hasField(this, name)) {
      throw Error(`Plugin(${this.name}) already has field with "${name}".`)
    }
    this.fields.push({ name, value: initValue });
    return this;
  }

  getNamespace() {
    return this.ns;
  }

  getMethods() {
    return Object.keys(this.methods).reduce((result, name) => {
      const { [name]: { method, isStatic } } = this.methods;
      const descriptor = { name, method, isStatic };

      result.push(descriptor);
      return result;
    }, []);
  }

  getFields() {
    return this.fields.map(v => Object.assign({}, v));
  }
}

