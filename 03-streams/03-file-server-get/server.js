const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const handleGetFile = () => {
    const hasNestedFolders = pathname.includes('/');
    if (hasNestedFolders) {
      res.statusCode = 400;
      res.end('Nested paths are not supported');
      return;
    }

    const readStream = fs.createReadStream(filepath);
    readStream.on('error', (err) => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    });
    readStream.pipe(res);
  };

  switch (req.method) {
    case 'GET':
      handleGetFile();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
