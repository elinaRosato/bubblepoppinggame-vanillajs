const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName)

  Object.assign(element, options)

  return element
}
