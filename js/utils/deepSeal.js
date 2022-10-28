const deepSeal = (object) => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object)

  // Seal properties before Sealing self
  for (const name of propNames) {
    const value = object[name]

    if (value && typeof value === 'object') {
      deepSeal(value)
    }
  }

  return Object.seal(object)
}
