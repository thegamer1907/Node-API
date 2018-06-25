var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
var {authenticate} = require("./middleware/authenticate")

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo  = new Todo(req.body);

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});


app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo)
      {
        throw new Error();
      }
      res.send(todo);
  }).catch((e) => {
    return res.status(400).send();
  });
});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }

  console.log(id);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
    if(!todo) {
      throw new Error();
    }
    res.send(todo);
  }).catch((e) => {
    return res.status(400).send();
  })

});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      throw new Error();
    }

    res.send(todo);
  }).catch((e) => {
    res.status(400).send();
  });
});





app.get('/users/me', authenticate , (req,res) => {
  res.send(req.user);
});


app.post('/users',(req,res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server Up and Running on ${port}`);
})
