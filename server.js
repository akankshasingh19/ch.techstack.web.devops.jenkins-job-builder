const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const R = require('ramda');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
        res.writeHead(200);

        res.end(addString('hello', ' ', 'world', ' ', '...', '\n'));
    }).listen(8000);

    /**
     * This function ...
     * @param {string} input any strings
     * @returns {string} joined strings
     */
    function addString(...input) {
        let returnValue = '';

        R.forEach(element => {
            returnValue = R.concat(returnValue, element);
        }, input);

        return returnValue;
    }

    console.log(`Worker ${process.pid} started...`);
}
