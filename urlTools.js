let baseUrl = ''

const getPage = url => {
  if (typeof url !== 'string') {
    return -1;
  }
  const endPart = url.split('/').pop().split('.')[0]
  if (endPart.indexOf('_') === -1) {
    baseUrl = url
    return 1;
  } else {
    return +endPart.split('_')[1];
  }
}

const getUrlByPage = page => {
  if (page < 2) return baseUrl;
  
  const newUrl = baseUrl.replace(
    /\.[^\.]*$/,
    `_${page}$&`
  )
  return newUrl;
}

module.exports = { getPage, getUrlByPage };
