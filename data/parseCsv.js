const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const mkdirp = require('mkdirp')

const rawFile = fs.readFileSync(path.join(__dirname, 'collectives.csv'), { encoding: 'utf8' })

const csv = parse(rawFile, { columns: true })
  .map((row) => {
    if (row.data) {
      row.data = JSON.parse(row.data)
    }
    return row
  })

const outFile = JSON.stringify(csv)
mkdirp.sync(path.join(__dirname, '../src/data/'))
fs.writeFileSync(path.join(__dirname, '../src/data/collectives.json'), outFile, { encoding: 'utf8' })
