const c = require('cheerio')
const sa = require('superagent')
const { getPage } = require('./urlTools')

const getPics = async url => {
  const page = getPage(url)
  
  const result = await sa.get(url).then(res => {
    const $ = c.load(res.text)
    const pics = Array.from($('p[align="center"]'))
    const picArr = []
    
    pics.forEach(child => {
      if (child.children[0].type !== 'tag') return;

      let src = ''
      switch (child.children[0].name) {
        case 'img':
          src = child.children[0].attribs.src
          break;
        case 'a':
          src = child.children[0].attribs.href
          break;
      }

      let discription = child.children.pop()
      if (discription.type === 'text') {
        discription = discription.data
      } else {
        discription = ''
      }
      discription = discription || ''
      discription = discription.replace(/(\n)|(\snull)/g, '')
      const name = (`${page}-${picArr.length + 1} ` + discription).trim()

      picArr.push({ src, name })
    })
    return picArr;
  }).catch(err => [])

  return result;
}

module.exports = getPics
