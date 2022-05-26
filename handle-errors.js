const express = require('express')
const fs = require('fs/promises')

const app = express()

const catchErrors = (fn) =>(req, res, next) => fn(req, res, next).catch(next)

const handler = async (req, res) => {
  const data = await fs.readFile('/file-does-not-exist')
  res.send(data)
}

app.get('/', catchErrors(handler))

app.get('/foo', (req, res) => {
  throw new Error('BROKEN')  // npm start | npm run dev
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
