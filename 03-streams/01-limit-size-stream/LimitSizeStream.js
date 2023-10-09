const stream = require('stream');

const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.bufferData = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    this.bufferData = Buffer.concat([this.bufferData, chunk]);
    if (this.bufferData.length > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
