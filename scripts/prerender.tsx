import React from 'react'
import { readFileSync, writeFileSync } from 'node:fs'
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
console.log('Prerendered Home into dist/index.html')
