export function setWithDefault(obj, key, valueFunc, defaultValue) {
  if (obj[key] === undefined) {
    obj[key] = defaultValue
  }
  obj[key] = valueFunc(obj[key])
}
