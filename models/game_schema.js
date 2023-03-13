const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = Schema(
    {
    gameName:{type:String,required:true},
    dev:String,
    pub:String,
    year:String,
    genre:String,
    titleScreen:String,
    gameScreen:String,
    playTimeMinutes:{type:Number,min:0},
    playTimeHours:{type:Number,min:0},
    comments:['']
    }
)