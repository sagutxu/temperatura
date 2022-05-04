const Temperatura = require('../models/Sagutxu')

exports.sagutxu_crear = async (req, res) => {
    const temp = new Temperatura({
        temperatura: req.body.temperatura,
        humedad: req.body.humedad,
        fecha: req.body.fecha
    })
    try {
        const newTemp = await temp.save()
        res.status(201).json(newTemp)
    } catch (error) {
        res.status(400).json({mensaje: error})
    }
}
