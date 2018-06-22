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

  // db.collection('Todos').findOneAndUpdate(
  //   {completed:true},
  //   {
  //     $set: {
  //       completed: false
  //     }
  //   },
  //   {
  //     returnOrignal: false
  //   }
  // ).then((res) => {
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate(
    {name:'Harshit Agarwal'},
    {
      $set: {
        name: 'Andrew'
      },
      $inc: {
        age:1
      }
    },
    {
      returnOrignal: false
    }
  ).then((res) => {
    console.log(res);
  });

  client.close();
});
