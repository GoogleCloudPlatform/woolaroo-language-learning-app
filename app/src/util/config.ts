type ConfigObject = {[index:string]:any};

export function mergeConfigurations(config1:ConfigObject, config2:ConfigObject):ConfigObject {
  return deepMerge(config1, config2);
}

function deepMerge(obj1:ConfigObject, obj2:ConfigObject):ConfigObject {
  if(!obj1 || !obj2) {
    return deepCopy(obj1 || obj2);
  } else {
    const newVal = deepCopy(obj1);
    deepCopyInto(obj2, newVal);
    return newVal;
  }
}

function deepCopy(src:ConfigObject):ConfigObject {
  const dest:ConfigObject = {};
  deepCopyInto(src, dest);
  return dest;
}

function deepCopyInto(src:ConfigObject, dest:ConfigObject):void {
  for(const k in src) {
    const val = src[k];
    if(typeof(val) === "object" && val && !val.hasOwnProperty('length')) {
      dest[k] = deepMerge(dest[k], val);
    } else {
      dest[k] = val;
    }
  }
}
