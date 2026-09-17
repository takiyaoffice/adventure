import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const regular = path.join(__dirname, 'icon-regular.svg')
const maskable = path.join(__dirname, 'icon-maskable.svg')

await sharp(regular).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'))
await sharp(regular).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'))
await sharp(maskable).resize(512, 512).png().toFile(path.join(outDir, 'icon-maskable-512.png'))
await sharp(regular).resize(180, 180).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'))

console.log('icons generated')
