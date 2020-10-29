const express = require('express')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const { createConnection } = require('typeorm')


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001


//middleware
app.use(express.json())
createConnection().then( async () => {
  console.log("Conneted to postgres!")
  app.use('/api/user', authRoute)
  app.use('/api/posts', postRoute)
  app.listen(PORT, () => console.log(`Server listen on ${PORT}`))
}).catch(e => console.log(e))


