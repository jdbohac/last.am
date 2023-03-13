const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = Schema(
    {
    gameName:{type:String,required:true},
    dev:String,
    pub:String,
    titleScreen:String,
    gameScreen:String,
    playTime:{type:Number,min:0},
    comments:['']
    }
)