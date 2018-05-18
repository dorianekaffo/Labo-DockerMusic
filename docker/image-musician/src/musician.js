/*
* This program simulates a muscian who plays an instrument, which publishes the sound of this instrument
*  on a multicast group.
*/

var dgram = require("dgram"); // module To set the UDP socket

const uuidv4 = require('uuid'); // module to identify the musicians


var socket = dgram.createSocket("udp4"); // UDP socket definition

var UDP_PORT = 12345;

var MULTICAST_GROUP_ADRESSE =  "239.255.22.5";

// Declaration of sounds
 var SOUNDS = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
}

// to retrieve the instrument passed as parameter when casting a musician
var instrument = process.argv[2]; 

// sets the payload to send to the listener
var message = {
    uuid: uuid(), // musician's ID
    sound: SOUNDS[instrument] // recover the sound corresponding to the instrument 
}

var payload = JSON.stringify(message); // parser the payload in Json

// to send the payload 
function sendPayload(){
	socket.send(payload, 0, payload.length, UDP_PORT,MULTICAST_GROUP_ADRESSE); 
	console.log("Data has send: " + payload );

}

// Payload sending frequency
setInterval(sendPayload,1000);


