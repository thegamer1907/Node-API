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

  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res) =>{
  //   console.log(res);
  // });

  // db.collection('Todos').deleteOne({text: 'Something to do'}).then((res) => {
  //   console.log(res);
  // });

  db.collection('Todos').findOneAndDelete({text: 'Walk the dog'}).then((res) =>{
    console.log(res);
  });

  client.close();
});
