const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mqtt = require('mqtt');
const fetch = require('node-fetch');

app.use(express.json());

conectarBD().catch(err => console.log(err));

async function conectarBD() {
    await mongoose.connect('mongodb+srv://sagutxuninja:Almi1234@retobd.lkzrt.mongodb.net/sagutxu?retryWrites=true&w=majority');
    console.log('Conexión a la BD correcta');
}

var client = mqtt.connect("mqtt://18.206.80.152");
//var client  = mqtt.connect("mqtt://test.mosquitto.org",{clientId:"mqttjs01"});

client.on("connect", function() {	
    console.log("MQTT connected");
});

client.subscribe("temperatura/#");

client.on('message', function(topic, message, packet) {
	console.log("Topic is "+ topic);
	console.log("Message is "+ message);
    subirTemperatura(message, topic);
});

async function subirTemperatura(message, topic) {
    let mensajeLimpio = message.toString();

    var today = new Date();
    //var dd = String(today.getDate()).padStart(2, '0');
    //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //var yyyy = today.getFullYear();

    //today = mm + '/' + dd + '/' + yyyy;

    let sagutxu = {
        tema: topic,
        temperatura: mensajeLimpio,
        fecha: today
    };
    
    await fetch('http://localhost:3000/temperatura', {
        method: 'POST',
        body: JSON.stringify(sagutxu),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(json));
}

const sagutxuController = require('./routes/sagutxu_controller.js');
app.use('/temperatura', sagutxuController);

app.listen(3000);