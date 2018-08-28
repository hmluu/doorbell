const { StillCamera } = require('pi-camera-connect');
const stillCamera = new StillCamera();
const fs = require('fs');
const fetch = require('node-fetch');


const raspi = require('raspi-io');
const FormData = require('form-data');
const five = require('johnny-five');
const board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {
  
  // Create a new `button` hardware instance.
  var button = new five.Button({
    pin: "P1-7",
    isPullup: true
  });
  
  button.on("hold", function() {
    console.log( "Button held" );
  });
  
  button.on("press", function() {
    console.log( "Button pressed" );
  });
  
  button.on("release", function() {
    stillCamera.takeImage().then(image => {
      fs.writeFileSync('event.jpg', image, {flag:'w'}); 

    const form = new FormData();
    form.append('event', fs.createReadStream('event.jpg'));
    fetch('http://172.20.10.6:5000/api/v1/events', { method: 'POST', body: form, headers: form.getHeaders() })
        .then(res => res.json())
        .then(json => console.log(json));
        }).catch(error => {
          console.log(error.message);
        })
    console.log( "Button released" );
  });
});