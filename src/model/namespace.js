const DIFF_ERROR = 'Can not copy namespaces on objects with different constructor';

const NAMESPACE_CREATORS = Symbol('NAMESPACE_CREATORS');
export const NAMESPACES = Symbol('NAMESPACES');

const getCreator = function getCreator(namespace) {
  return function namespaceCreate(instance, prevInstance = null) {
    instance[NAMESPACES] = instance[NAMESPACES] || Object.create(null);
    instance[NAMESPACES][namespace] = Object.create(null);
    if (prevInstance !== null) {
      copyNamespace(instance, prevInstance, namespace);
    }
    return instance;
  }
};

export function initNamespaces(Model){
  Model.namespaces = [];
  Model[NAMESPACE_CREATORS] = [];
}

export function addNamespace(Model, namespace) {
  Model.namespaces = Model.namespaces.concat(namespace);
  Model[NAMESPACE_CREATORS] = Model[NAMESPACE_CREATORS].concat(getCreator(namespace));
  return Model;
}

export function hasNamespace(Model, namespace) {
  return Model.namespaces.indexOf(namespace) !== -1;
}

export function getNamespaces(Model) {
  return [...Model.namespaces];
}

export function getNamespaceCreators(Model) {
  return [...Model[NAMESPACE_CREATORS]];
}

export function addFieldToNamespace(Model, namespace, field, value){

}

export function copyNamespace(target, source, namespace) {
  if (target.constructor !== source.constructor) throw new Error(DIFF_ERROR);
  Object.assign(target[NAMESPACES][namespace], source[NAMESPACES][namespace]);
  return target;
}

export default function useModel(Model) {
  initNamespaces(Model);

  Model.addNamespace = (namespace) => {
    return addNamespace(Model, namespace);
  };

  Model.hasNamespace = (namespace) => {
    return hasNamespace(Model, namespace);
  };

  Model.getNamespaces = () => {
    return getNamespaces(Model);
  };

  Model.getNamespaceCreators = () => {
    return getNamespaceCreators(Model);
  };

  return Model;
}