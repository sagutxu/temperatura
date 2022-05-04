const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mqtt = require('mqtt');
const fetch = require('node-fetch');
const sensor = require("node-dht-sensor");

app.use(express.json());

// CONEXION MONGO/ATLAS
conectarBD().catch(err => console.log(err));

async function conectarBD() {
    await mongoose.connect('mongodb+srv://sagutxuninja:Almi1234@retobd.lkzrt.mongodb.net/sagutxu?retryWrites=true&w=majority');
    console.log('Conexión a la BD correcta');
}

// CONEXION AMAZON
var client = mqtt.connect("mqtt://18.206.80.152");
//var client  = mqtt.connect("mqtt://test.mosquitto.org",{clientId:"mqttjs01"});

// CONSOLE DE BASE PARA VER SI FUNCIONA
client.on("connect", function() {	
    console.log("MQTT connected");
});

// SUSCRIPTOR MQTT
client.subscribe("temperatura/#");

client.on('message', function(topic, message, packet) {
	console.log("Topic is "+ topic);
	console.log("Message is "+ message);
    subirTemperatura(message, topic);
});

// SENSOR TEMPERATURA/HUMEDAD
setInterval(() => {
    sensor.read(11, 23, function(err, temperature, humidity) {
        if (!err) {
          console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
          if (typeof temperature !== "undefined") {
            subirTemperatura(temperature, humidity);
            publicarMqtt(temperature, humidity);
          }
        }
    });
}, 3000);

//PUBLICADOR MQTT
function publicarMqtt(temperature, humidity) {
    let tema = "temperatura";
    let mensaje = "temp: " + temperature + "ºC, humidity: " + humidity;
    client.publish(tema, mensaje);
}

//INSERT DE DATOS EN AWS
async function subirTemperatura(temperature, humidity) {

    var today = new Date();
    //var dd = String(today.getDate()).padStart(2, '0');
    //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //var yyyy = today.getFullYear();

    //today = mm + '/' + dd + '/' + yyyy;

    let sagutxu = {
        temperatura: temperature,
        humedad: humidity,
        fecha: today
    };
    
    await fetch('http://localhost:3000/temperatura', {
        method: 'POST',
        body: JSON.stringify(sagutxu),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(/*json*/));
}

const sagutxuController = require('./routes/sagutxu_controller.js');
app.use('/temperatura', sagutxuController);

app.listen(3000);