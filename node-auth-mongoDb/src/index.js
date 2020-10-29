const express = require('express')
const mongooose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const cors = require('cors')
require('./passport-setup')


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

//mpngoosse
mongooose.connect(
 process.env.DB_CONNECT, 
 { 
 useUnifiedTopology: true,
  useNewUrlParser: true },() => {
    console.log('connected to db')
})

//middleware
app.use(express.json())

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////google

// parse application/x-www-form-urlencoded
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/api/user/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/user/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/posts');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/api/user/register');
})

app.listen(PORT, () => console.log(`Server listen on ${PORT}`))
