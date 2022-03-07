# TILIA-NODEJS-SDK

The core of this package is the Node JS SDK which can be found in `/sdk` *(please see `/sdk/README.md` for information on how to use)*.

The code wraps the most common Tilia API calls.  

It is only meant to be run on a Node server and should never be used within the browser context as the client credentials required to interact with the api are critically sensitive.

Please make sure all security precautions are used when storing and interacting with your client credentials and all endpoints that interact with Tilia are user authenticated and encrypted.

<br />

## Dev mode for both SDK and example-server *(requires .env file in /sdk)*
```
$ cd sdk/ && npm start
```
```
$ cd example-server/ && npm run dev
```
Example server can be interacted with at: `http://0.0.0.0:7000`

<br />

## Build example server
To build the Node Express example server:
```
$ ./buildExampleServer.sh
```
The generated build can then be found at: `example-server/dist/express-example`

See `example-server/dist/express-example/README.md` for more info on the example server.

