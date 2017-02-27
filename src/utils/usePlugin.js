const onHasMethodWithSameName = function usePlugin_onHasMethodWithSameName (constructor, { name, method, isStatic }) {
  let staticWarnPart = isStatic ? 'static' : 'non-static';
  throw new Error(`Model(${constructor.name}) already has ${staticWarnPart} method with name "${name}".`);
};

const checkMethodWithSameName = function usePlugin_checkMethodWithSameName (constructor, { name, method, isStatic }) {
  const target = isStatic ? constructor : constructor.prototype;
  if (Object.prototype.hasOwnProperty.call(target, name)) {
    onHasMethodWithSameName(constructor, { name, method, isStatic })
  }
};

const addMethods = function usePlugin_addMethods (constructor, plugin) {
  plugin.getMethods().forEach(({ name, method, isStatic }) => {
    const target = isStatic ? constructor : constructor.prototype;
    checkMethodWithSameName(constructor, { name, method, isStatic });
    target[name] = method;
  });
};

const onHasFieldWithSameName = function usePlugin_onHasFieldWithSameName (constructor, namespace, { name }) {
  throw new Error(`Model(${constructor.name}) already has field with name "${name}" in namespace "${namespace}".`);
};

const checkFieldWithSameName = function usePlugin_checkMethodWithSameName (constructor, namespace, { name, method, isStatic }) {
  const target = isStatic ? constructor : constructor.prototype;
  if (Object.prototype.hasOwnProperty.call(target, name)) {
    onHasMethodWithSameName(constructor, { name, method, isStatic })
  }
};

const addFields = function usePlugin_addFields (constructor, namespace, plugin) {
  plugin.getFields().forEach(({ name, value }) => {
    const target = isStatic ? constructor : constructor.prototype;
    checkMethodWithSameName(constructor, { name, method, isStatic });
    target[name] = method;
  });
};

export default function usePlugin (constructor) {
  return function use (plugin) {
    const namespace = plugin.getNamespace();
    constructor.addNamespace(namespace);
    addMethods(constructor, plugin);
    addFields(constructor, namespace, plugin);
    return constructor;
  };
}
