const fs = require('fs');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const handlePostFile = () => {
    const hasNestedFolders = pathname.includes('/');
    if (hasNestedFolders) {
      res.statusCode = 400;
      res.end('Nested paths are not supported');
      return;
    }

    if (fs.existsSync(filepath)) {
      res.statusCode = 409;
      res.end('File already exists');
      return;
    }

    const limitedStream = new LimitSizeStream({limit: 1000000});
    const outStream = fs.createWriteStream(filepath);

    limitedStream.pipe(outStream);

    req.on('data', (chunk) => {
      limitedStream.write(chunk);
    });

    req.on('end', () => {
      limitedStream.end();
    });

    req.on('aborted', () => {
      limitedStream.end();
      fs.unlink(filepath, () => {});
    });

    limitedStream.on('error', (err) => {
      if (err.code === 'LIMIT_EXCEEDED') {
        res.statusCode = 413;
        fs.unlink(filepath, () => {});
        res.end('Limit exceeded');
      } else {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    });

    outStream.on('finish', () => {
      res.statusCode = 201;
      res.end('File created successfully');
    });
  };

  switch (req.method) {
    case 'POST':
      handlePostFile();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
