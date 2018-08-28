const { StillCamera } = require("pi-camera-connect");
const stillCamera = new StillCamera();
const fs = require("fs");


const raspi = require('raspi-io');
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
      fs.writeFileSync("still-image.jpg", image, {flag:'w'}); 
    }); 
    console.log( "Button released" );
  });
});