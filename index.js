const express = require('express')

const app = express()

app.get('/', (req, res) => {
  console.log('/')
  res.send('Hello world')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
