const Temperatura = require('../models/Sagutxu')

exports.sagutxu_crear = async (req, res) => {
    const temp = new Temperatura({
        tema: req.body.tema,
        temperatura: req.body.temperatura,
        fecha: req.body.fecha
    })
    try {
        const newTemp = await temp.save()
        res.status(201).json(newTemp)
    } catch (error) {
        res.status(400).json({mensaje: error})
    }
}
