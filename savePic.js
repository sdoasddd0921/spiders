const fs = require('fs')
const mkdirp = require('mkdirp')
const request = require('request')

const dir = './pic'

mkdirp(dir, err => {
  if (err) {
    console.log(err)
  }
})

const savePic = inf => new Promise((resolve, reject) => {
  const targetPath = `${dir}/${inf.name.replace(':', '：')}.${inf.ext}`
  const stream = fs.createWriteStream(targetPath)
  request(inf.src).pipe(stream).on('close', err => {
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

module.exports = savePics
