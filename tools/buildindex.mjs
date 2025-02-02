// this will pull all the data

import cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'

function collectFromPage ($) {
  const out = {}
  for (const a of $('.posts article')) {
    const link = $('h2 a', a)
    const id = link.attr('href').replace('https://codeshare.frida.re/@', '').replace(/\/$/, '')
    const [likes, seen] = $('h3', a).text().split('|').map(s => s.trim())
    out[id] = {
      id,
      title: link.text(),
      description: $('p', a).text(),
      author: id.split('/').at(0),
      likes: parseInt(likes),
      seen: parseInt(seen.replace('K', '000').replace('M', '000000'))
    }
  }
  return out
}

console.log('Downloading page 1')
let $ = cheerio.load(await fetch('https://codeshare.frida.re/browse').then(r => r.text()))
const lastPage = parseInt($('.pagination li:nth-last-child(2)').text())

let all = collectFromPage($)

for (let p = 2; p < lastPage; p++) {
  console.log(`Downloading page ${p}`)
  $ = cheerio.load(await fetch(`https://codeshare.frida.re/browse?page=${p}`).then(r => r.text()))
  all = { ...all, ...collectFromPage($) }
}

await writeFile('public/codeshare.json', JSON.stringify(Object.values(all), null, 2))
