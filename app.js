if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.port || 5000

const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')

const ExpressError = require('./utils/expressError')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')

const User = require('./models/user')

mongoose.set('strictQuery', false)//to avoid depriciation warning
mongoose.connect(process.env.mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const sessionConfig = {
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', authRoutes)
app.use('/register', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/posts/:postId/comments', commentRoutes)

//static files
app.use(express.static(path.join(__dirname, "./client/build")))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { message = 'Oh!! Something went wrong', statusCode = 500 } = err
    if (process.env.NODE_ENV === "production") {
        err.stack = null;
    }
    // console.log(err)
    res.status(statusCode).json({ error: err.message })
})

app.listen(port, () => {
    console.log('Server running on port ' + port)
})
