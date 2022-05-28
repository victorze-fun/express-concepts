const express = require('express')
const mongoose = require('mongoose')

const app = express()

run()
  .then(() => console.log('Connected successfully to mongodb server'))
  .catch((err) => {
    console.error(`mongoose error → ${err.message}`)
    process.exit(1)
  })

async function run() {
  await mongoose.connect('mongodb://localhost:27017/test')

  const kittySchema = new mongoose.Schema({
    name: String
  })

  kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name"
    console.log(greeting)
  }

  const Kitten = mongoose.model('Kitten', kittySchema)

  const fluffy = new Kitten({ name: 'fluffy' })
  // await fluffy.save();
  fluffy.speak()

  console.log(await Kitten.find({ name: /^fluff/ }))
}

app.get('/', (req, res) => {
  console.log('/')
  res.send('Hello world')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
