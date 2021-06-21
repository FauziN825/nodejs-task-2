const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')


app.use(express.json())

app.use('/', function (req, res, next){
    console.log('Time: ', Date())
    console.log('Request URL: ', req.originalUrl)
    console.log('Request Type: ', req.method)
    next()
})

const itemRouter = require('./src/items')
app.use('/items',itemRouter)




app.listen(port, () => console.log(`Example app listening on port port!`))