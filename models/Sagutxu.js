const mongoose = require('mongoose')

const sagutxuSchema = new mongoose.Schema({
    temperatura: Number,
    humedad: Number,
    fecha: Date
})

const sagutxuModel = mongoose.model('Temperatura', sagutxuSchema)

module.exports = sagutxuModel