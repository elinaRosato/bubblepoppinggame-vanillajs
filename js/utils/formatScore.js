const formatScore = (value, compactFormat = true) => {
  if (compactFormat) {
    return new Intl.NumberFormat('en-GB', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value)
  }

  return new Intl.NumberFormat().format(value)
}
