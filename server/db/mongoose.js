var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://thegamer1907:abc123***@ds161610.mlab.com:61610/todotry');

module.exports = {
  mongoose: mongoose
};
