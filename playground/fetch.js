//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();

//console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) =>{
  if(err)
  {
    return console.log(err);
  }
  console.log('Connected to MongoDb');
  const db = client.db('TodoApp');

  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(docs);
  // }, (err) => {
  //   console.log('Error');
  // });

  db.collection('Todos').find().count().then((docs) => {
    console.log('Todos Count');
    console.log(docs);
  }, (err) => {
    console.log('Error');
  });



  client.close();
});
