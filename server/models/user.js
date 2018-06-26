var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var {ObjectID} = require('mongodb');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: `{value} is not a valid email`
      }
    },
    password: {
      type:String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access:{
        type: String,
        require: true
      },
      token: {
        type:String,
        require:true
      }
    }]
  }
);

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });

};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  //console.log(token);
  return user.update({
    $pull: {
      tokens:{token}
    }
  })
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token,'abc123');
  } catch(e) {
    return Promise.reject();
  }
  //console.log(decoded);
  return User.findOne({
    '_id': new ObjectID(decoded._id),
    'tokens.token':token
  });
};


UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }

});

var User = mongoose.model('User', UserSchema);


module.exports = {User};
