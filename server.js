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

//middleware
//converts logged minutes to hours for /show route
app.use('/last.am/show/:id', (req, res, next) => {
  GameDB.findById(req.params.id).then((data) => {

    for (let i = data.playTimeMinutes; i > 59; i -= 60) {
      GameDB.findByIdAndUpdate(req.params.id, { $inc: { playTimeHours: 1, playTimeMinutes: -60 } }).then((data1) => {
      })
    }
    next()
  }).catch((error) => {
    console.log(error)
  })
})

//start render routes

//main page, displays all games in db
app.get('/last.am', (req, res) => {
  GameDB.find({}).sort({gameName:-1}).then((data) => {
    res.render('index.ejs',{
      data
    })
})
})
//render /show page with game id
app.get('/last.am/show/:id', (req, res, next) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('show.ejs',{
      data
    })
  }).catch((error) => {
    console.log(error)
  })
})
//render form to add new game to db
app.get('/last.am/add_game', (req, res) => {
  res.render('add_game.ejs')
})
//render edit game page by id
app.get('/last.am/edit/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('edit.ejs',{data})
  })
})
//render form for adding comments
app.get('/last.am/comment/:id', (req,res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('new_comment.ejs',{
      data
    })
  })
})
//render time log page
app.get('/last.am/log_time/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('log_time.ejs',{data})
  })
})


//start action routes


//adds time to log in hours/minutes
app.post('/last.am/log_time/:id', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id, 
  {$inc:{playTimeHours:req.body.playTimeHours,
    playTimeMinutes:req.body.playTimeMinutes}}).then((data) => {
    res.redirect(`/last.am/show/${req.params.id}`)
  })
})
//add game to db
app.post('/last.am/add_game', (req, res) => {
  GameDB.create(req.body).then((data) => {
    res.redirect('/last.am')
  }).catch((error) => {
  if(error){
    console.log(error)
    }
  })
})
//delete comments individually
app.post('/last.am/delete_comment/:id/:index', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id, 
  { $pull:{comments:`${req.params.index}`}}).then((err,data) =>{
    res.redirect(`/last.am/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error)
  })
})
//delete db entry from /edit page
app.delete('/last.am/edit/:id', (req, res) => {
  GameDB.findByIdAndRemove(req.params.id).then((data) => {
    res.redirect('/last.am')
  })
})
//edit game details and update db
app.put('/last.am/edit_game/:id', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id, req.body).then((data) => {
    res.redirect(`/last.am/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error)
  })
})
//adds comment into array of strings
app.put('/last.am/comment/:id', (req, res) => {
  GameDB.findByIdAndUpdate(req.params.id,{$push:req.body}).then((data) => {
    res.redirect(`/last.am/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error)
  })
})

// seed route, emergency use ONLY!
// app.get('/seed', (req, res) => {
//   GameDB.create(seedDB).then((data) => {
//     res.send(data)
//   })
// })

