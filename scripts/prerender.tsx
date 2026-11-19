import React from 'react'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import Home from '../src/pages/Home'

const outputPath = resolve(process.cwd(), 'dist/index.html')
const html = readFileSync(outputPath, 'utf8')
const app = renderToString(<Home />)
const output = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

if (output === html) {
  throw new Error('Prerender target #root was not found in dist/index.html')
}

writeFileSync(outputPath, output)

const requiredPublicFiles = ['CNAME', 'robots.txt', 'sitemap.xml', '.nojekyll', 'yandex_7685266b99ac4093.html']
for (const file of requiredPublicFiles) {
  if (!existsSync(resolve(process.cwd(), 'dist', file))) {
    throw new Error(`Required public file is missing from dist: ${file}`)
  }
}

const cname = readFileSync(resolve(process.cwd(), 'dist/CNAME'), 'utf8').trim()
if (cname !== 'nodetrace.ru') {
  throw new Error(`Unexpected CNAME value: ${cname}`)
}

const yandexVerification = readFileSync(resolve(process.cwd(), 'dist/yandex_7685266b99ac4093.html'), 'utf8')
if (!yandexVerification.includes('Verification: 7685266b99ac4093')) {
  throw new Error('Yandex verification file content does not match the existing repository')
}

const sitemapPath = resolve(process.cwd(), 'dist/sitemap.xml')
const sitemap = readFileSync(sitemapPath, 'utf8')
const lastmod = new Date().toISOString().slice(0, 10)
writeFileSync(sitemapPath, sitemap.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${lastmod}</lastmod>`))

console.log('Prerendered Home into dist/index.html')
console.log(`Checked CNAME, Yandex verification, robots.txt, .nojekyll and updated sitemap lastmod to ${lastmod}`)
