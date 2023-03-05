const { urlencoded } = require('express')
const express = require('express')
const bodyParser = require('body-parser')
var fs = require('fs')
const { isBuffer } = require('util')
var app = express()
var words = JSON.parse(fs.readFileSync('data.json'))

app.listen(3000, function(){
    console.log("Application started and listening port 3000")
})

var defaultPage = fs.readFileSync('index.html', 'utf8', (err, data) => {
        if(err){
            console.error(err)
            return
        }
    })
app.get('/', function(req, res){
    res.send(defaultPage)
})

app.get('/datachanged', function(req, res){
    res.send(fs.readFileSync('datachanged.html', 'utf8', (err, data) => {
        if(err){
            console.error(err)
            return
        }
    }))
})

var urlencodedParser = bodyParser.urlencoded({extended: false})

app.post('/add', urlencodedParser, function(req, res){
    var addKey = req.body.key
    var addValue = req.body.value
    words[addKey] = addValue
    fs.writeFile('data.json', JSON.stringify(words), function(err){
        if(err) console.log(err)
    })
    res.redirect('/datachanged')
})
app.post('/remove', urlencodedParser, function(req, res){
    var rmvKey = req.body.key
    delete words[rmvKey]
    fs.writeFile('data.json', JSON.stringify(words), function(err){
        if(err) console.log(err)
    })
    console.log(words)
    res.redirect('/datachanged')
})

app.post('/list', urlencodedParser, function(req, res){
    res.write(JSON.stringify(words, null, "    ")+"\n\nLength of data entries: "+Object.entries(words).length)
    res.end()
})

console.log(words)