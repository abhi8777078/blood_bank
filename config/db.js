const mongoose = require('mongoose')
const colors = require('colors')


const connectDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://abhi8777078:abhi8777078@cluster0.onskm4x.mongodb.net/')
        console.log("Connected to data base".bgMagenta)
    }
    catch (err) {
        console.log(`mongodb database error ${err}`);

    }
}
module.exports = connectDB;