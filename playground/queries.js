var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');

const {ObjectID} = require('mongodb');

var id = '6b2d1e6927d9c057442e867911';

if (!ObjectID.isValid(id)){
  console.log('Not valid');
}


// Todo.find({
//   _id: id
// }).then((res) => {
//   console.log(res);
// });
//
// Todo.findOne({
//   _id: id
// }).then((res) => {
//   console.log(res);
// });


Todo.findById(id).then((res) => {
  if(!res) {
    return console.log('Id not found');
  }
  console.log(res);
}).catch((e) => {
  console.log(e);
});
