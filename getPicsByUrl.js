const c = require('cheerio')
const sa = require('superagent')
const checkDir = require('./checkDir')
const { getPage } = require('./urlTools')

let title = ''

const getPics = async url => {
  const page = getPage(url)

  const pageText = await sa.get(url)
    .then(res => res.text)
    .catch(err => {
      console.log(err)
      return null;
    })

  if (!pageText) {
    return [];
  }

  const $ = c.load(pageText)

  // 检查本地目标文件夹是否存在
  if (title === '') {
    const rawTitle = $('title')[0].children[0].data
    title = rawTitle.replace(' _ 游民星空 GamerSky.com', '')

    if (title.indexOf('囧图') !== -1) {
      title = '囧图/' + title
    } else if (title.indexOf('动态图') !== -1) {
      title = '动态图/' + title
    }

    await checkDir(title)
  }

  const pics = Array.from($('.Mid2L_con>p'))
  const picArr = []

  pics.forEach(child => {
    if (child.children[0].type !== 'tag') return;

    let src = ''

    switch (child.children[0].name) {
      case 'img':
        src = child.children[0].attribs.src
        break;
      case 'a':
        src = child.children[0].attribs.href.split('?').pop()
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

    const ext = src.split('.').pop()

    let name = (`${page}-${picArr.length + 1} ` + discription).trim()
    name = `${title}/${name}.${ext}`

    picArr.push({ src, name })
  })

  return picArr;
  
  
  // const result = await sa.get(url).then(res => {
  //   const $ = c.load(res.text)
  //   const pics = Array.from($('p[align="center"]'))
  //   const picArr = []
    
  //   pics.forEach(child => {
  //     if (child.children[0].type !== 'tag') return;

  //     let src = ''
  //     switch (child.children[0].name) {
  //       case 'img':
  //         src = child.children[0].attribs.src
  //         break;
  //       case 'a':
  //         src = child.children[0].attribs.href.split('?')[1]
  //         break;
  //     }

  //     let discription = child.children.pop()
  //     if (discription.type === 'text') {
  //       discription = discription.data
  //     } else {
  //       discription = ''
  //     }
  //     discription = discription || ''
  //     discription = discription.replace(/(\n)|(\snull)/g, '')
  //     const name = (`${page}-${picArr.length + 1} ` + discription).trim()

  //     picArr.push({ src, name })
  //   })
  //   return picArr;
  // }).catch(err => [])

  // return result;
}

module.exports = getPics
