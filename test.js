const c = require('cheerio')
const sa = require('superagent')
const { getPage } = require('./urlTools')
const fs = require('fs')
const mkdirp = require('mkdirp')
const request = require('request')
const checkDir = require('./checkDir')
const log = console.log

const url = 'https://www.gamersky.com/ent/201808/1083126_31.shtml'

let title = ''

const test = async () => {
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
  let discription = ''
  const imgs = $('.Mid2L_con img')

  if (imgs.length < 0) {
    return;
  } else if (imgs.length === 1) {
    // 特殊情况：只有1张图，但是描述不在同一父 p 标签里。
    if (imgs.parent().prop('name') === 'p') {
      src = imgs.attr('src')
    } else if (imgs.parent().prop('name') === 'a') {
      src = imgs.parent().prop('href').split('?').pop()
    }
    $('.page_css').remove()
    discription = $('.Mid2L_con').text().replace(/(\n)|(\s)/g, '')
    discription = discription && (' ' + discription)

    const ext = '.' + src.split('.').pop()
    const name = `${title}/${page}-${picArr.length + 1}` + discription + ext
    
    picArr.push({ src, name })
  } else {
    imgs.each((index, img) => {
      const parentTag = $(img).parent()
  
      if (parentTag.prop('name') === 'p') {
        src = $(img).attr('src')
        discription = parentTag.text()
      } else if (parentTag.prop('name') === 'a') {
        src = $(img).parent().attr('href').split('?').pop()
        discription = parentTag.parent().text()
      }
  
      // log($(img).parent().parent().prop('name'))
      // let big = $('.Mid2L_con')
      // $('.page_css').remove()
      // log(big.text())
      // log('---')
      
        const ext = '.' + src.split('.').pop()
      
        discription = discription.replace(/(\n)|(\s)/g, '')
        discription = discription && (' ' + discription)
      
        const name = `${title}/${page}-${picArr.length + 1}` + discription + ext
        picArr.push({ src, name })
    })
  }
  log(picArr)

  // pTags.map((index, pTag) => {
  //   const aTags = $(pTag).find('a')
  //   // 因动态动图和静态图都有 img 标签，所以靠 a 标签区分
  //   if (aTags.length > 0) {
  //     // 真实图片地址为地址的参数
  //     src = aTags.attr('href').split('?').pop()
  //   } else {
  //     src = $(pTag).find('img').attr('src')
  //   }
  //   // 未拿到图片地址则跳过该 p 标签
  //   if (!src) return;

  //   let discription = $(pTag).last().text().replace(/(\n)|(\s)/g, '')
  //   discription = discription && (' ' + discription)

  //   const ext = '.' + src.split('.').pop()

  //   const name = `${title}/${page}-${picArr.length + 1}` + discription + ext

  //   picArr.push({ src, name })
  // })
}
test()
