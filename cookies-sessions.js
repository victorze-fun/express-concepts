const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))

const secretKey = process.env.SECRET || 'Shhh, its a secret!'
app.use(cookieParser(secretKey))
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}))

app.get('/session', (req, res) => {
  if (req.session.page_views) {
    req.session.page_views++
    res.send("You visited this page " + req.session.page_views + " times")
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!")
  }
})

app.get('/cookie', (req, res) => {
  res
    .cookie('theme', 'dark')
    .send('cookie')
})

app.get('/cookie/user', (req, res) => {
  const user = {
    email: 'victor@email.com',
    name: 'Victor'
  }
  res.cookie('user', user, {
    maxAge: 60 * 60 * 24 * 365 * 1000, // 1 year
    signed: true
  })

  res.send('cookie')
})

app.get('/clear', (req, res) => {
  res.clearCookie('name')
  res.send('clear cookie')
})

app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  console.log('Signed Cookies: ', req.signedCookies)
  console.log(req.session)
  res.send('Home')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
