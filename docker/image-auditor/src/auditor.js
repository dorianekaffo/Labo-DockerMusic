/*
 This program simulates a "data collection station", which joins a multicast
 group in order to receive measures published by thermometers (or other sensors).
 The measures are transported in json payloads with the following format:
   {"timestamp":1394656712850,"location":"kitchen","temperature":22.5}
 Usage: to start the station, use the following command in a terminal
   node station.js
*/

/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * thermometer.js and station.js. The address and the port are part of our simple 
 * application-level protocol
 */
var net = require('net');

var HashMap = require('hashmap');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');


// let's create a TCP server
var server = net.createServer();

var instruments = new HashMap();
/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
var s = dgram.createSocket('udp4');

s.bind(12345, function() {
    console.log("Joining multicast group");
    s.addMembership("239.255.22.5");
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */

s.on('message', function(msg, source) {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
    var msgInbound = JSON.parse(msg);

    // update the list with the inbound message
    if (instruments.has(msgInbound.uuid)) {
        instruments.delete(msgInbound.uui);
    }

    // chercher l'instrument correspondant au son réçu dans le paylaod UDP 
    var tmpInstrument;
    instrumentSound.forEach(element => {
        if (msgInbound.sound == element.sound)
            tmpInstrument = element.instrument;
    })



    //Creation d'un objet dinamique selon le protocole TCP pour le payload	suivant 
    //le format ci-dessous:
    // {"uuid": valeur_a_changer, "instrument":, "activeSince": date_changer}

    var payloadElementTCP = {
        uuid: msgInbound.uuid,
        instrument: tmpInstrument,
        activeSince: new Date().toISOString()
    };
    console.log("ADD to my MAP :" + JSON.stringify(payloadElementTCP));
    instruments.set(msgInbound.uuid, payloadElementTCP);

    console.log("MAP VIEW :" + JSON.stringify(instruments.values()));

});

var InstrumentObject = function(InstrumentName, InstrumentSound) {
        this.instrument = InstrumentName,
            this.sound = InstrumentSound
    }
    // tableau de correspondance entre l'instrument et son son
var instrumentSound = [new InstrumentObject("piano", "ti-ta-ti"),
    new InstrumentObject("trumpet", "pouet"),
    new InstrumentObject("flute", "trulu"),
    new InstrumentObject("violin", "gzi-gzi"),
    new InstrumentObject("drum", "boum-boum")
];

// let's create a TCP server and send the data
// source: https://gist.github.com/tedmiston/5935757

var server = net.createServer(function(socket) {


    //Enlever les musiciens inactifs 
    instruments.forEach((value, key) => {
        if (Date.now() - Date.parse(value.activeSince) > 5000)
            instruments.delete(key);
    });

    console.log("CONNECTED: " + socket.remoteAddress + ' : ' + socket.remotePort);

    var payloadTCP = JSON.stringify(instruments.values()) + "\r\n";
    // envoyer un tableau JSON.stringify("tableau")
    socket.write(payloadTCP);

    socket.destroy();
});

server.listen(2205);