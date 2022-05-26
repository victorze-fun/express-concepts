const path = require('path')
const crypto = require('crypto')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: false }))
const secretKey = process.env.SECRET || 'Shhh, its a secret!'
app.use(cookieParser(secretKey))

const users = {
  victorze: { name: 'Victor', username: 'victorze' }
}

salt = crypto.randomBytes(16).toString('hex')
hash = crypto
  .pbkdf2Sync('secret', salt, 1000, 64, 'sha512')
  .toString('hex')

users.victorze.salt = salt
users.victorze.hash = hash

const authenticate = (username, pass, fn) => {
  const user = users[username]

  if (!user) return fn(null, null)

  const hash = crypto
    .pbkdf2Sync(pass, user.salt, 1000, 64, 'sha512')
    .toString('hex')

  if (hash === user.hash) {
    return fn(null, user)
  }

  fn(null, null)
}

const auth = (req, res, next) => {
  if (req.signedCookies.username) {
    req.user = users[req.signedCookies.username]
    next()
  } else {
    res.redirect('/login')
  }
}

app.get('/', (req, res) => {
  res.redirect('/login')
})

// protected route
app.get('/restricted', auth, (req, res) => {
  console.log(req.user)
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>')
})

app.get('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res, next) => {
  authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) return next(err)
    if (user) {
      res.cookie('username', user.username, {
        maxAge: 60 * 60 * 24 * 365 * 1000, // 1 year
        signed: true
      })
      console.log('Authenticated as ' + user.username)
      res.redirect('back')
    } else {
      console.log('Authentication failed')
      res.redirect('/login')
    }
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Starting development server at http://localhost:${PORT}`)
})
