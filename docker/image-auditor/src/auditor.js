/*
 This program simulates a "auditor", which joins a multicast
 group in order to receive measures published by musician.
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

    // find the instrument corresponding to the sound received in the paylaod UDP 
    var tmpInstrument;
    instrumentSound.forEach(element => {
        if (msgInbound.sound == element.sound)
            tmpInstrument = element.instrument;
    })



    / **
    * Creation of a dynamic object according to the TCP protocol for the following payload
    * the format below:
    * {"uuid": value_to_change, "instrument" :, "activeSince": date_change}
    * /

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
    // correspondence table between the instrument and its sound
var instrumentSound = [new InstrumentObject("piano", "ti-ta-ti"),
    new InstrumentObject("trumpet", "pouet"),
    new InstrumentObject("flute", "trulu"),
    new InstrumentObject("violin", "gzi-gzi"),
    new InstrumentObject("drum", "boum-boum")
];

/*
* let's create a TCP server and send the data
* source: https://gist.github.com/tedmiston/5935757
*/

var server = net.createServer(function(socket) {


    //Remove inactive musicians
    instruments.forEach((value, key) => {
        if (Date.now() - Date.parse(value.activeSince) > 5000)
            instruments.delete(key);
    });

    console.log("CONNECTED: " + socket.remoteAddress + ' : ' + socket.remotePort);

    var payloadTCP = JSON.stringify(instruments.values()) + "\r\n";
    // send an array JSON.stringify ("array")
    socket.write(payloadTCP);

    socket.destroy();
});

server.listen(2205);