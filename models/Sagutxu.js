const mongoose = require('mongoose')

const sagutxuSchema = new mongoose.Schema({
    tema: String,
    temperatura: Number,
    fecha: Date
})

const sagutxuModel = mongoose.model('Temperatura', sagutxuSchema)

module.exports = sagutxuModel