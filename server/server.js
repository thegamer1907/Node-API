var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
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


app.post('/users/login', (req,res) => {

  User.findOne({email: req.body.email}).then((user) => {
    if(!user){
      throw new Error();
    }
    bcrypt.compare(req.body.password, user.password, function(err,result){
        if(err || result === false){
          res.status(401).send();
        }
        else {
          if(user.tokens.length > 0)
          {
            var se = _.pick(user, ['_id','email']);
            var token = user.tokens[0].token;
            res.header('x-auth',token).send(se);
          }
          else {
            var se = _.pick(user, ['_id','email']);
            user.generateAuthToken().then((token) => {
                //console.log(token);
                //console.log(se);
                res.header('x-auth',token).send(se);
            });
          }
            //console.log(token);

        }
    });

  }).catch((e) => {
    res.status(401).send();
  });
});

app.delete('/users/me/token', authenticate, (req,res) => {
  //console.log(req.user);
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server Up and Running on ${port}`);
})
