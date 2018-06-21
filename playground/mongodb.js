//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();

//console.log(obj);

//
// var user = {name: 'Harshit', age:'20'};
//
// var {name} = user;

//console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) =>{
  if(err)
  {
    return console.log(err);
  }
  console.log('Connected to MongoDb');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err,result) => {
  //   if(err) {
  //     return console.log(err);
  //   }
  //
  //   console.log(result);
  // });

  // db.collection('Users').insertOne({
  //   name: 'Harshit Agarwal',
  //   age: '20',
  //   location: 'CBE'
  // }, (err,result) => {
  //    if(err){
  //      return console.log(err);
  //    }
  //    console.log(result.ops[0]._id.getTimestamp());
  // });



  client.close();
});
