if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = obj => JSON.parse(JSON.stringify(obj))
}

const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000
app.use(express.static('./dist'))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
  res.status(200)
})

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`)
})
