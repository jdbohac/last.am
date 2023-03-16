const mongoose = require('mongoose')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = mongoose.connection
const path = require('path')
// const { MongoClient } = require("mongodb");
const seedDB = require('./models/games_data')
const GameDB = require('./models/game_schema')
const paginate = require('jw-paginate')
require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static('public'))
// mongoose.connect('mongodb://localhost:27017/games').then((err) => {
//     console.log('mongoose running')
// })



const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));


// Replace the uri string with your connection string.
// const uri = "mongodb+srv://baggatoast:N13tzsche123@project2.ae928vd.mongodb.net/games?retryWrites=true&w=majority";

// const client = new MongoClient(uri);
// const connectionParams = {
//   useNewUrlParser: true,
//   // useCreateIndex: true,
//   useUnifiedTopology: true
// }
mongoose.connect(MONGODB_URI)
  



//middleware
//converts logged minutes to hours for /show route
app.use('/last.am/show/:id', (req, res, next) => {
  GameDB.findById(req.params.id).then((data) => {
    if (data.playTimeMinutes >= 60) {
      for (let i = data.playTimeMinutes; i > 59; i -= 60) {
        GameDB.findByIdAndUpdate(req.params.id, { $inc: { playTimeHours: 1, playTimeMinutes: -60 } }).then((data1) => {
        })
      }
    }
    next()
  }).catch((error) => {
    console.log(error)
  })
})
//switches between grid view and list view
app.use('/last.am/grid_view', (req, res, next) => {
  app.locals.view = 1
  next()
})
app.use('/last.am/list_view', (req, res, next) => {
  app.locals.view = 0
  next()
})


//start render routes

//main page, displays all games in db
app.get('/', (req, res) => {
if(app.locals.view !==  1){
app.locals.view = 0
}
  GameDB.find({}).sort({gameName:-1}).then((data) => {
    res.render('index.ejs',{
      data
    })
  })
})
//reroute to main page with list view
app.get('/last.am/list_view', (req, res) => {
  res.redirect('/')
})
//reroute to main page with grid view
app.get('/last.am/grid_view', (req, res) => {
  res.redirect('/')
})

//render /show page with game id
app.get('/last.am/show/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('show.ejs',{
      data
    })
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
  }).catch((error) => {
    console.log(error)
  })
})
//render form for adding comments
app.get('/last.am/comment/:id', (req,res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('new_comment.ejs',{
      data
    })
  }).catch((error) => {
    console.log(error)
  })
})
//render time log page
app.get('/last.am/log_time/:id', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    res.render('log_time.ejs',{data})
  }).catch((error) => {
    console.log(error)
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
    res.redirect('/')
  }).catch((error) => {
  if(error){
    console.log(error)
    }
  })
})
//delete comments individually
app.post('/last.am/delete_comment/:id/:index', (req, res) => {
  GameDB.findById(req.params.id).then((data) => {
    
  GameDB.findByIdAndUpdate(req.params.id,
  { $pull:{comments:data.comments[req.params.index]}}).then((data) =>{
    res.redirect(`/last.am/show/${req.params.id}`)
  }) 
  }).catch((error) => {
    console.log(error)
  })
})
//delete db entry from /edit page
app.delete('/last.am/edit/:id', (req, res) => {
  GameDB.findByIdAndRemove(req.params.id).then((data) => {
    res.redirect('/')
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

app.listen(PORT, () => {
  console.log('port 3000 awaiting orders')
})