const c = require('cheerio')
const sa = require('superagent')
const { getPage } = require('./urlTools')

const getPics = async url => {
  const page = getPage(url)
  
  const result = await sa.get(url).then(res => {
    const $ = c.load(res.text)
    const pics = Array.from($('.picact'))
    return pics.map((pic, index) => {
      const src = pic.attribs.src
      const ext = src.split('.').pop()
      const name = (`${page}-${index + 1} ` + (pic.next && pic.next.next.data.replace(/\n/, ''))).replace(' null', '')
      return { src, ext, name };
    })
  }).catch(err => [])

  return result;
}

module.exports = getPics
