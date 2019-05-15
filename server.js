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
    console.log(`worker ${worker.process.pid} died with ${code}/${signal}`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    const httpStatusCodeOk = 200;
    const timeOut = 2500;
    const htmlString=`
      <html>
          <head>
              <link rel="shortcut icon" href="https://img.icons8.com/ios/50/000000/bug.png">
              <title>${addString('Hello', ' ', 'world', ' ', '...', '\n')}</title>
              <style>
                  body {background-color: lightgrey;}
                  h1   {color: blue;}
                  p    {color: red;}
                  span {color: green;}
              </style>
          </head>
          <body>
              <header>PORT: ${process.env.npm_package_config_port}</header>
              <main>
                  <h1>Hamburg - 2019</h1>
                  <p>
                  ${addString('Hello', ' ', 'world', ' ', '...', '\n')}
                  </p>
              </main>
              <footer id="footer"></footer>
          </body>
          <script>
              var zeit0 = performance.now();
              document.getElementById("footer").innerHTML = "Hello JavaScript!";
              var zeit1 = performance.now();
              console.log("Der Aufruf von machEtwas dauerte " + (zeit1 - zeit0) + " Millisekunden.");
          </script>
      <html>
  `;

    res.writeHead(httpStatusCodeOk, {'Content-Type': 'text/html; charset=utf-8'});

    setTimeout(() => {
      res.end(htmlString);
    }, timeOut);

  }).listen(process.env.npm_package_config_port);

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

  console.log(`Worker ${process.pid} started om port ${process.env.npm_package_config_port}`);
}
