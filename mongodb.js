const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()

app.use(express.json())

const url = "mongodb://localhost:27017"
const mongo = new MongoClient(url)

const db = {}
mongo.connect()
  .then((client) => {
    database = client.db("tripcost")
    db.trips = database.collection("trips")
    db.expenses = database.collection("expenses")
    console.log('Connected successfully to mongodb server')
  })
  .catch(console.log)

app.post("/trip", async (req, res) => {
  const result = await db.trips.insertOne({
    name: req.body.name
  })
  console.log({ result })
  res.status(200).json({ ok: true })
})

app.get("/trips", async (req, res) => {
  const items = await db.trips.find().toArray()
  res.status(200).json({ trips: items })
})

app.post("/expense", async (req, res) => {
  const { trip, date, amount, category, description } = req.body
  const result = await db.expenses.insertOne({
    trip, date, amount, category, description
  })
  console.log({ result })
  res.status(200).json({ ok: true })
})

app.get("/expenses", async (req, res) => {
  const items = await db.expenses.find({ trip: req.body.trip }).toArray()
  res.status(200).json({ expenses: items })
})

app.listen(3000, () => console.log("Server ready"))
