var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');

const {ObjectID} = require('mongodb');

//
// Todo.remove({}).then((res) => {
//   console.log(res);
// });


Todo.findByIdAndRemove('5b2fa2adea450a26f4ff1dc5').then((todo) => {
  console.log(todo);
});
