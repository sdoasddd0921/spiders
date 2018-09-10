const c = require('cheerio')
const sa = require('superagent')
const { getPage } = require('./urlTools')
const fs = require('fs')
const mkdirp = require('mkdirp')
const request = require('request')
const log = console.log

const url = 'https://www.gamersky.com/ent/201809/1096222_15.shtml'

const test = async () => {
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
    log(picArr)


    // return pics.map((pic, index) => {
    //   const parentTag = pic.parent.name
    //   let t = null
    //   if (parentTag === 'a') {
    //     t = pic.parent
    //   } else {
    //     t = pic
    //   }

    //   let picDiscription = ''
    //   if (t.next) {
    //     picDiscription = t.next.next.data
    //   } else {
    //     picDiscription = ''
    //   }

    //   picDiscription = picDiscription || ''
    //   picDiscription = picDiscription.replace(/(\n)|(\snull)/g, '')
    //   const src = pic.attribs.src
    //   const ext = src.split('.').pop()
    //   const name = `${page}-${index + 1} ` + picDiscription
    //   return { src, ext, name };
    // })
  }).catch(err => log(err))
}
// test()


const dir = './test'

mkdirp(dir, err => {
  if (err) {
    console.log(err)
  }
})

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
savePic(ife)

