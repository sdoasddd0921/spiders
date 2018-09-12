const fs = require('fs')
const request = require('request')
const config = require('./config.json')

const savePic = inf => new Promise((resolve, reject) => {
  if (!/\..{1,4}$/.test(inf.name)) {
    const ext = inf.src.split('.').pop()
    inf.name += ('.' + ext)
  }
  const targetPath = `${config.root}/${inf.name.replace(':', '：')}`
  const name = targetPath.split('/').pop().split('.')[0]
  const stream = fs.createWriteStream(targetPath)
  request(inf.src).pipe(stream).on('close', err => {
    if (err) {
      console.log(err)
      reject(err)
    } else {
      console.log(name, '\nsuccess')
      resolve(name)
    }
  })
})

const savePics = picArr => Promise.all(
  picArr.map(pic => savePic(pic))
)

const save = pics => {
  if (Array.isArray(pics)) {
    return savePics(pics);
  } else if (typeof pics === 'object') {
    return savePic(pics);
  }
}

module.exports = save;
