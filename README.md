# vCard-app
This is an example application for the use of the [vCards-js](https://github.com/enesser/vCards-js) and [qrcode](https://github.com/soldair/node-qrcode) library on a express server.

## Starting
Start the application with `docker-compose up`.  
The first time you will need to restart the application because the express app is served faster than the mongodb is initialized completly.  
The app is served under [localhost:8080](http://localhost:8080).

## Note
To make the dynamic qr code work, you will need to host this app exposed to your network and change the host url's in `source/models/VCard.js`.