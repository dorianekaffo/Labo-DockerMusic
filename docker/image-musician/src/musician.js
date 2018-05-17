// modules

var dgram = require("dgram"); // module Pour définir le socket UDP

const uuidv4 = require('uuid/v4'); // module pour identifier les musiciens


var socket = dgram.createSocket("udp4"); // Définition du socket UDP

var UDP_PORT = 2323;

var MULTICAST_GROUP_ADRESSE =  "239.255.22.5";

// Déclaration des sons
 var SOUNDS = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
}

// pour récuper l'instrument passé en paramètre lorsqu'on lance un musicien
var instrument = process.argv[2]; 

// définit le payload à envoyer à l'auditeur
var message = {
    uuid: uuidv4(), // identifiant du musicien
    //instrument: instrument, // recupérer son instrument 
    sound: SOUNDS[instrument] // récupérer le son correspondant à l'instrument 
}

var payload = JSON.stringify(message); // parser le payload en Json

// pour envoyer le payload 
function sendPayload(){
	socket.send(payload,UDP_PORT,MULTICAST_GROUP_ADRESSE); 
	console.log("Data has send: " + payload );

}

// Frequence d'envoie du payload
setInterval(sendPayload,1000);


