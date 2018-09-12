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
  const page = getPage(url)

  let result = ''

  const pageText = await sa.get(url)
    .then(res => res.text)
    .catch(() => null)
    if (!pageText) {
      console.log(pageText)
      return null;
    }
  if (!pageText) return [];

  const $ = c.load(pageText)

  // 检查本地目标文件夹是否存在
  if (title === '') {
    const rawTitle = $('title')[0].children[0].data
    title = rawTitle.replace(' _ 游民星空 GamerSky.com', '')

    if (title.indexOf('囧图') !== -1) {
      title = '囧图/' + title
    } else if (title.indexOf('动图') !== -1) {
      title = '动图/' + title
    }

  }

  const picArr = []
  const pTags = $('.Mid2L_con > p')
  // log(pics)


  const flag = true;

  if (!flag) return [];

  let src = ''

  pTags.map((index, pTag) => {
    const aTags = $(pTag).find('a')
    // 因动态动图和静态图都有 img 标签，所以靠 a 标签区分
    if (aTags.length > 10) {
      // 真是图片地址为地址的参数
      src = aTags.attr('href').split('?').pop()
      // log('---------------------------')
      // log(src)
    } else {
      // log('---------------------------')
      // log($(pTag).find('img').attr('src'))
      src = $(pTag).find('img').attr('src')
    }
    // 未拿到图片地址则跳过该 p 标签
    if (!src) return;

    let discription = $(pTag).last().text().replace(/(\n)|(\s)/g, '')
    discription = discription && (' ' + discription)

    const ext = '.' + src.split('.').pop()

    const name = `${title}/${page}-${picArr.length + 1}` + discription + ext

    picArr.push({ src, name })
    log('---------------------------')
    log(name)

    


    // get discriptions
    // log($(pTag).last().text().replace(/(\n)|(\s)/g, ''))

  })
  // log($('title').text())

  // pics.map(child => {
  //   log($('a', child).length)
  //   if (!child.children[0] || child.children[0].type !== 'tag') return;

  //   let src = ''

  //   switch (child.children[0].name) {
  //     case 'img':
  //       src = child.children[0].attribs.src
  //       break;
  //     case 'a':
  //       src = child.children[0].attribs.href.split('?').pop()
  //       break;
  //   }

  //   let discription = child.children.pop()

  //   if (discription.type === 'text') {
  //     discription = discription.data
  //   } else {
  //     discription = ''
  //   }
  //   discription = discription || ''
  //   discription = discription.replace(/(\n)|(\snull)/g, '')

  //   let name = (`${page}-${picArr.length + 1} ` + discription).trim()
  //   name = `${title}/${name}`

  //   picArr.push({ src, name })
  // })
  // log(picArr);
}
test()


const dir = './test'

// mkdirp(dir, err => {
//   if (err) {
//     console.log(err)
//   }
// })

const savePic = inf => new Promise((resolve, reject) => {
  console.log(inf.src)
  const ext = inf.src.split('.').pop()
  const targetPath = `${dir}/${inf.name.replace(':', '：')}.${ext}`
  const stream = fs.createWriteStream(targetPath)
  const options = {
    url: inf.src,
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; QQDownload 627; TencentTraveler 4.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) )'
    }
  }
  request(options).pipe(stream).on('close', err => {
    if (err) {
      console.log(err)
      reject(err)
    } else {
      console.log(inf.name, '\nsuccess')
      resolve()
    }
  })
})

const savePics = picArr => Promise.all(
  picArr.map(pic => savePic(pic))
)

const ife = {
  src: 'http://www.gamersky.com/showimage/id_gamersky.shtml?http://img1.gamersky.com/image2018/09/20180906_ls_141_2/gamersky_033origin_065_2018961716235.jpg',
  name: 'test'
}
// savePic(ife)

