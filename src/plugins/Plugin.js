

export default class Plugin {
  constructor(name) {
    this.name = name;
    this.symbol = Symbol(name);
    this.methods = {};
    this.fields = [];
  }

  method(methodName, methodBody, isStatic = false) {
    if (Object.prototype.hasOwnProperty.call(this.methods, methodName)) {
      throw new Error(`Plugin(${this.name}) already has method with name ${methodName}.`);
    }
    this.methods[methodName] = { method: methodBody, isStatic };
    return this;
  }

  // TODO #field

  getMethods() {
    return Object.keys(this.methods).reduce((result, name) => {
      const { [name]: { method, isStatic } } = this.methods;
      const descriptor = { name, method, isStatic };

      result.push(descriptor);
      return result;
    }, []);
  }

  getFields() {
    return this.fields.map(v => v);
  }


}

