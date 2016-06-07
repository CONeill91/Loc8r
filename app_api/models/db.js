var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to: ' + dbURI);
});

mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

var readline = require('readline');
if(process.platform === "win32"){
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT",function(){
    process.omit("SIGINT");
  });
}

var gracefulShutdown = function(msg, callback){
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through: ' + msg);
    callback();
  });
};

process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});

process.on('SIGTERM', function(){
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});

require('./locations');
