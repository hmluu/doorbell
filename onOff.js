const {
  StillCamera
} = require('pi-camera-connect');
const stillCamera = new StillCamera();
const fs = require('fs');
const fetch = require('node-fetch');

const raspi = require('raspi-io');
const FormData = require('form-data');

const Gpio = require('onoff').Gpio;

let button = new Gpio(4, 'in', 'both');
let isTakingPicture = false;
button.watch((err, value) => {
  if (err) {
    console.log(err);
    
  }
  if (isTakingPicture === false) {
    isTakingPicture = true;
    const stillCamera = new StillCamera({
      width: 864,
      height: 648
    });
    stillCamera.takeImage().then(image => {
      fs.writeFileSync('event.jpg', image, {
        flag: 'w'
      });

      const form = new FormData();
      form.append('event', fs.createReadStream('event.jpg'));
      fetch('http://172.20.10.6:5000/api/v1/events', {
          method: 'POST',
          body: form,
          headers: form.getHeaders()
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          isTakingPicture = false;
        }).catch(error => {
          console.log(error.message);
          isTakingPicture = false;
        })

    });
    console.log("Button released");
  } else {
    console.log("processing image please wait");
    
  }
});

process.on('SIGINT', () => {
  button.unexport();
});