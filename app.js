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


app.all('*', (req, res) => {
    res.status(404).send("Error Not Found");
});

app.use( function(err, req, res, next){
    res.status(500).send( err.message );
} );

app.listen(port, () => console.log(`listening on port 3000`))