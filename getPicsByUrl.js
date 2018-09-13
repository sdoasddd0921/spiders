const cheerio = require('cheerio')
const rp = require('request-promise')
const checkDir = require('./checkDir')
const { getPage } = require('./urlTools')

let title = ''

// 检查本地目标文件夹是否存在
const checkTitle = async $ => {
  if (title === '') {
    const rawTitle = $('title').text()
    title = rawTitle.replace(' _ 游民星空 GamerSky.com', '')

    const indexes = [
      { name: '囧图' },
      { name: '动态图' },
      {
        name: '轻松一刻',
        callback: title => title.replace('轻松一刻：', '')
      }
    ]
    for (let i = 0, len = indexes.length; i < len; i++) {
      if (title.indexOf(indexes[i].name) !== -1) {
        if (typeof indexes[i].callback === 'function') {
          title = indexes[i].callback(title)
        }
        title = indexes[i].name + '/' + title
        break;
      }
    }

    await checkDir(title)
  }
}

const getPics = async url => {
  const picArr = []
  const page = getPage(url)
  const options = {
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    },
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options).catch(() => null)

  if ($ === null) return picArr;

  await checkTitle($)

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

      const ext = '.' + src.split('.').pop()
    
      discription = discription.replace(/(\n)|(\s)/g, '')
      discription = discription && (' ' + discription)
    
      const name = `${title}/${page}-${picArr.length + 1}` + discription + ext
      picArr.push({ src, name })
    })
  }

  return picArr;
}

module.exports = getPics;
