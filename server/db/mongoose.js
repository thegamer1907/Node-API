var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
var murl = '';

if(process.env.NODE_ENV) {
  murl = 'mongodb://thegamer1907:abc123***@ds161610.mlab.com:61610/todotry';
}
else {
  murl = 'mongodb://localhost:27017/TodoApp';
}

mongoose.connect(murl);

module.exports = {
  mongoose: mongoose
};
