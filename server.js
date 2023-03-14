const mongoose = require('mongoose')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = mongoose.connection
const seedDB = require('./models/games_data')
const GameDB = require('./models/game_schema')
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/games').then((err) => {
    console.log('mongoose running')
})
app.listen(3000, () => {
  console.log('port 3000 awaiting orders')
})

app.get('/last.am', (req, res) => {
  GameDB.find({}).sort({gameName:-1}).then((data) => {
    res.render('index.ejs',{
      data
    })
})
})

app.get('/last.am/show/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('show.ejs',{
      data
    })
  })
    
})

app.get('/last.am/comment/:id', (req,res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('new_comment.ejs',{
      data
    })
  })
})

app.use('/last.am/show/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    while (data.playTimeMinutes >= 60){
      data.playTimeMinutes -= 60
      data.playTimeHours ++
    }
  })
})
app.post('/last.am/delete_comment/:id/:index', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id, { $pull:{comments:`${req.params.index}`}}).then((err,data) =>{
    
    res.redirect(`/last.am/show/${req.params.id}`)
    
  }).catch((error) => {
    console.log(error)
  })
  })
app.put('/last.am/comment/:id', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id,{$push:req.body}).then((data) => {
    res.redirect(`/last.am/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error)
  })
})


app.get('/seed', (req, res) => {
  GameDB.create(seedDB).then((data) => {
    res.send(data)
  })
})