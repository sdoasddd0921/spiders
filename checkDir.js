const mkdirp = require('mkdirp')
const config = require('./config.json')

const check = dir => new Promise((resolve, reject) => {
  dir = `${config.root}/${dir}`
  mkdirp(dir, err => {
    if (err) return reject('check dir err...')
    return resolve('check dir success...')
  })
})

module.exports = check
