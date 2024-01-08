const mongoose =require('mongoose')

const userSchema = mongoose.Schema({//table //collectionm design //schema 
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String
})
const User = mongoose.model("user",userSchema)
module.exports = User;
 