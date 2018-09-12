const c = require('cheerio')
const sa = require('superagent')
const checkDir = require('./checkDir')
const { getPage } = require('./urlTools')

let title = ''

const getPics = async url => {
  const picArr = []
  const page = getPage(url)

  const pageText = await sa.get(url)
    .then(res => res.text)
    .catch(() => null)
  if (!pageText) return picArr;

  const $ = c.load(pageText)

  // 检查本地目标文件夹是否存在
  if (title === '') {
    const rawTitle = $('title').text()
    title = rawTitle.replace(' _ 游民星空 GamerSky.com', '')

    if (title.indexOf('囧图') !== -1) {
      title = '囧图/' + title
    } else if (title.indexOf('动态图') !== -1) {
      title = '动态图/' + title
    }

    await checkDir(title)
  }

  let src = ''
  const pTags = $('.Mid2L_con > p')

  pTags.map((index, pTag) => {
    const aTags = $(pTag).find('a')
    // 因动态动图和静态图都有 img 标签，所以靠 a 标签区分
    if (aTags.length > 0) {
      // 真实图片地址为地址的参数
      src = aTags.attr('href').split('?').pop()
    } else {
      src = $(pTag).find('img').attr('src')
    }
    // 未拿到图片地址则跳过该 p 标签
    if (!src) return;

    let discription = $(pTag).last().text().replace(/(\n)|(\s)/g, '')
    discription = discription && (' ' + discription)

    const ext = '.' + src.split('.').pop()

    const name = `${title}/${page}-${picArr.length + 1}` + discription + ext

    picArr.push({ src, name })
  })

  return picArr;
}

module.exports = getPics;
