const mongoose= require('mongoose')
module.exports.init = async () => {
    await mongoose.connect("mongodb://localhost:27017/user_database")
}