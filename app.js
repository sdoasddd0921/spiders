const fs = require('fs')
const getPics = require('./getPicsByUrl')
const savePics = require('./savePic')
const { getUrlByPage } = require('./urlTools')

const gsUrl = fs.readFileSync('./url').toString()

let currPage = 1

const app = async (url) => {
  let pics = await getPics(url)
  if (pics.length > 0) {
    await savePics(pics)
    app(getUrlByPage(++currPage))
  } else {
    console.log('all finished')
  }
}

app(gsUrl)
